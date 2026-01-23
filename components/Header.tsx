'use client';

import { Menu, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';

interface HeaderProps {
  onOpenCart: () => void;
}

// Removemos a propriedade 'onOpenMenu'
export default function Header({ onOpenCart }: HeaderProps) {
  const { cartCount } = useCart();

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white sticky top-0 z-30 shadow-sm border-b border-gray-100">
      {/* Botão de Menu apenas visual (sem onClick) */}
      <button className="p-1 text-gray-400 cursor-default">
        <Menu className="w-7 h-7" />
      </button>
      
      <div className="relative h-10 w-40"> 
         <Image 
           src="/logo.png" 
           alt="Supermercado Família" 
           fill 
           className="object-contain object-center" 
           priority 
         />
      </div>

      <button onClick={onOpenCart} className="p-1 relative hover:bg-gray-100 rounded-full transition">
        <ShoppingCart className="w-7 h-7 text-gray-800" />
        
        {cartCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white animate-pulse">
            {cartCount}
          </span>
        )}
      </button>
    </header>
  );
}