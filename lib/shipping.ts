// lib/shipping.ts

// Lista baseada no mapa da Prefeitura de Porto Velho para ZONA 3
const ZONA_3_BAIRROS = [
  "AEROCLUBE",
  "AREIA BRANCA",
  "CALADINHO",
  "CASTANHEIRA",
  "CIDADE DO LOBO",
  "COHAB",
  "COHAB FLORESTA",
  "NOVO HORIZONTE",
  "CONCEICAO",
  "ELDORADO",
  "CIDADE NOVA",
  "JARDIM SANTANA"
];

// Define o tipo do retorno para o TypeScript não reclamar
type ShippingResult = {
  price: number;
  label: string;
};

export function calculateShipping(bairro: string): ShippingResult {
  // CORREÇÃO: Se não tiver bairro, retorna objeto com preço 0, não apenas o número 0.
  if (!bairro) {
    return { price: 0, label: 'A calcular' }; 
  }

  const bairroFormatado = bairro.toUpperCase().trim();
  
  // Verifica se é Zona 3 (Frete Grátis)
  const isZona3 = ZONA_3_BAIRROS.some(z3 => bairroFormatado.includes(z3));

  if (isZona3) {
    return { price: 0, label: 'Grátis (Zona 3)' };
  }

  // Outras zonas
  return { price: 15.00, label: 'Entrega Rápida' };
}