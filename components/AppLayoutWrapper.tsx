'use client';

import { useState } from 'react';
import Header from './Header';
import BottomNav from './BottomNav';
import CartDrawer from './CartDrawer';
import MenuDrawer from './MenuDrawer'; // Importe o novo componente

export default function AppLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Novo estado

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-gray-50 overflow-hidden relative">
      
      <div className="flex-none z-30 bg-white shadow-sm w-full">
        {/* Passamos as duas funções para o Header */}
        <Header 
          onOpenCart={() => setIsCartOpen(true)} 
          onOpenMenu={() => setIsMenuOpen(true)}
        />
      </div>
      
      {/* Carrinho */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* NOVO: Menu Lateral */}
      <MenuDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <main className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide w-full relative">
        <div className="pb-24 w-full"> 
          {children}
        </div>
      </main>

      <div className="flex-none z-30 bg-white border-t border-gray-100 pb-safe w-full"> 
        <BottomNav />
      </div>
    </div>
  );
}