'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { CheckCircle, Truck, Clock, MapPin } from 'lucide-react';

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setLoading(true);
    const { data } = await supabase
      .from('orders')
      .select(`*, order_items (*)`)
      .order('created_at', { ascending: false });
    
    if (data) setOrders(data);
    setLoading(false);
  }

  async function updateStatus(id: number, status: string) {
    await supabase.from('orders').update({ status }).eq('id', id);
    setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
  }

  return (
    <div>
       <h1 className="text-2xl font-bold text-gray-800 mb-6">Pedidos Recentes</h1>
       
       {loading ? (
           <div className="text-center py-10 text-gray-500">Carregando pedidos...</div>
       ) : (
           <div className="space-y-4">
              {orders.map(order => (
                <div key={order.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    {/* Cabeçalho do Pedido */}
                    <div className="flex flex-col md:flex-row justify-between md:items-center border-b border-gray-100 pb-4 mb-4 gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <span className="font-bold text-lg text-gray-800">Pedido #{order.id}</span>
                                <span className={`text-xs px-2 py-1 rounded-full font-bold uppercase flex items-center gap-1 ${
                                    order.status === 'pendente' ? 'bg-yellow-100 text-yellow-700' :
                                    order.status === 'entregue' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                }`}>
                                    {order.status === 'pendente' && <Clock className="w-3 h-3"/>}
                                    {order.status}
                                </span>
                            </div>
                            <p className="text-sm text-gray-500">
                                {new Date(order.created_at).toLocaleString('pt-BR')} • Pagamento via {order.payment_method}
                            </p>
                        </div>

                        <div className="flex gap-2">
                             {order.status !== 'entregue' && (
                                 <button onClick={() => updateStatus(order.id, 'entregue')} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 flex items-center gap-2 transition shadow-sm">
                                    <CheckCircle className="w-4 h-4"/> Marcar Entregue
                                 </button>
                             )}
                        </div>
                    </div>

                    {/* Detalhes (Grid) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Lista de Itens */}
                        <div>
                            <h4 className="font-bold text-gray-700 mb-3 text-xs uppercase tracking-wider">Itens do Pedido</h4>
                            <ul className="space-y-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                {order.order_items.map((item: any) => (
                                    <li key={item.id} className="flex justify-between text-sm py-1 border-b border-gray-200 last:border-0">
                                        <span className="text-gray-700">
                                            <span className="font-bold mr-2">{item.quantity}x</span> 
                                            {item.name}
                                        </span>
                                        <span className="font-medium text-gray-900">R$ {(item.price * item.quantity).toFixed(2)}</span>
                                    </li>
                                ))}
                                <li className="flex justify-between text-base pt-2 font-bold text-blue-900 border-t border-gray-200 mt-2">
                                    <span>Total</span>
                                    <span>R$ {order.total.toFixed(2)}</span>
                                </li>
                            </ul>
                        </div>

                        {/* Endereço */}
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 h-fit">
                            <h4 className="font-bold text-blue-800 mb-2 text-xs uppercase flex items-center gap-2">
                                <MapPin className="w-4 h-4"/> Endereço de Entrega
                            </h4>
                            <div className="text-sm text-blue-900 leading-relaxed">
                                {order.address_snapshot ? (
                                    <>
                                        <p className="font-bold">{order.address_snapshot.street}, {order.address_snapshot.number}</p>
                                        <p>{order.address_snapshot.district}</p>
                                        <p>{order.address_snapshot.city} - {order.address_snapshot.state}</p>
                                        {order.address_snapshot.complement && (
                                            <p className="mt-2 text-xs bg-white/50 p-2 rounded border border-blue-100 italic">
                                                Obs: {order.address_snapshot.complement}
                                            </p>
                                        )}
                                    </>
                                ) : (
                                    <p className="text-red-500 italic">Endereço não registrado no banco.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
              ))}
           </div>
       )}
    </div>
  );
}