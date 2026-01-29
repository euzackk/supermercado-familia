import pandas as pd
from supabase import create_client, Client
import os
import re
from dotenv import load_dotenv
import time

# --- CONFIGURAÇÃO ---
load_dotenv()

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("❌ ERRO CRÍTICO: Variáveis de ambiente não encontradas no .env")
    exit()

ARQUIVO_PRODUTOS = "produtos.xlsx" 

# Cria a conexão
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def carregar_dataframe():
    """Lê o arquivo Excel ou CSV e normaliza colunas"""
    print(f"📂 Lendo arquivo: {ARQUIVO_PRODUTOS}...")
    try:
        if ARQUIVO_PRODUTOS.endswith('.csv'):
            df = pd.read_csv(ARQUIVO_PRODUTOS)
        else:
            df = pd.read_excel(ARQUIVO_PRODUTOS)
    except FileNotFoundError:
        print(f"❌ ERRO: O arquivo '{ARQUIVO_PRODUTOS}' não foi encontrado.")
        return None

    # Normalizar nomes das colunas (tudo minúsculo e sem espaços extras)
    df.columns = df.columns.str.lower().str.strip()
    return df

def definir_tipo_venda(nome):
    """Define se é unit ou bulk baseado no nome"""
    nome = str(nome).lower().strip()
    padrao_unidade = r'(\d+)([\.,]?\d*)?\s*(kg|g|l|ml|litros)'
    if re.search(padrao_unidade, nome): return 'unit'
    if re.search(r'(kg|kilo|quilo|granel)', nome): return 'bulk'
    return 'unit'

def buscar_coluna(df, possiveis_nomes):
    """Tenta encontrar uma coluna no dataframe baseada numa lista de possíveis nomes"""
    for nome in possiveis_nomes:
        if nome in df.columns:
            return nome
    return None

# ==============================================================================
# MODO 1: SUBSTITUIÇÃO TOTAL (RESET)
# ==============================================================================
def modo_substituir_tudo(df):
    print("\n⚠️  PERIGO: MODO SUBSTITUIÇÃO TOTAL ⚠️")
    print("Isso irá APAGAR TODOS os produtos do banco e importar do zero.")
    confirmacao = input("Digite 'DELETAR' para confirmar: ")
    
    if confirmacao != 'DELETAR':
        print("Operação cancelada.")
        return

    print("🗑️  Apagando produtos existentes...")
    # O Supabase exige um filtro para delete. neq id -1 pega todos
    supabase.table('products').delete().neq('id', -1).execute()
    print("✅ Banco limpo. Iniciando importação...")

    sucesso = 0
    erros = 0
    
    col_nome = buscar_coluna(df, ['descricao', 'nome', 'produto'])
    col_ean = buscar_coluna(df, ['ean', 'codigo', 'codigo_barras', 'gtin', 'barcode'])
    
    for index, row in df.iterrows():
        try:
            nome = str(row[col_nome]).strip()
            if not nome or nome.lower() == 'nan': continue
            
            preco = float(str(row.get('preco', 0)).replace(',', '.'))
            depto = row.get('departamento', 'Geral')
            if pd.isna(depto): depto = 'Geral'
            
            img = str(row.get('imagem_url', '')) if not pd.isna(row.get('imagem_url')) else ""
            ean = str(row[col_ean]).strip() if col_ean and not pd.isna(row[col_ean]) else None

            produto = {
                "name": nome,
                "price": preco,
                "description": nome,
                "department": str(depto),
                "type_sale": definir_tipo_venda(nome),
                "image_url": img
            }
            # Adiciona barcode se existir na planilha
            if ean and ean.lower() != 'nan':
                 produto["barcode"] = ean

            supabase.table('products').insert(produto).execute()
            print(f"✅ Inserido: {nome}")
            sucesso += 1
        except Exception as e:
            print(f"❌ Erro linha {index}: {e}")
            erros += 1
            
    print(f"Concluído: {sucesso} inseridos, {erros} erros.")

# ==============================================================================
# MODO 2: ATUALIZAR APENAS PREÇOS
# ==============================================================================
def modo_atualizar_precos(df):
    print("\n💰 MODO ATUALIZAÇÃO DE PREÇOS")
    print("Buscando produtos no banco...")
    
    response = supabase.table('products').select('id, name, price').execute()
    db_produtos = {p['name'].lower().strip(): p for p in response.data}
    
    col_nome = buscar_coluna(df, ['descricao', 'nome', 'produto'])
    
    atualizados = 0
    ignorados = 0

    for index, row in df.iterrows():
        nome_excel = str(row[col_nome]).strip()
        chave_nome = nome_excel.lower()
        
        if chave_nome in db_produtos:
            produto_db = db_produtos[chave_nome]
            novo_preco = float(str(row.get('preco', 0)).replace(',', '.'))
            
            if abs(produto_db['price'] - novo_preco) > 0.01:
                supabase.table('products').update({'price': novo_preco}).eq('id', produto_db['id']).execute()
                print(f"🔄 Preço atualizado: {nome_excel} | R$ {produto_db['price']} -> R$ {novo_preco}")
                atualizados += 1
            else:
                ignorados += 1
        else:
            pass

    print(f"Fim. {atualizados} preços atualizados. {ignorados} mantidos.")

