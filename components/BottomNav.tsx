'use client';

import { Home, LayoutGrid, User, Heart } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 bg-white border-t border-gray-100 flex justify-around items-center py-3 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      
      {/* 1. INÍCIO */}
      <Link href="/" className={`flex flex-col items-center gap-1 ${isActive('/') ? 'text-blue-600' : 'text-gray-400'}`}>
        <Home className={`w-6 h-6 ${isActive('/') && 'fill-current'}`} />
        <span className="text-[10px] font-medium">Início</span>
      </Link>

      {/* 2. DEPARTAMENTOS (Antigo Buscar) */}
      <Link href="/depts" className={`flex flex-col items-center gap-1 ${isActive('/depts') ? 'text-blue-600' : 'text-gray-400'}`}>
        {/* Troquei o ícone Search pelo LayoutGrid (quadradinhos) que combina mais com categorias */}
        <LayoutGrid className={`w-6 h-6 ${isActive('/depts') && 'fill-current'}`} />
        <span className="text-[10px] font-medium">Departamentos</span>
      </Link>

      {/* (A Cesta foi removida daqui) */}

      {/* 3. FAVORITOS */}
      <Link href="/favoritos" className={`flex flex-col items-center gap-1 ${isActive('/favoritos') ? 'text-blue-600' : 'text-gray-400'}`}>
        <Heart className={`w-6 h-6 ${isActive('/favoritos') && 'fill-current'}`} />
        <span className="text-[10px] font-medium">Favoritos</span>
      </Link>

      {/* 4. PERFIL */}
      <Link href="/perfil" className={`flex flex-col items-center gap-1 ${isActive('/perfil') ? 'text-blue-600' : 'text-gray-400'}`}>
        <User className={`w-6 h-6 ${isActive('/perfil') && 'fill-current'}`} />
        <span className="text-[10px] font-medium">Perfil</span>
      </Link>

    </div>
  );
}