import os
import pandas as pd
from supabase import create_client, Client

# --- CONFIGURAÇÕES ---
# Coloque suas chaves do Supabase aqui (estão no Project Settings > API)
URL_SUPABASE = "https://mnhomtcwivrzgykllmmn.supabase.co"
CHAVE_SUPABASE = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uaG9tdGN3aXZyemd5a2xsbW1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxOTA5MTEsImV4cCI6MjA4NDc2NjkxMX0.cPJJ7hiYv9ayQ0DVuKKkIqY7C3t8uT2_K4QJeL4hlj4"
NOME_ARQUIVO = "produtos.xlsx"  # O nome da sua planilha

# --- 1. CONEXÃO COM O BANCO ---
print("🔌 Conectando ao Supabase...")
supabase: Client = create_client(URL_SUPABASE, CHAVE_SUPABASE)

# --- 2. LEITURA INTELIGENTE DA PLANILHA ---
try:
    print(f"📖 Lendo o arquivo {NOME_ARQUIVO}...")
    # Lê o Excel
    df = pd.read_excel(NOME_ARQUIVO)
    
    # Remove linhas vazias se houver
    df = df.dropna(how='all')
    
    # --- 3. LIMPEZA E TRADUÇÃO DOS DADOS ---
    print("🧹 Tratando os dados...")

    # Função para arrumar o preço (trocar vírgula por ponto)
    def limpar_preco(valor):
        if isinstance(valor, str):
            # Remove R$ se tiver e troca vírgula por ponto
            return float(valor.replace('R$', '').replace('.', '').replace(',', '.').strip())
        return float(valor)

    # Aplica a limpeza no preço
    if 'PRECO' in df.columns:
        df['PRECO'] = df['PRECO'].apply(limpar_preco)

    # Garante que Código de Barras e ID sejam texto (para não cortar zeros a esquerda)
    df['CODIGO_BARRAS'] = df['CODIGO_BARRAS'].astype(str).str.replace('.0', '', regex=False)
    df['ID'] = df['ID'].astype(str).str.replace('.0', '', regex=False)

    # Mapeia as colunas do Excel (Sua Imagem) para o Banco de Dados (Supabase)
    # Esquerda: Coluna do Excel | Direita: Coluna do Supabase
    df_renomeado = df.rename(columns={
        "ID": "external_id",
        "DESCRICAO": "name",
        "CODIGO_BARRAS": "barcode",
        "DEPARTAMENTO": "department",
        "PRECO": "price"
    })

    # Seleciona apenas as colunas que nos interessam
    colunas_finais = ["external_id", "name", "barcode", "department", "price"]
    # Filtra o DataFrame para garantir que só vamos enviar o que existe
    df_pronto = df_renomeado[colunas_finais]

    # Converte para lista de dicionários (formato que o Supabase aceita)
    dados_para_envio = df_pronto.to_dict(orient='records')

    # --- 4. ENVIO (UPSERT) ---
    # Upsert é inteligente: se o ID já existir, ele atualiza o preço/nome. Se não, ele cria.
    print(f"🚀 Enviando {len(dados_para_envio)} produtos para a nuvem...")
    
    # Envia em lotes de 1000 para não travar se a planilha for gigante
    tamanho_lote = 1000
    for i in range(0, len(dados_para_envio), tamanho_lote):
        lote = dados_para_envio[i:i + tamanho_lote]
        response = supabase.table('products').upsert(lote, on_conflict='external_id').execute()
        print(f"   ✅ Lote {i} a {i+len(lote)} processado.")

    print("\n🎉 SUCESSO! Todos os produtos foram sincronizados.")

except FileNotFoundError:
    print(f"❌ ERRO: Não encontrei o arquivo '{NOME_ARQUIVO}' na pasta.")
except Exception as e:
    print(f"❌ ERRO: Deu ruim. O erro foi: {e}")