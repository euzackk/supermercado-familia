'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { calculateShipping } from '@/lib/shipping';
import { MapPin, CreditCard, Send, ArrowLeft, Truck, AlertTriangle, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { items, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('PIX');
  const [loading, setLoading] = useState(true);
  
  // Estado para controle de horário
  const [isDeliveryOpen, setIsDeliveryOpen] = useState(false);

  useEffect(() => {
    // Verifica Horário de Funcionamento
    const now = new Date();
    const day = now.getDay(); // 0 = Domingo, 1 = Segunda...
    const hour = now.getHours();

    // Regras:
    // Domingo (0): 7h às 11h (fecha às 11:00 em ponto)
    // Seg-Sáb (1-6): 7h às 19h (fecha às 19:00 em ponto)
    let isOpen = false;

    if (day === 0) { // Domingo
      if (hour >= 7 && hour < 11) isOpen = true;
    } else { // Segunda a Sábado
      if (hour >= 7 && hour < 19) isOpen = true;
    }
    
    setIsDeliveryOpen(isOpen);

    // Busca dados do usuário
    async function fetchUserData() {
      if (user) {
        const { data } = await supabase.from('addresses').select('*').eq('user_id', user.id);
        if (data && data.length > 0) {
          setAddresses(data);
          setSelectedAddressId(data[0].id);
        }
      }
      setLoading(false);
    }
    fetchUserData();
  }, [user]);

  const selectedAddress = addresses.find(a => a.id === selectedAddressId);
  
  const shippingInfo = selectedAddress 
    ? calculateShipping(selectedAddress.district) 
    : { price: 0, label: 'A calcular' };

  const finalTotal = cartTotal + shippingInfo.price;

  const handleFinalize = () => {
    // Bloqueio extra no clique
    if (!isDeliveryOpen) {
      alert("As entregas estão fechadas no momento.");
      return;
    }
    if (!selectedAddress) {
      alert("Por favor, selecione ou cadastre um endereço!");
      return;
    }

    const phone = "5569992557719"; 
    const userName = user?.user_metadata?.full_name || "Cliente";
    const now = new Date();
    const dateStr = now.toLocaleDateString('pt-BR');
    const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    let message = `🧾 *PEDIDO REALIZADO - SUPERMERCADO FAMÍLIA*\n`;
    message += `📅 ${dateStr} às ${timeStr}\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    message += `👤 *CLIENTE*\n`;
    message += `Nome: *${userName}*\n\n`;

    message += `📍 *ENTREGA*\n`;
    message += `Rua: ${selectedAddress.street}, ${selectedAddress.number}\n`;
    message += `Bairro: ${selectedAddress.district}\n`;
    message += `Cidade: ${selectedAddress.city} - ${selectedAddress.uf || 'RO'}\n`;
    if (selectedAddress.complement) message += `Comp: ${selectedAddress.complement}\n`;
    
    const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${selectedAddress.street}, ${selectedAddress.number}, ${selectedAddress.city}`)}`;
    message += `🗺️ *Ver no Mapa:* ${mapLink}\n\n`;

    message += `🛒 *ITENS*\n`;
    items.forEach(item => {
      const totalItem = (item.price * item.quantity).toFixed(2).replace('.', ',');
      message += `▪️ ${item.quantity}x ${item.name} (R$ ${totalItem})\n`;
    });
    message += `\n`;

    message += `💲 *RESUMO FINANCEIRO*\n`;
    message += `Subtotal: R$ ${cartTotal.toFixed(2).replace('.', ',')}\n`;
    
    const freteTexto = shippingInfo.price === 0 ? 'GRÁTIS ✅' : `R$ ${shippingInfo.price.toFixed(2).replace('.', ',')}`;
    message += `Entrega: ${freteTexto}\n`;
    
    message += `*TOTAL: R$ ${finalTotal.toFixed(2).replace('.', ',')}*\n`;
    message += `Pagamento: *${paymentMethod}*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `Aguardo a confirmação do pedido!`;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    clearCart();
    window.open(url, '_blank');
    router.push('/');
  };

  if (items.length === 0) return null;

  return (
    <div className="min-h-screen bg-gray-50 pb-40">
      
      {/* Topo Azul */}
      <div className="bg-blue-900 text-white p-6 pb-12 rounded-b-[2.5rem] shadow-lg relative z-10">
        <div className="flex items-center gap-3 mb-4">
            <button onClick={() => router.back()} className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition">
                <ArrowLeft className="w-5 h-5"/>
            </button>
            <h1 className="text-xl font-bold">Resumo do Pedido</h1>
        </div>
        <div className="flex justify-between items-end px-2">
            <div>
                <p className="text-blue-200 text-sm">Total a pagar</p>
                <p className="text-3xl font-bold">R$ {finalTotal.toFixed(2).replace('.', ',')}</p>
            </div>
            <div className="text-right">
                <p className="text-blue-200 text-xs mb-1">Itens</p>
                <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-bold">{items.length}</div>
            </div>
        </div>
      </div>

      <div className="p-4 -mt-8 relative z-20 space-y-4">
        
        {/* AVISO DE FECHADO (Se for o caso) */}
        {!isDeliveryOpen && (
           <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-start gap-3 animate-in slide-in-from-top-2">
              <Clock className="w-6 h-6 text-red-500 shrink-0" />
              <div>
                 <h3 className="font-bold text-red-700">Entregas Encerradas</h3>
                 <p className="text-sm text-red-600">
                    O delivery funciona Seg-Sáb (07h-19h) e Dom (07h-11h). Você pode montar o carrinho, mas só conseguirá enviar amanhã.
                 </p>
              </div>
           </div>
        )}

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <MapPin className="text-orange-500 w-5 h-5"/> Onde entregar?
            </h3>
            
            {loading ? (
                <div className="h-10 bg-gray-100 rounded animate-pulse"/>
            ) : addresses.length > 0 ? (
                <div className="space-y-3">
                    {addresses.map(addr => (
                        <div 
                            key={addr.id}
                            onClick={() => setSelectedAddressId(addr.id)}
                            className={`p-3 rounded-xl border-2 cursor-pointer transition flex items-center gap-3 ${
                                selectedAddressId === addr.id 
                                ? 'border-orange-500 bg-orange-50' 
                                : 'border-gray-100 hover:border-orange-200'
                            }`}
                        >
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selectedAddressId === addr.id ? 'border-orange-500' : 'border-gray-300'}`}>
                                {selectedAddressId === addr.id && <div className="w-2 h-2 bg-orange-500 rounded-full"/>}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-gray-800 truncate">{addr.street}, {addr.number}</p>
                                <p className="text-xs text-gray-500 truncate">{addr.district} - {addr.city}</p>
                            </div>
                        </div>
                    ))}
                    <button onClick={() => router.push('/enderecos')} className="text-xs text-orange-600 font-bold hover:underline w-full text-center py-1">
                        Gerenciar endereços
                    </button>
                </div>
            ) : (
                <div className="text-center py-4 bg-orange-50 rounded-xl border border-dashed border-orange-200">
                    <AlertTriangle className="w-8 h-8 text-orange-400 mx-auto mb-2"/>
                    <p className="text-sm text-gray-600 mb-3">Você não tem endereços cadastrados.</p>
                    <button onClick={() => router.push('/enderecos')} className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-orange-600">
                        Cadastrar Agora
                    </button>
                </div>
            )}
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <CreditCard className="text-green-600 w-5 h-5"/> Pagamento
            </h3>
            <div className="grid grid-cols-2 gap-2">
                {['PIX', 'Cartão Crédito', 'Cartão Débito', 'Dinheiro'].map(method => (
                    <button
                        key={method}
                        onClick={() => setPaymentMethod(method)}
                        className={`p-2 rounded-lg text-xs font-bold border transition ${
                            paymentMethod === method 
                            ? 'bg-green-50 border-green-500 text-green-700' 
                            : 'bg-gray-50 border-gray-100 text-gray-500 hover:bg-gray-100'
                        }`}
                    >
                        {method}
                    </button>
                ))}
            </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
            </div>
            <div className="flex justify-between text-sm items-center">
                <span className="flex items-center gap-1 text-gray-600"><Truck className="w-4 h-4"/> Frete</span>
                {shippingInfo.price === 0 ? (
                    <span className="text-green-600 font-bold bg-green-100 px-2 py-0.5 rounded text-xs">GRÁTIS</span>
                ) : (
                    <span className="text-gray-800 font-bold">R$ {shippingInfo.price.toFixed(2).replace('.', ',')}</span>
                )}
            </div>
            {shippingInfo.price > 0 && <p className="text-[10px] text-gray-400 text-right">{shippingInfo.label}</p>}
            
            <div className="border-t border-gray-100 pt-3 mt-2 flex justify-between items-center">
                <span className="font-bold text-lg text-blue-900">Total</span>
                <span className="font-bold text-xl text-blue-900">R$ {finalTotal.toFixed(2).replace('.', ',')}</span>
            </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-white p-4 border-t shadow-[0_-5px_20px_rgba(0,0,0,0.05)] z-50">
        <button 
            onClick={handleFinalize}
            disabled={!selectedAddress || !isDeliveryOpen} 
            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition active:scale-[0.98] ${
                (!selectedAddress || !isDeliveryOpen)
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-green-600 text-white hover:bg-green-700 shadow-green-200'
            }`}
        >
            {isDeliveryOpen ? <Send className="w-5 h-5"/> : <Clock className="w-5 h-5"/>}
            {isDeliveryOpen ? "Finalizar no WhatsApp" : "Entrega Fechada Agora"}
        </button>
      </div>

    </div>
  );
}