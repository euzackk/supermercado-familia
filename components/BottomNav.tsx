'use client';

import { Home, Search, ShoppingBag, User, Heart } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';

export default function BottomNav() {
  const pathname = usePathname();
  const { cartCount } = useCart();

  const isActive = (path: string) => pathname === path;

  return (
    // ADICIONADO: fixed bottom-0 left-0 w-full z-50
    <div className="fixed bottom-0 left-0 w-full z-50 bg-white border-t border-gray-100 flex justify-around items-center py-3 pb-safe md:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      
      <Link href="/" className={`flex flex-col items-center gap-1 ${isActive('/') ? 'text-blue-600' : 'text-gray-400'}`}>
        <Home className={`w-6 h-6 ${isActive('/') && 'fill-current'}`} />
        <span className="text-[10px] font-medium">Início</span>
      </Link>

      <Link href="/depts" className={`flex flex-col items-center gap-1 ${isActive('/depts') ? 'text-blue-600' : 'text-gray-400'}`}>
        <Search className="w-6 h-6" />
        <span className="text-[10px] font-medium">Buscar</span>
      </Link>

      {/* Botão Carrinho com Badge */}
      <div className="relative">
         {/* O carrinho geralmente abre um Drawer, mas se for link: */}
         {/* Se você usa o botão do header para abrir o carrinho, aqui pode ser um link para /carrinho ou abrir o Drawer também via Contexto */}
         <Link href="/checkout" className={`flex flex-col items-center gap-1 ${isActive('/checkout') ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className="relative">
                <ShoppingBag className={`w-6 h-6 ${isActive('/checkout') && 'fill-current'}`} />
                {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] font-bold h-4 w-4 flex items-center justify-center rounded-full border-2 border-white">
                        {cartCount}
                    </span>
                )}
            </div>
            <span className="text-[10px] font-medium">Cesta</span>
         </Link>
      </div>

      <Link href="/favoritos" className={`flex flex-col items-center gap-1 ${isActive('/favoritos') ? 'text-blue-600' : 'text-gray-400'}`}>
        <Heart className={`w-6 h-6 ${isActive('/favoritos') && 'fill-current'}`} />
        <span className="text-[10px] font-medium">Favoritos</span>
      </Link>

      <Link href="/perfil" className={`flex flex-col items-center gap-1 ${isActive('/perfil') ? 'text-blue-600' : 'text-gray-400'}`}>
        <User className={`w-6 h-6 ${isActive('/perfil') && 'fill-current'}`} />
        <span className="text-[10px] font-medium">Perfil</span>
      </Link>

    </div>
  );
}