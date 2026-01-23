'use client'; // Necessário para saber em qual rota estamos

import { Home, Heart, List, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx'; // Ajuda a combinar classes CSS condicionalmente

export default function BottomNav() {
  const pathname = usePathname();

  // Função auxiliar para verificar se o link está ativo
  const isActive = (path: string) => pathname === path;

  // Classe base para os itens do menu
  const linkBaseClass = "flex flex-col items-center gap-1 transition";

  return (
    <nav className="fixed bottom-0 w-full bg-white border-t border-gray-100 py-2 px-6 flex justify-between items-end z-40 pb-4 safe-area-bottom shadow-[0_-1px_3px_rgba(0,0,0,0.05)]">
      
      {/* Item: Início */}
      <Link href="/" className={clsx(linkBaseClass, isActive('/') ? "text-orange-500" : "text-gray-400 hover:text-gray-600")}>
        {/* Usamos fill-current apenas se estiver ativo para dar o efeito de preenchido */}
        <Home className={clsx("w-6 h-6", isActive('/') && "fill-current")} /> 
        <span className="text-[10px] font-medium">Início</span>
      </Link>

      {/* Item: Favoritos */}
      <Link href="/favoritos" className={clsx(linkBaseClass, isActive('/favoritos') ? "text-orange-500" : "text-gray-400 hover:text-gray-600")}>
        <Heart className={clsx("w-6 h-6", isActive('/favoritos') && "fill-current")} />
        <span className="text-[10px] font-medium">Favoritos</span>
      </Link>

      {/* Item: Depts */}
      <Link href="/depts" className={clsx(linkBaseClass, isActive('/depts') ? "text-orange-500" : "text-gray-400 hover:text-gray-600")}>
        <List className="w-6 h-6" />
        <span className="text-[10px] font-medium">Depts</span>
      </Link>

      {/* Item: Perfil */}
      <Link href="/perfil" className={clsx(linkBaseClass, isActive('/perfil') ? "text-orange-500" : "text-gray-400 hover:text-gray-600")}>
        <User className={clsx("w-6 h-6", isActive('/perfil') && "fill-current")} />
        <span className="text-[10px] font-medium">Perfil</span>
      </Link>

    </nav>
  );
}