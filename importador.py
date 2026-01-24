import pandas as pd
from supabase import create_client, Client
import os
import re

# --- CONFIGURAÇÃO ---
# Substitua pelas suas chaves REAIS do Supabase
SUPABASE_URL = "https://mnhomtcwivrzgykllmmn.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uaG9tdGN3aXZyemd5a2xsbW1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxOTA5MTEsImV4cCI6MjA4NDc2NjkxMX0.cPJJ7hiYv9ayQ0DVuKKkIqY7C3t8uT2_K4QJeL4hlj4"

# Nome exato do arquivo que você subiu (verifique se está na mesma pasta)
ARQUIVO_PRODUTOS = "produtos.xlsx" 

def conectar_supabase():
    return create_client(SUPABASE_URL, SUPABASE_KEY)

# --- A INTELIGÊNCIA (Define Unidade vs Peso) ---
def definir_tipo_venda(nome):
    nome = str(nome).lower().strip()
    
    # REGRA 1: É UNIDADE se tiver número colado com peso (Ex: "5kg", "1 kg", "500g", "2 litros")
    # O regex procura: Um número + espaço opcional + unidade de medida
    padrao_unidade = r'(\d+)([\.,]?\d*)?\s*(kg|g|l|ml|litros)'
    if re.search(padrao_unidade, nome):
        return 'unit'
    
    # REGRA 2: É PESO (BULK) se tiver "kg" solto e NÃO caiu na regra 1 (Ex: "Fraldinha KG")
    padrao_peso = r'(kg|kilo|quilo|granel)'
    if re.search(padrao_peso, nome):
        return 'bulk'
    
    # Padrão: Se não achou nada específico, assume Unidade
    return 'unit'

def importar_produtos():
    supabase = conectar_supabase()
    
    print(f"Lendo arquivo: {ARQUIVO_PRODUTOS}...")
    
    try:
        # Tenta ler como CSV
        if ARQUIVO_PRODUTOS.endswith('.csv'):
            df = pd.read_csv(ARQUIVO_PRODUTOS)
        else:
            df = pd.read_excel(ARQUIVO_PRODUTOS)
    except FileNotFoundError:
        print(f"ERRO: O arquivo '{ARQUIVO_PRODUTOS}' não foi encontrado na pasta.")
        return

    # Normaliza nomes das colunas para minúsculo (DESCRICAO vira descricao)
    df.columns = df.columns.str.lower()
    
    # Verifica se a coluna 'descricao' existe (antigamente procurava 'nome')
    coluna_nome = 'descricao' if 'descricao' in df.columns else 'nome'
    
    if coluna_nome not in df.columns:
        print(f"ERRO: Não encontrei a coluna 'DESCRICAO' ou 'NOME' no arquivo.")
        print(f"Colunas encontradas: {df.columns.tolist()}")
        return

    print("Iniciando importação inteligente...")
    
    sucesso = 0
    erros = 0
    
    for index, row in df.iterrows():
        try:
            # Pega os dados usando as colunas certas do seu CSV
            nome_produto = str(row[coluna_nome]).strip()
            
            # Limpa o preço (troca vírgula por ponto se necessário)
            preco_raw = str(row['preco']).replace(',', '.')
            preco = float(preco_raw)
            
            # Define o departamento (se não tiver, usa 'Geral')
            depto = row.get('departamento', 'Geral')
            if pd.isna(depto): depto = 'Geral'

            # --- APLICA A INTELIGÊNCIA ---
            tipo_venda = definir_tipo_venda(nome_produto)
            
            # Monta o objeto para o Supabase
            produto = {
                "name": nome_produto,
                "price": preco,
                "description": nome_produto, # Usa o nome como descrição se não tiver outra
                "department": str(depto),
                "type_sale": tipo_venda,  # <--- O CAMPO MÁGICO
                "image_url": "" # Se tiver coluna de imagem, mude aqui
            }
            
            # (Opcional) Se tiver Código de Barras no CSV, pode usar:
            # if 'codigo_barras' in row: produto['code'] = row['codigo_barras']

            # Envia para o banco (Upsert pelo nome para não duplicar)
            data, count = supabase.table('products').upsert(produto, on_conflict='name').execute()
            
            # Mostra no terminal o que ele decidiu (UNIT ou BULK)
            print(f"✅ [{tipo_venda.upper()}] {nome_produto}")
            sucesso += 1
            
        except Exception as e:
            print(f"❌ Erro na linha {index}: {e}")
            erros += 1
            
    print(f"\n--- FIM ---")
    print(f"Produtos importados/atualizados: {sucesso}")
    print(f"Erros: {erros}")

if __name__ == "__main__":
    importar_produtos()