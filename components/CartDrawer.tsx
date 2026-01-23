'use client';

import { X, ShoppingBag } from 'lucide-react';
import { useEffect } from 'react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  // Fecha o carrinho se apertar ESC
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className={`fixed inset-0 z-50 flex justify-end ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      
      {/* Overlay escuro (fundo) */}
      <div 
        className={`fixed inset-0 bg-black/50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`} 
        onClick={onClose}
      />

      {/* O Carrinho deslizante */}
      <div className={`relative w-full max-w-md bg-white h-full shadow-xl flex flex-col transition-transform duration-300 ease-in-out transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Cabeçalho do Carrinho */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-orange-500" />
            Seu Carrinho
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-800">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Conteúdo do Carrinho (Vazio por enquanto) */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center justify-center text-gray-500">
          <ShoppingBag className="w-16 h-16 text-gray-200 mb-4" />
          <p>Seu carrinho está vazio.</p>
        </div>

        {/* Rodapé do Carrinho (Botão de fechar pedido) */}
        <div className="p-4 border-t bg-gray-50 safe-area-bottom">
          <button className="w-full bg-orange-500 text-white font-bold py-3 rounded-lg hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed">
            Fechar Pedido
          </button>
        </div>
      </div>
    </div>
  );
}