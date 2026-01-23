'use client';

import { useState } from 'react';
import Header from './Header';
import BottomNav from './BottomNav';
import CartDrawer from './CartDrawer';
import MenuDrawer from './MenuDrawer';

export default function AppLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-gray-50 overflow-hidden relative">
      
      {/* --- FAIXA DE AVISO DE COMPRA MÍNIMA --- */}
      <div className="bg-red-600 text-white text-[11px] font-bold text-center py-1.5 px-4 z-40 shadow-sm">
         ⚠️ Pedido mínimo para entrega: R$ 30,00
      </div>

      <div className="flex-none z-30 bg-white shadow-sm w-full">
        <Header 
          onOpenCart={() => setIsCartOpen(true)} 
          onOpenMenu={() => setIsMenuOpen(true)}
        />
      </div>
      
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

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