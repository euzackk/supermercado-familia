'use client';

import { useAuth } from '@/context/AuthContext';
import { LayoutDashboard, Package, ShoppingBag, LogOut, Lock } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

// ⚠️ IMPORTANTE: COLOQUE SEU E-MAIL AQUI
const ADMIN_EMAILS = ['seuemail@gmail.com'];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  if (loading) return <div className="h-screen flex items-center justify-center">Carregando painel...</div>;

  // Proteção de Rota
  if (!user || !user.email || !ADMIN_EMAILS.includes(user.email)) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50 text-center p-4">
        <div className="bg-red-100 p-4 rounded-full mb-4">
            <Lock className="w-10 h-10 text-red-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Acesso Restrito</h1>
        <p className="text-gray-500 mt-2 mb-6 max-w-md">
            Esta área é exclusiva para administradores do Supermercado Família.
        </p>
        <div className="flex gap-4">
            <button onClick={() => router.push('/')} className="text-blue-600 hover:underline">
                Voltar para Loja
            </button>
            <button onClick={() => router.push('/login')} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Fazer Login
            </button>
        </div>
      </div>
    );
  }

  const menuItems = [
    { name: 'Visão Geral', icon: LayoutDashboard, path: '/admin' },
    { name: 'Produtos', icon: Package, path: '/admin/produtos' },
    { name: 'Pedidos', icon: ShoppingBag, path: '/admin/pedidos' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* SIDEBAR */}
      <aside className="w-full md:w-64 bg-blue-900 text-white md:min-h-screen flex-shrink-0">
        <div className="p-6 border-b border-blue-800 flex justify-between items-center md:block">
          <div>
            <h1 className="text-xl font-bold">Painel Família</h1>
            <p className="text-xs text-blue-300">Administração</p>
          </div>
          {/* Botão Sair Mobile */}
          <button onClick={signOut} className="md:hidden text-red-300">
            <LogOut className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="p-4 space-y-2 flex overflow-x-auto md:block md:overflow-visible">
          {menuItems.map(item => {
            const isActive = pathname === item.path;
            return (
              <Link key={item.path} href={item.path} 
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all whitespace-nowrap ${isActive ? 'bg-blue-700 text-white shadow-lg' : 'text-blue-200 hover:bg-blue-800'}`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-blue-800 hidden md:block mt-auto">
            <button onClick={signOut} className="flex items-center gap-2 text-red-300 hover:text-red-100 transition w-full px-4 py-2 rounded-lg hover:bg-blue-800">
                <LogOut className="w-5 h-5" /> Sair
            </button>
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
            {children}
        </div>
      </main>
    </div>
  );
}