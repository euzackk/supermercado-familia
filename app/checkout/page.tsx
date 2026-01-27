'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { calculateShipping } from '@/lib/shipping';
import { LOJA_CONFIG, isLojaAberta } from '@/lib/constants'; 
import { MapPin, CreditCard, Send, ArrowLeft, Truck, AlertTriangle, Clock, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function CheckoutPage() {
  const { items, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('PIX');
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false); // Estado para evitar duplo clique
  
  const [isDeliveryOpen, setIsDeliveryOpen] = useState(false);

  useEffect(() => {
    setIsDeliveryOpen(isLojaAberta());

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
  const isMinimumMet = cartTotal >= LOJA_CONFIG.valorMinimo;

  const handleFinalize = async () => {
    if (!user) return;
    if (!isDeliveryOpen) {
      toast.error("As entregas estão fechadas no momento.");
      return;
    }
    if (!isMinimumMet) {
      toast.error(`Pedido mínimo é R$ ${LOJA_CONFIG.valorMinimo},00`);
      return;
    }
    if (!selectedAddress) {
      toast.error("Selecione um endereço de entrega!");
      return;
    }

    setIsSending(true);
    const loadingToast = toast.loading("Salvando pedido...");

    try {
      // 1. SALVAR NO SUPABASE (TABELA ORDERS)
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total: finalTotal,
          payment_method: paymentMethod,
          status: 'pendente',
          address_snapshot: selectedAddress // Salva o endereço fixo no JSON
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. SALVAR ITENS (TABELA ORDER_ITEMS)
      const orderItems = items.map(item => ({
        order_id: orderData.id,
        product_id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        unit: item.type_sale || 'unit'
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // 3. MONTAR MENSAGEM WHATSAPP (Agora com ID do Pedido)
      const userName = user?.user_metadata?.full_name || "Cliente";
      const now = new Date();
      
      let message = `🧾 *NOVO PEDIDO #${orderData.id} - ${LOJA_CONFIG.nome.toUpperCase()}*\n`;
      message += `📅 ${now.toLocaleDateString('pt-BR')} às ${now.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}\n`;
      message += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

      message += `👤 *CLIENTE*\nNome: *${userName}*\n\n`;

      message += `📍 *ENTREGA*\n`;
      message += `${selectedAddress.street}, ${selectedAddress.number}\n`;
      message += `${selectedAddress.district} - ${selectedAddress.city}\n`;
      if (selectedAddress.complement) message += `Obs: ${selectedAddress.complement}\n`;
      
      message += `🛒 *ITENS*\n`;
      items.forEach(item => {
        const totalItem = (item.price * item.quantity).toFixed(2).replace('.', ',');
        const unit = item.type_sale === 'bulk' ? 'kg' : 'un';
        message += `▪️ ${item.quantity}${unit} ${item.name} (R$ ${totalItem})\n`;
      });
      message += `\n`;

      message += `💲 *RESUMO*\n`;
      message += `Subtotal: R$ ${cartTotal.toFixed(2).replace('.', ',')}\n`;
      message += `Entrega: R$ ${shippingInfo.price.toFixed(2).replace('.', ',')}\n`;
      message += `*TOTAL: R$ ${finalTotal.toFixed(2).replace('.', ',')}*\n`;
      message += `Pagamento: *${paymentMethod}*\n`;
      
      const url = `https://wa.me/${LOJA_CONFIG.whatsapp}?text=${encodeURIComponent(message)}`;
      
      toast.dismiss(loadingToast);
      toast.success("Pedido realizado com sucesso!");
      
      clearCart();
      window.open(url, '_blank');
      router.push('/meus-pedidos'); // Redireciona para a nova página

    } catch (error) {
      console.error(error);
      toast.dismiss(loadingToast);
      toast.error("Erro ao salvar pedido. Tente novamente.");
      setIsSending(false);
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="min-h-screen bg-gray-50 pb-40">
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
        {/* Lógica de Alertas (Mínimo, Fechado) igual ao anterior... */}
        {!isMinimumMet && (
           <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-orange-500 shrink-0" />
              <div>
                 <h3 className="font-bold text-orange-800">Valor Mínimo</h3>
                 <p className="text-sm text-orange-700">
                    Faltam <strong>R$ {(LOJA_CONFIG.valorMinimo - cartTotal).toFixed(2).replace('.', ',')}</strong> para o pedido mínimo.
                 </p>
              </div>
           </div>
        )}

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <MapPin className="text-orange-500 w-5 h-5"/> Endereço de Entrega
            </h3>
            
            {loading ? (
                <div className="h-12 bg-gray-100 rounded animate-pulse"/>
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
                </div>
            ) : (
                <button onClick={() => router.push('/enderecos')} className="bg-orange-500 text-white w-full py-2 rounded-lg text-sm font-bold">
                    Cadastrar Endereço
                </button>
            )}
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <CreditCard className="text-green-600 w-5 h-5"/> Forma de Pagamento
            </h3>
            <div className="grid grid-cols-2 gap-2">
                {['PIX', 'Dinheiro', 'Cartão Crédito', 'Cartão Débito'].map(method => (
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
             {/* Resumo de valores (igual ao anterior) */}
             <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
            </div>
            <div className="flex justify-between text-sm items-center">
                <span className="flex items-center gap-1 text-gray-600"><Truck className="w-4 h-4"/> Frete</span>
                 <span className="text-gray-800 font-bold">
                    {shippingInfo.price === 0 ? 'GRÁTIS' : `R$ ${shippingInfo.price.toFixed(2).replace('.', ',')}`}
                 </span>
            </div>
            <div className="border-t border-gray-100 pt-3 mt-2 flex justify-between items-center">
                <span className="font-bold text-lg text-blue-900">Total Final</span>
                <span className="font-bold text-xl text-blue-900">R$ {finalTotal.toFixed(2).replace('.', ',')}</span>
            </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-white p-4 border-t shadow-[0_-5px_20px_rgba(0,0,0,0.05)] z-50">
        <button 
            onClick={handleFinalize}
            disabled={!selectedAddress || !isDeliveryOpen || !isMinimumMet || isSending} 
            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition active:scale-[0.98] ${
                (!selectedAddress || !isDeliveryOpen || !isMinimumMet || isSending)
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-green-600 text-white hover:bg-green-700 shadow-green-200'
            }`}
        >
            {isSending ? (
                "Processando..."
            ) : (
                <>
                    {isDeliveryOpen ? <Send className="w-5 h-5"/> : <Clock className="w-5 h-5"/>}
                    {!isDeliveryOpen ? "Loja Fechada" : "Finalizar Pedido"}
                </>
            )}
        </button>
      </div>
    </div>
  );
}