# ==============================================================================
# MODO 3: VERIFICAÇÃO DE DUPLICIDADE (CÓDIGO DE BARRAS)
# ==============================================================================
def modo_verificar_duplicidade():
    print("\n🕵️ MODO REMOÇÃO DE DUPLICATAS (CÓDIGO DE BARRAS)")
    
    try:
        print("Baixando todos os produtos...")
        # CORREÇÃO AQUI: Agora busca a coluna 'barcode'
        response = supabase.table('products').select('id, name, created_at, barcode').execute() 
    except Exception as e:
        print("❌ Erro ao buscar produtos. Verifique se a coluna 'barcode' existe.")
        print(f"Detalhe: {e}")
        return

    produtos = response.data
    agrupados = {}

    # Agrupa por código de barras
    for p in produtos:
        # CORREÇÃO AQUI: Pega o valor da chave 'barcode'
        ean = p.get('barcode') 
        
        if not ean or ean == 'None' or ean == '': 
            continue 
        
        if ean not in agrupados:
            agrupados[ean] = []
        agrupados[ean].append(p)

    removidos = 0
    
    for ean, lista in agrupados.items():
        if len(lista) > 1:
            print(f"⚠️  Duplicidade encontrada Barcode {ean}: {len(lista)} itens.")
            # Ordena por data (mantém o mais antigo)
            lista.sort(key=lambda x: x['created_at'])
            
            orig = lista[0]
            duplicatas = lista[1:]
            
            ids_para_deletar = [d['id'] for d in duplicatas]
            
            print(f"   -> Mantendo: {orig['name']} (ID {orig['id']})")
            print(f"   -> Apagando: {[d['name'] for d in duplicatas]}")
            
            supabase.table('products').delete().in_('id', ids_para_deletar).execute()
            removidos += len(ids_para_deletar)

    if removidos == 0:
        print("✅ Nenhuma duplicidade encontrada por código de barras.")
    else:
        print(f"🧹 Limpeza concluída. {removidos} itens duplicados removidos.")

# ==============================================================================
# MODO 4: IMPORTAÇÃO INTELIGENTE (ADICIONAR NOVOS + ATUALIZAR PREÇO)
# ==============================================================================
def modo_smart_import(df):
    print("\n🚀 MODO SMART IMPORT (Novos + Preços)")
    print("1. Baixando produtos existentes para comparar...")
    
    response = supabase.table('products').select('id, name, price').execute()
    db_produtos = {p['name'].lower().strip(): p for p in response.data}
    
    col_nome = buscar_coluna(df, ['descricao', 'nome', 'produto'])
    # Adicionado suporte a barcode aqui também
    col_ean = buscar_coluna(df, ['ean', 'codigo', 'codigo_barras', 'gtin', 'barcode'])
    
    novos = 0
    atualizados = 0
    mantidos = 0

    for index, row in df.iterrows():
        try:
            nome_raw = str(row[col_nome]).strip()
            if not nome_raw or nome_raw.lower() == 'nan': continue
            
            chave_nome = nome_raw.lower()
            novo_preco = float(str(row.get('preco', 0)).replace(',', '.'))

            # --- CASO 1: PRODUTO JÁ EXISTE ---
            if chave_nome in db_produtos:
                produto_db = db_produtos[chave_nome]
                if abs(produto_db['price'] - novo_preco) > 0.01:
                    supabase.table('products').update({'price': novo_preco}).eq('id', produto_db['id']).execute()
                    print(f"🔄 Preço: {nome_raw} | {produto_db['price']} -> {novo_preco}")
                    atualizados += 1
                else:
                    mantidos += 1
            
            # --- CASO 2: PRODUTO NOVO ---
            else:
                depto = row.get('departamento', 'Geral')
                if pd.isna(depto): depto = 'Geral'
                
                img_excel = str(row.get('imagem_url', '')) if not pd.isna(row.get('imagem_url')) else ""
                ean = str(row[col_ean]).strip() if col_ean and not pd.isna(row[col_ean]) else None

                novo_produto = {
                    "name": nome_raw,
                    "price": novo_preco,
                    "description": nome_raw,
                    "department": str(depto),
                    "type_sale": definir_tipo_venda(nome_raw),
                }
                
                if img_excel.strip():
                    novo_produto["image_url"] = img_excel
                
                # Salva o barcode se existir
                if ean and ean.lower() != 'nan':
                    novo_produto["barcode"] = ean
                
                supabase.table('products').insert(novo_produto).execute()
                print(f"✨ Novo Produto: {nome_raw}")
                novos += 1
                
        except Exception as e:
            print(f"❌ Erro linha {index}: {e}")

    print(f"\n--- RESUMO ---")
    print(f"✨ Novos cadastrados: {novos}")
    print(f"🔄 Preços atualizados: {atualizados}")
    print(f"💤 Sem alterações: {mantidos}")

# ==============================================================================
# MENU PRINCIPAL
# ==============================================================================
def main():
    print("\n📦 IMPORTADOR SUPERMERCADO FAMÍLIA")
    print("-----------------------------------")
    print("1. [PERIGO] Substituir TUDO (Apaga banco e recria)")
    print("2. Apenas Atualizar Preços (Não cadastra novos, não mexe em imagens)")
    print("3. Verificar Duplicidade (Via Código de Barras 'barcode')")
    print("4. Smart Import (Cadastra novos e atualiza preços dos antigos - SEGURO)")
    print("0. Sair")
    
    opcao = input("\nEscolha uma opção: ")
    
    if opcao == '0':
        exit()
        
    df = None
    if opcao in ['1', '2', '4']:
        df = carregar_dataframe()
        if df is None: return

    if opcao == '1':
        modo_substituir_tudo(df)
    elif opcao == '2':
        modo_atualizar_precos(df)
    elif opcao == '3':
        modo_verificar_duplicidade()
    elif opcao == '4':
        modo_smart_import(df)
    else:
        print("Opção inválida!")

if __name__ == "__main__":
    main()