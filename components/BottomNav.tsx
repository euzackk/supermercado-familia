'use client';

import { Home, Search, Heart, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Início', icon: Home, path: '/' },
    { name: 'Buscar', icon: Search, path: '/depts' }, // Ajustei para depts ou busca
    { name: 'Favoritos', icon: Heart, path: '/favoritos' },
    { name: 'Perfil', icon: User, path: '/perfil' },
  ];

  return (
    <nav className="w-full bg-white flex justify-around items-center py-3">
      {navItems.map((item) => {
        const isActive = pathname === item.path;
        return (
          <Link 
            key={item.name} 
            href={item.path}
            className={`flex flex-col items-center gap-1 transition-all duration-300 ${
              isActive ? 'text-orange-500 scale-105' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <item.icon className={`w-6 h-6 ${isActive ? 'fill-current' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[10px] font-medium">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}