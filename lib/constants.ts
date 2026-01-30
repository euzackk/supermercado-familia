// lib/constants.ts

export const LOJA_CONFIG = {
  nome: "Supermercado Família",
  whatsapp: "5569992557719", 
  valorMinimo: 30.00,
  horarios: {
    domingo: { abre: 7, fecha: 13 }, // Ajuste se necessário
    semana: { abre: 7, fecha: 19 }, // Segunda a Sábado
  },
  enderecoFicticio: "Rua do Comércio, 123 - Centro"
};

// Função auxiliar para verificar se está aberto (Fuso Horário RONDÔNIA)
export function isLojaAberta(): boolean {
  // Cria uma data baseada no fuso de Porto Velho
  const timeZone = "America/Porto_Velho";
  const now = new Date(new Date().toLocaleString("en-US", { timeZone }));
  
  const day = now.getDay(); // 0 = Domingo
  const hour = now.getHours();

  if (day === 0) {
    return hour >= LOJA_CONFIG.horarios.domingo.abre && hour < LOJA_CONFIG.horarios.domingo.fecha;
  } else {
    return hour >= LOJA_CONFIG.horarios.semana.abre && hour < LOJA_CONFIG.horarios.semana.fecha;
  }
}