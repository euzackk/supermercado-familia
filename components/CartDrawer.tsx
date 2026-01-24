'use client';

import { X, Trash2, ShoppingBag, ArrowRight, Plus, Minus } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeFromCart, updateQuantity, cartTotal } = useCart();
  const router = useRouter();

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const formatQty = (qty: number, typeSale?: string) => {
    // Se o banco diz que é 'bulk', sempre mostra KG
    if (typeSale === 'bulk' || !Number.isInteger(qty)) {
        return `${qty.toFixed(3).replace('.', ',')} kg`;
    }
    return `${qty} un`;
  };

  return (
    <div className={`fixed inset-0 z-50 flex justify-end ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      
      <div 
        className={`fixed inset-0 bg-black/60 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`} 
        onClick={onClose}
      />

      <div className={`relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col transition-transform duration-300 ease-out transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white z-10">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-orange-500" />
            <h2 className="text-lg font-bold text-gray-800">Seu Carrinho</h2>
            <span className="bg-orange-100 text-orange-600 text-xs font-bold px-2 py-0.5 rounded-full">
              {items.length} itens
            </span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-60">
                <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
                <p className="font-bold text-gray-400 text-lg">Seu carrinho está vazio</p>
                <button onClick={onClose} className="mt-6 text-orange-500 font-bold hover:underline">
                    Continuar comprando
                </button>
            </div>
          ) : (
            items.map((item) => {
              // Verifica pelo campo do banco ou se é decimal
              const isBulk = item.type_sale === 'bulk' || !Number.isInteger(item.quantity);

              return (
                <div key={item.id} className="flex gap-3 bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                  <div className="w-20 h-20 bg-gray-50 rounded-lg flex-shrink-0 relative overflow-hidden">
                      {item.image_url ? (
                          <img src={item.image_url} alt={item.name} className="w-full h-full object-contain mix-blend-multiply p-2" />
                      ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">Sem foto</div>
                      )}
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-gray-800 text-sm line-clamp-2 leading-tight">{item.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">
                          {formatQty(item.quantity, item.type_sale)} x R$ {item.price.toFixed(2).replace('.', ',')}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <p className="font-bold text-blue-900">
                          R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                      </p>
                      
                      {isBulk ? (
                        <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-xs text-red-400 hover:text-red-600 font-bold flex items-center gap-1 bg-red-50 px-2 py-1 rounded-lg"
                        >
                            <Trash2 className="w-3 h-3" /> Remover
                        </button>
                      ) : (
                        <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-1">
                             <button 
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-1 text-gray-500 hover:text-black"
                             >
                                <Minus className="w-4 h-4" />
                             </button>
                             <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                             <button 
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-1 text-gray-500 hover:text-black"
                             >
                                <Plus className="w-4 h-4" />
                             </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {items.length > 0 && (
          <div className="p-5 bg-white border-t border-gray-100 pb-safe">
            <div className="flex justify-between items-end mb-4">
                <span className="text-gray-500 text-sm">Total Estimado</span>
                <span className="text-2xl font-extrabold text-gray-900">
                    R$ {cartTotal.toFixed(2).replace('.', ',')}
                </span>
            </div>
            
            <button 
                onClick={() => { onClose(); router.push('/checkout'); }}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-200 transition active:scale-[0.98] flex items-center justify-center gap-2"
            >
                Fechar Pedido <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}