'use client';

import { useState } from 'react';
import Header from './Header';
import BottomNav from './BottomNav';
import CartDrawer from './CartDrawer';

export default function AppLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800 font-sans pb-20 relative">
      
      {/* Header abre o carrinho */}
      <Header onOpenCart={() => setIsCartOpen(true)} />
      
      {/* Carrinho flutuante */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Conteúdo da página */}
      <main className="flex-1 w-full">
        {children}
      </main>

      {/* Menu do rodapé */}
      <BottomNav />
    </div>
  );
}