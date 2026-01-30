// lib/shipping.ts

// Lista de backup (Hardcoded) caso não venha do banco
const ZONA_3_BAIRROS_BACKUP = [
  "AEROCLUBE", "AREIA BRANCA", "CALADINHO", "CASTANHEIRA",
  "CIDADE DO LOBO", "COHAB", "COHAB FLORESTA", "NOVO HORIZONTE",
  "CONCEICAO", "ELDORADO", "CIDADE NOVA", "JARDIM SANTANA"
];

type ShippingResult = {
  price: number;
  label: string;
};

// Agora aceita um segundo parâmetro opcional: listaDeBairrosGratis
export function calculateShipping(bairro: string, bairrosGratisDB?: string[]): ShippingResult {
  if (!bairro) {
    return { price: 0, label: 'A calcular' }; 
  }

  const bairroFormatado = bairro.toUpperCase().trim();
  
  // Decide qual lista usar: a do banco (se existir e tiver itens) ou a de backup
  const listaVerificacao = bairrosGratisDB && bairrosGratisDB.length > 0 
    ? bairrosGratisDB 
    : ZONA_3_BAIRROS_BACKUP;

  // Verifica se o bairro está na lista (usando includes para pegar partes do nome)
  const isZona3 = listaVerificacao.some(z3 => 
    bairroFormatado.includes(z3.toUpperCase().trim())
  );

  if (isZona3) {
    return { price: 0, label: 'Grátis (Zona 3)' };
  }

  return { price: 15.00, label: 'Entrega Rápida' };
}