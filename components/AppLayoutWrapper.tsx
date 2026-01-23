'use client';

import { useState } from 'react';
import Header from './Header';
import BottomNav from './BottomNav';
import CartDrawer from './CartDrawer';

export default function AppLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    // Estrutura de App: Altura travada na tela (100dvh) e sem rolagem no container pai
    <div className="flex flex-col h-[100dvh] w-full bg-gray-50 overflow-hidden relative">
      
      {/* 1. Topo Fixo (Não rola) */}
      <div className="flex-none z-30 bg-white shadow-sm">
        <Header onOpenCart={() => setIsCartOpen(true)} />
      </div>
      
      {/* Carrinho (Overlay) */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* 2. Miolo do Site (SÓ ISSO ROLA) */}
      {/* scrollbar-hide: esconde a barra lateral feia, mas mantém a rolagem */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide w-full relative">
        <div className="pb-24"> {/* Espaço extra no final para não cortar conteúdo atrás do menu */}
          {children}
        </div>
      </main>

      {/* 3. Rodapé Fixo na parte inferior da estrutura Flex */}
      <div className="flex-none z-30 bg-white border-t border-gray-100 pb-safe"> 
        {/* pb-safe ajuda em iPhones com a barrinha preta em baixo */}
        <BottomNav />
      </div>
    </div>
  );
}