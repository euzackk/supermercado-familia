'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft, Package, Calendar, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function MyOrdersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      if (!user) return;
      
      // Busca pedidos e seus itens
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (data) setOrders(data);
      setLoading(false);
    }

    fetchOrders();
  }, [user]);

  if (loading) return <div className="p-8 text-center text-gray-500">Carregando histórico...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white p-4 shadow-sm flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-800">Meus Pedidos</h1>
      </div>

      <div className="p-4 space-y-4">
        {orders.length === 0 ? (
          <div className="text-center py-10">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Você ainda não fez nenhum pedido.</p>
            <Link href="/" className="text-blue-600 font-bold mt-2 block hover:underline">
              Ir às compras
            </Link>
          </div>
        ) : (
          orders.map(order => (
            <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Cabeçalho do Pedido */}
              <div className="bg-gray-50 p-3 border-b border-gray-100 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="bg-blue-100 p-1.5 rounded-lg">
                        <Package className="w-4 h-4 text-blue-700" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-bold">Pedido #{order.id}</p>
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                            <Calendar className="w-3 h-3"/>
                            {new Date(order.created_at).toLocaleDateString('pt-BR')}
                        </p>
                    </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-bold capitalize
                    ${order.status === 'pendente' ? 'bg-yellow-100 text-yellow-700' : ''}
                    ${order.status === 'entregue' ? 'bg-green-100 text-green-700' : ''}
                    ${order.status === 'cancelado' ? 'bg-red-100 text-red-700' : ''}
                `}>
                    {order.status}
                </span>
              </div>

              {/* Itens */}
              <div className="p-3 space-y-2">
                {order.order_items.map((item: any) => (
                    <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-gray-700">
                            <span className="font-bold text-gray-900">{item.quantity}{item.unit === 'bulk' ? 'kg' : 'x'}</span> {item.name}
                        </span>
                        <span className="text-gray-500">
                            R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                        </span>
                    </div>
                ))}
              </div>

              {/* Rodapé com Total */}
              <div className="p-3 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center">
                 <div className="flex flex-col text-xs text-gray-500">
                    <span>Pagamento: {order.payment_method}</span>
                 </div>
                 <div className="text-right">
                    <span className="text-xs text-gray-500 block">Total</span>
                    <span className="text-lg font-bold text-blue-900">
                        R$ {order.total.toFixed(2).replace('.', ',')}
                    </span>
                 </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}