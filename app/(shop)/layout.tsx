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
  
  const hideNav = pathname === "/login" || pathname === "/checkout";

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      
      {/* --- ÁREA FIXA NO TOPO (Aviso + Header) --- */}
      {!hideNav && (
        <div className="fixed top-0 left-0 w-full z-40 bg-white shadow-sm">
            {/* Aviso de Compra Mínima */}
            <div className="bg-red-600 text-white text-[11px] font-bold text-center py-2 px-4">
                ⚠️ Pedido mínimo para entrega: R$ 30,00
            </div>

            {/* O Header entra aqui dentro do fixo */}
            <Header 
                onOpenCart={() => setIsCartOpen(true)} 
                onOpenMenu={() => setIsMenuOpen(true)} 
            />
        </div>
      )}
      
      {/* --- CONTEÚDO PRINCIPAL --- */}
      {/* Adicionamos padding-top (pt) para o conteúdo não ficar atrás do header fixo */}
      {/* pb-20 garante espaço para o menu inferior no mobile */}
      <main className={`flex-1 w-full relative pb-20 ${!hideNav ? 'pt-[104px]' : ''}`}>
        {children}
      </main>

      {/* --- MENU INFERIOR FIXO --- */}
      {!hideNav && <BottomNav />}

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <MenuDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </div>
  );
}