import pandas as pd
from supabase import create_client, Client
import os
import re
from dotenv import load_dotenv

# --- CONFIGURAÇÃO ---
# Carrega as variáveis do arquivo .env
load_dotenv()

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")

# Verifica se as chaves foram carregadas
if not SUPABASE_URL or not SUPABASE_KEY:
    print("❌ ERRO CRÍTICO: Variáveis de ambiente não encontradas.")
    print("Certifique-se de ter criado o arquivo .env com NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY")
    exit()

ARQUIVO_PRODUTOS = "produtos.xlsx" 

def conectar_supabase():
    return create_client(SUPABASE_URL, SUPABASE_KEY)

# --- A INTELIGÊNCIA (Define Unidade vs Peso) ---
def definir_tipo_venda(nome):
    nome = str(nome).lower().strip()
    
    # REGRA 1: Unidade (número + medida). Ex: "5kg", "500g", "2 litros"
    padrao_unidade = r'(\d+)([\.,]?\d*)?\s*(kg|g|l|ml|litros)'
    if re.search(padrao_unidade, nome):
        return 'unit'
    
    # REGRA 2: Peso/Granel (palavras chave soltas). Ex: "Fraldinha KG"
    padrao_peso = r'(kg|kilo|quilo|granel)'
    if re.search(padrao_peso, nome):
        return 'bulk'
    
    return 'unit'

def importar_produtos():
    supabase = conectar_supabase()
    print(f"📡 Conectado ao Supabase: {SUPABASE_URL}")
    print(f"📂 Lendo arquivo: {ARQUIVO_PRODUTOS}...")
    
    try:
        if ARQUIVO_PRODUTOS.endswith('.csv'):
            df = pd.read_csv(ARQUIVO_PRODUTOS)
        else:
            df = pd.read_excel(ARQUIVO_PRODUTOS)
    except FileNotFoundError:
        print(f"❌ ERRO: O arquivo '{ARQUIVO_PRODUTOS}' não foi encontrado.")
        return

    # Normalização de colunas
    df.columns = df.columns.str.lower().str.strip()
    coluna_nome = 'descricao' if 'descricao' in df.columns else 'nome'
    
    if coluna_nome not in df.columns:
        print(f"❌ ERRO: Coluna de nome não encontrada. Colunas disponíveis: {df.columns.tolist()}")
        return

    print("🚀 Iniciando importação segura...")
    
    sucesso = 0
    erros = 0
    ignorados = 0
    
    for index, row in df.iterrows():
        try:
            nome_produto = str(row[coluna_nome]).strip()
            
            # Validação: Ignora linhas sem nome
            if not nome_produto or nome_produto.lower() == 'nan':
                continue

            # Tratamento de Preço
            preco_raw = str(row.get('preco', '0')).replace(',', '.')
            try:
                preco = float(preco_raw)
            except ValueError:
                preco = 0.0

            # Validação: Preço deve ser positivo
            if preco <= 0:
                print(f"⚠️  Ignorado (Preço Inválido): {nome_produto}")
                ignorados += 1
                continue

            depto = row.get('departamento', 'Geral')
            if pd.isna(depto): depto = 'Geral'

            tipo_venda = definir_tipo_venda(nome_produto)
            
            produto = {
                "name": nome_produto,
                "price": preco,
                "description": nome_produto,
                "department": str(depto),
                "type_sale": tipo_venda,
                # Mantém a imagem vazia por enquanto, mas preparado para receber URL
                "image_url": str(row.get('imagem_url', '')) if not pd.isna(row.get('imagem_url')) else ""
            }
            
            # Upsert
            data, count = supabase.table('products').upsert(produto, on_conflict='name').execute()
            
            print(f"✅ [{tipo_venda.upper()}] R$ {preco:.2f} - {nome_produto}")
            sucesso += 1
            
        except Exception as e:
            print(f"❌ Erro na linha {index}: {e}")
            erros += 1
            
    print(f"\n--- RELATÓRIO FINAL ---")
    print(f"✅ Importados: {sucesso}")
    print(f"⚠️  Ignorados: {ignorados}")
    print(f"❌ Erros: {erros}")

if __name__ == "__main__":
    importar_produtos()