'use client';

import { Menu, ShoppingCart, RotateCw } from 'lucide-react'; // Adicionei RotateCw
import Image from 'next/image';
import Link from 'next/link'; // Importar Link
import { useCart } from '@/context/CartContext';

interface HeaderProps {
  onOpenCart: () => void;
  onOpenMenu: () => void;
}

export default function Header({ onOpenCart, onOpenMenu }: HeaderProps) {
  const { cartCount } = useCart();

  // Função para recarregar a página forçadamente
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white sticky top-0 z-30 shadow-sm border-b border-gray-100">
      
      <div className="flex items-center gap-2">
        {/* Botão de Menu */}
        <button 
          onClick={onOpenMenu}
          className="p-1 text-gray-600 hover:bg-gray-100 rounded-full transition active:scale-90"
        >
          <Menu className="w-7 h-7" />
        </button>

        {/* Botão de Recarregar (Refresh) */}
        <button 
          onClick={handleReload}
          className="p-1 text-blue-600 hover:bg-blue-50 rounded-full transition active:scale-90"
          title="Atualizar App"
        >
          <RotateCw className="w-6 h-6" />
        </button>
      </div>
      
      {/* Logo com Link para Home */}
      <Link href="/" className="relative h-10 w-32 cursor-pointer active:opacity-80 transition"> 
         <Image 
           src="/logo.png" 
           alt="Supermercado Família" 
           fill 
           className="object-contain object-center" 
           priority 
         />
      </Link>

      <button onClick={onOpenCart} className="p-1 relative hover:bg-gray-100 rounded-full transition active:scale-90">
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