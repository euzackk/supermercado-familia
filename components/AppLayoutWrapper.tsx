'use client';

import { useState } from 'react';
import Header from './Header';
import BottomNav from './BottomNav';
import CartDrawer from './CartDrawer';

export default function AppLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    // w-full garante largura total
    <div className="flex flex-col h-[100dvh] w-full bg-gray-50 overflow-hidden relative">
      
      {/* 1. Topo Fixo */}
      <div className="flex-none z-30 bg-white shadow-sm w-full">
        <Header onOpenCart={() => setIsCartOpen(true)} />
      </div>
      
      {/* Carrinho (Overlay) */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* 2. Miolo do Site */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide w-full relative">
        <div className="pb-24 w-full"> 
          {children}
        </div>
      </main>

      {/* 3. Rodapé Fixo */}
      <div className="flex-none z-30 bg-white border-t border-gray-100 pb-safe w-full"> 
        <BottomNav />
      </div>
    </div>
  );
}