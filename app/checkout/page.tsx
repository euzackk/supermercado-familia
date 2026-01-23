'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { MapPin, CreditCard, Send, Trash2, ArrowLeft, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { items, cartTotal, removeFromCart, clearCart } = useCart();
  const router = useRouter();
  
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('PIX');
  const [name, setName] = useState('');

  const handleFinalize = () => {
    if (!name || !address) {
      alert("Por favor, preencha nome e endereço!");
      return;
    }

    const phone = "5569999999999"; // SUBSTITUA PELO SEU NÚMERO (COM DDD)
    
    let message = `*NOVO PEDIDO - SUPERMERCADO FAMÍLIA*\n\n`;
    message += `👤 *Cliente:* ${name}\n`;
    message += `📍 *Endereço:* ${address}\n`;
    message += `💳 *Pagamento:* ${paymentMethod}\n\n`;
    message += `*ITENS DO PEDIDO:*\n`;
    
    items.forEach(item => {
      message += `- ${item.quantity}x ${item.name}\n`;
    });

    message += `\n💰 *TOTAL:* R$ ${cartTotal.toFixed(2).replace('.', ',')}`;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    
    clearCart();
    window.open(url, '_blank');
    router.push('/');
  };

  if (items.length === 0) {
    return (
      <div className="p-8 text-center flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-xl font-bold text-gray-400 mb-4">Seu carrinho está vazio</h2>
        <button onClick={() => router.push('/')} className="bg-orange-500 text-white px-6 py-2 rounded-lg font-bold">
            Voltar às compras
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 pb-32 bg-gray-50 min-h-screen">
      <div className="flex items-center gap-2 mb-6">
        <button onClick={() => router.back()} className="p-2 bg-white rounded-full shadow-sm text-gray-600">
            <ArrowLeft className="w-5 h-5"/>
        </button>
        <h1 className="text-2xl font-bold text-blue-900">Finalizar Pedido</h1>
      </div>

      {/* Resumo dos Itens */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
        <h2 className="font-bold mb-4 text-gray-800">Resumo da Compra</h2>
        {items.map(item => (
          <div key={item.id} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
             <div className="flex items-center gap-3">
                <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded text-xs font-bold">{item.quantity}x</span>
                <span className="text-sm text-gray-700 truncate max-w-[160px]">{item.name}</span>
             </div>
             <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-gray-800">R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4"/>
                </button>
             </div>
          </div>
        ))}
        <div className="mt-4 flex justify-between items-center text-xl font-bold text-blue-900 border-t pt-4">
          <span>Total</span>
          <span>R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
        </div>
      </div>

      {/* Formulário */}
      <div className="space-y-4">
        <div className="bg-white p-4 rounded-xl shadow-sm">
           <h3 className="font-bold mb-3 flex items-center gap-2 text-gray-700"><User className="w-5 h-5 text-orange-500"/> Seus Dados</h3>
           <input 
             type="text" 
             placeholder="Seu Nome Completo" 
             className="w-full p-3 bg-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-orange-200 transition"
             value={name}
             onChange={e => setName(e.target.value)}
           />
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm">
           <h3 className="font-bold mb-3 flex items-center gap-2 text-gray-700"><MapPin className="w-5 h-5 text-orange-500"/> Endereço de Entrega</h3>
           <textarea 
             placeholder="Rua, Número, Bairro e Complemento" 
             className="w-full p-3 bg-gray-100 rounded-lg outline-none h-24 resize-none focus:ring-2 focus:ring-orange-200 transition"
             value={address}
             onChange={e => setAddress(e.target.value)}
           />
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm">
           <h3 className="font-bold mb-3 flex items-center gap-2 text-gray-700"><CreditCard className="w-5 h-5 text-orange-500"/> Forma de Pagamento</h3>
           <select 
             className="w-full p-3 bg-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-orange-200 transition"
             value={paymentMethod}
             onChange={e => setPaymentMethod(e.target.value)}
           >
             <option value="PIX">PIX (Chave Celular)</option>
             <option value="Cartão de Crédito">Cartão de Crédito (Maquininha)</option>
             <option value="Cartão de Débito">Cartão de Débito (Maquininha)</option>
             <option value="Dinheiro">Dinheiro (Precisa de troco)</option>
           </select>
        </div>
      </div>

      {/* Botão Final */}
      <div className="fixed bottom-0 left-0 w-full p-4 bg-white border-t border-gray-100 z-20 pb-8">
        <button 
            onClick={handleFinalize}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition active:scale-[0.98]"
        >
            <Send className="w-5 h-5" />
            Enviar Pedido via WhatsApp
        </button>
      </div>

    </div>
  );
}