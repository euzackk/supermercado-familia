'use client';

import { X, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';
import { useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image'; // Importar Image do Next

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeFromCart, addToCart, decreaseQuantity, cartTotal } = useCart();
  const router = useRouter();

  // Fecha com ESC
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleCheckout = () => {
    onClose();
    router.push('/checkout');
  };

  // Formata dinheiro
  const formatMoney = (value: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  return (
    <div className={`fixed inset-0 z-50 flex justify-end ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      
      {/* Fundo escuro */}
      <div 
        className={`fixed inset-0 bg-black/60 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`} 
        onClick={onClose}
      />

      {/* Painel Lateral */}
      <div className={`relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col transition-transform duration-300 ease-out transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Topo */}
        <div className="flex items-center justify-between p-4 border-b bg-white">
          <h2 className="text-lg font-bold flex items-center gap-2 text-gray-800">
            <ShoppingBag className="w-5 h-5 text-orange-500" />
            Carrinho ({items.length})
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-full transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Lista de Produtos */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <ShoppingBag className="w-16 h-16 mb-4 opacity-20" />
              <p>Seu carrinho está vazio.</p>
              <button onClick={onClose} className="mt-4 text-orange-500 font-medium hover:underline">
                Começar a comprar
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex gap-3 animate-in fade-in slide-in-from-right-4">
                {/* Imagem Pequena */}
                <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-contain" />
                  ) : (
                    <ShoppingBag className="w-6 h-6 text-gray-300" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-800 line-clamp-1">{item.name}</h3>
                    <p className="text-xs text-gray-500">{item.department}</p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-bold text-blue-900 text-sm">
                      {formatMoney(item.price * item.quantity)}
                    </span>
                    
                    {/* Controles (+ / -) */}
                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                      <button 
                        onClick={() => decreaseQuantity(item.id)}
                        className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:text-red-500 active:scale-90 transition"
                      >
                        {item.quantity === 1 ? <Trash2 className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                      </button>
                      <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => addToCart(item)}
                        className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-green-600 hover:bg-green-50 active:scale-90 transition"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Rodapé (Total e Botão) */}
        {items.length > 0 && (
          <div className="p-4 border-t bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-500">Total</span>
              <span className="text-2xl font-bold text-gray-900">{formatMoney(cartTotal)}</span>
            </div>
            <button 
              onClick={handleCheckout}
              className="w-full bg-orange-500 text-white font-bold py-3.5 rounded-xl hover:bg-orange-600 active:scale-[0.98] transition shadow-lg shadow-orange-200"
            >
              Fechar Pedido
            </button>
          </div>
        )}
      </div>
    </div>
  );
}