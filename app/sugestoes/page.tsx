'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext'; // Importar Auth para pegar o ID do usuário
import { ArrowLeft, Send, MessageSquare, Loader2, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SugestoesPage() {
  const router = useRouter();
  const { user } = useAuth(); // Pegar usuário logado
  
  const [message, setMessage] = useState('');
  const [type, setType] = useState('Elogio');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) {
      alert("Por favor, escreva sua mensagem.");
      return;
    }

    setLoading(true);

    // 1. Salva no Supabase
    const { error } = await supabase.from('suggestions').insert({
      type,
      message,
      user_id: user?.id || null // Salva o ID se tiver logado, ou null se for anônimo
    });

    setLoading(false);

    if (error) {
      console.error(error);
      alert("Erro ao enviar sugestão. Tente novamente.");
    } else {
      setSent(true); // Mostra tela de sucesso
      
      // Opcional: Se quiser mandar no Whats TAMBÉM, descomente as linhas abaixo:
      /*
      const phone = "5569992557719"; 
      const text = `*NOVA SUGESTÃO*\n\nTipo: ${type}\nMsg: ${message}`;
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
      */
    }
  };

  // Tela de Sucesso
  if (sent) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center animate-in fade-in">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Obrigado!</h2>
        <p className="text-gray-500 mb-8">Sua mensagem foi recebida com sucesso. Agradecemos sua colaboração.</p>
        <button onClick={() => router.back()} className="text-orange-500 font-bold hover:underline">
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => router.back()} className="bg-gray-100 p-2 rounded-full hover:bg-gray-200">
          <ArrowLeft className="w-5 h-5 text-gray-600"/>
        </button>
        <h1 className="text-xl font-bold text-blue-900">Fale Conosco</h1>
      </div>

      <div className="p-6">
        <div className="bg-blue-900 rounded-2xl p-6 text-white mb-6 text-center shadow-lg shadow-blue-200">
           <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8"/>
           </div>
           <h2 className="text-xl font-bold mb-2">Ouvimos você!</h2>
           <p className="text-blue-100 text-sm">Sua opinião é fundamental para melhorarmos nosso atendimento.</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
           <label className="block text-sm font-bold text-gray-700 mb-3">Sobre o que você quer falar?</label>
           <div className="flex gap-2 mb-6">
              {['Elogio', 'Sugestão', 'Reclamação'].map(t => (
                 <button
                   key={t}
                   onClick={() => setType(t)}
                   className={`flex-1 py-2 text-xs font-bold rounded-lg border transition ${
                     type === t 
                     ? 'bg-orange-500 text-white border-orange-500' 
                     : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                   }`}
                 >
                   {t}
                 </button>
              ))}
           </div>

           <label className="block text-sm font-bold text-gray-700 mb-3">Sua mensagem</label>
           <textarea 
             rows={5}
             className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-orange-200 transition resize-none mb-6"
             placeholder="Escreva aqui..."
             value={message}
             onChange={e => setMessage(e.target.value)}
           />

           <button 
             onClick={handleSend}
             disabled={loading}
             className="w-full bg-green-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-200 hover:bg-green-700 active:scale-95 transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
           >
              {loading ? <Loader2 className="animate-spin w-5 h-5"/> : <><Send className="w-5 h-5" /> Enviar Mensagem</>}
           </button>
        </div>
      </div>
    </div>
  );
}