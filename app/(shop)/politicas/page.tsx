'use client';

import { ArrowLeft, ShieldCheck, FileText, AlertCircle, Scale, Truck, Ban } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PoliticasPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm flex items-center gap-3 sticky top-0 z-10 border-b border-gray-100">
        <button onClick={() => router.back()} className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition">
          <ArrowLeft className="w-5 h-5 text-gray-600"/>
        </button>
        <h1 className="text-xl font-bold text-blue-900">Termos e Políticas</h1>
      </div>

      <div className="max-w-3xl mx-auto p-6 space-y-8">
        
        {/* Cabeçalho da Empresa */}
        <div className="bg-blue-900 text-white p-6 rounded-2xl shadow-lg">
           <h2 className="text-2xl font-bold mb-2">Central de Transparência</h2>
           <div className="text-sm text-blue-100 space-y-1">
              <p><strong>Razão Social:</strong> Saura LTDA</p>
              <p><strong>Nome Fantasia:</strong> Supermercado Família</p>
              <p><strong>CNPJ:</strong> 08.820.217/0001-50</p>
              <p><strong>Endereço:</strong> Rua Principal, 1675, Letra A - Novo Horizonte, Porto Velho/RO</p>
           </div>
        </div>

        {/* 1. Política de Privacidade (LGPD) */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
           <div className="flex items-center gap-3 mb-4 text-blue-900 border-b border-gray-100 pb-2">
              <ShieldCheck className="w-6 h-6" />
              <h3 className="text-xl font-bold">1. Política de Privacidade e Proteção de Dados</h3>
           </div>
           <div className="text-sm text-gray-600 space-y-3 leading-relaxed text-justify">
              <p>
                 Em conformidade com a <strong>Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018)</strong>, o <strong>Supermercado Família</strong> reafirma seu compromisso com a segurança e privacidade das informações de seus clientes.
              </p>
              <ul className="list-disc pl-5 space-y-2">
                 <li><strong>Coleta de Dados:</strong> Coletamos apenas os dados estritamente necessários para a operação de venda e entrega (Nome, CPF, Telefone e Endereço).</li>
                 <li><strong>Finalidade:</strong> Seus dados são utilizados exclusivamente para: processamento de pedidos, emissão de Nota Fiscal, logística de entrega e comunicação sobre o status da compra.</li>
                 <li><strong>Compartilhamento:</strong> Não vendemos nem compartilhamos seus dados com terceiros para fins publicitários. O compartilhamento ocorre apenas com órgãos fiscais (para emissão de NF) ou quando exigido por lei.</li>
                 <li><strong>Segurança:</strong> Adotamos medidas técnicas para proteger seus dados contra acessos não autorizados.</li>
              </ul>
           </div>
        </section>

        {/* 2. Política de Entrega */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
           <div className="flex items-center gap-3 mb-4 text-blue-900 border-b border-gray-100 pb-2">
              <Truck className="w-6 h-6" />
              <h3 className="text-xl font-bold">2. Política de Entrega</h3>
           </div>
           <div className="text-sm text-gray-600 space-y-3 leading-relaxed text-justify">
              <p>
                 As entregas são realizadas dentro do perímetro urbano de Porto Velho/RO, conforme as zonas de atendimento pré-estabelecidas.
              </p>
              <ul className="list-disc pl-5 space-y-2">
                 <li><strong>Horários:</strong> As entregas ocorrem de Segunda a Sábado das 08h às 19h e aos Domingos das 08h às 11h.</li>
                 <li><strong>Recebimento:</strong> É indispensável a presença de uma pessoa responsável no local para conferência e recebimento dos produtos.</li>
                 <li><strong>Tentativas:</strong> Caso não haja ninguém para receber, o pedido retornará à loja e será cobrada uma nova taxa de frete para reenvio.</li>
              </ul>
           </div>
        </section>

        {/* 3. Trocas, Devoluções e Avarias */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
           <div className="flex items-center gap-3 mb-4 text-red-600 border-b border-red-100 pb-2">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-xl font-bold">3. Trocas e Devoluções (Avarias)</h3>
           </div>
           <div className="text-sm text-gray-600 space-y-3 leading-relaxed text-justify">
              <p className="bg-red-50 p-3 rounded-lg border border-red-100 font-medium text-red-800">
                 ATENÇÃO: A conferência dos produtos é obrigatória no ato da entrega.
              </p>
              <p>
                 Dada a natureza perecível dos produtos comercializados (alimentos, refrigerados, hortifruti), o Supermercado Família adota a seguinte política restrita:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                 <li><strong>Apenas no Ato da Entrega:</strong> Reclamações sobre avarias, produtos amassados, violados ou itens faltantes serão aceitas <strong>exclusivamente no momento da entrega</strong>.</li>
                 <li><strong>Procedimento:</strong> O cliente deve conferir os itens junto ao entregador. Caso identifique qualquer problema, deve recusar o recebimento do item específico imediatamente. O entregador fará a notificação para estorno ou reposição.</li>
                 <li><strong>Pós-Entrega:</strong> Após o recebimento e assinatura do comprovante de entrega, não aceitaremos devoluções por avaria ou alegação de itens faltantes, garantindo assim a segurança sanitária de todos os nossos clientes.</li>
              </ul>
           </div>
        </section>

        {/* 4. Preços e Estoque */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
           <div className="flex items-center gap-3 mb-4 text-blue-900 border-b border-gray-100 pb-2">
              <FileText className="w-6 h-6" />
              <h3 className="text-xl font-bold">4. Preços, Ofertas e Estoque</h3>
           </div>
           <div className="text-sm text-gray-600 space-y-3 leading-relaxed text-justify">
              <ul className="list-disc pl-5 space-y-2">
                 <li><strong>Diferença de Preços:</strong> Os preços praticados no site/app podem ser diferentes dos preços da loja física. As ofertas anunciadas aqui são válidas exclusivamente para compras online.</li>
                 <li><strong>Indisponibilidade (Ruptura):</strong> Devido ao fluxo dinâmico de vendas, um produto pode esgotar no momento da separação do seu pedido.</li>
                 <li><strong>Solução para Falta de Estoque:</strong> Caso um item comprado esteja indisponível, nossa equipe entrará em contato para oferecer a substituição por item similar ou o estorno imediato do valor correspondente.</li>
              </ul>
           </div>
        </section>

        {/* 5. Transparência e Igualdade */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
           <div className="flex items-center gap-3 mb-4 text-blue-900 border-b border-gray-100 pb-2">
              <Scale className="w-6 h-6" />
              <h3 className="text-xl font-bold">5. Transparência e Igualdade</h3>
           </div>
           <div className="text-sm text-gray-600 space-y-3 leading-relaxed text-justify">
              <p>
                 Em cumprimento à <strong>Lei nº 14.611/2023 (Lei da Igualdade Salarial)</strong>, o Supermercado Família (Saura LTDA) reafirma seu compromisso com a igualdade de gênero e a não discriminação no ambiente de trabalho.
              </p>
              <p>
                 Adotamos critérios transparentes de remuneração e valorização profissional, garantindo salário igual para trabalho de igual valor, independentemente de gênero, raça ou etnia. Repudiamos qualquer forma de discriminação e mantemos canais abertos para denúncias e fiscalização.
              </p>
           </div>
        </section>

        {/* Rodapé Jurídico */}
        <div className="text-center text-xs text-gray-400 mt-8">
           <p>Este documento foi atualizado em 24 de Janeiro de 2026.</p>
           <p>Foro da Comarca de Porto Velho/RO eleito para dirimir eventuais controvérsias.</p>
        </div>

      </div>
    </div>
  );
}