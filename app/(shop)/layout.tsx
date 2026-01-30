'use client';

import { useState } from 'react';
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import CartDrawer from "@/components/CartDrawer";
import MenuDrawer from "@/components/MenuDrawer";
import { usePathname } from "next/navigation";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Páginas que não devem ter navegação
  const hideNav = pathname === "/login" || pathname === "/checkout";

  return (
    <div className="flex flex-col min-h-screen pb-16 md:pb-0 bg-gray-50">
      {/* Aviso de Compra Mínima */}
      <div className="bg-red-600 text-white text-[11px] font-bold text-center py-1.5 px-4 z-40 shadow-sm sticky top-0">
         ⚠️ Pedido mínimo para entrega: R$ 30,00
      </div>

      {!hideNav && (
        <Header 
          onOpenCart={() => setIsCartOpen(true)} 
          onOpenMenu={() => setIsMenuOpen(true)} 
        />
      )}
      
      <main className="flex-1 w-full relative">
        {children}
      </main>

      {!hideNav && <BottomNav />}

      {/* Drawers (Carrinho e Menu Lateral) */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <MenuDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </div>
  );
}