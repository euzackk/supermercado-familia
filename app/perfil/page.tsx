'use client';

import { useAuth } from '@/context/AuthContext';
import { MapPin, LogOut, LogIn } from "lucide-react";
import { useRouter } from 'next/navigation';

export default function PerfilPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  // Se NÃO estiver logado
  if (!user) {
    return (
      <div className="p-8 bg-gray-50 min-h-[80vh] flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 mb-6">
           <LogIn className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-bold text-blue-900 mb-2">Você não está logado</h1>
        <p className="text-gray-500 mb-8 max-w-xs">Entre na sua conta para ver seus pedidos e endereços.</p>
        
        <button 
          onClick={() => router.push('/login')}
          className="bg-orange-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-orange-200 active:scale-95 transition flex items-center gap-2"
        >
           <LogIn className="w-5 h-5" /> Fazer Login
        </button>
      </div>
    );
  }

  // Se ESTIVER logado
  return (
    <div className="p-4 bg-gray-50 min-h-full pb-24">
      {/* Container Centralizado para Tablets/Desktop */}
      <div className="w-full max-w-lg mx-auto">
        
        <h1 className="text-2xl font-bold text-blue-900 mb-6 flex items-center gap-2">
          Meu Perfil
        </h1>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm mb-6 flex items-center gap-4 border border-gray-100">
          {user.user_metadata.avatar_url ? (
              <img 
                src={user.user_metadata.avatar_url} 
                referrerPolicy="no-referrer" 
                className="w-16 h-16 rounded-full border-2 border-white shadow-sm" 
                alt="Avatar" 
              />
          ) : (
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-2xl">
                  {user.email?.charAt(0).toUpperCase()}
              </div>
          )}
          
          <div className="overflow-hidden">
              <h2 className="font-bold text-lg truncate text-gray-800">{user.user_metadata.full_name || 'Cliente'}</h2>
              <p className="text-gray-500 text-sm truncate">{user.email}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          
          {/* Apenas Meus Endereços */}
          <div onClick={() => router.push('/enderecos')} className="p-4 border-b border-gray-100 flex items-center gap-3 hover:bg-gray-50 cursor-pointer transition">
              <MapPin className="text-orange-500 w-5 h-5" />
              <span className="text-gray-700 font-medium">Meus Endereços</span>
          </div>

          {/* Opções Removidas: Pagamento e Configurações */}
          
          <button 
            onClick={signOut} 
            className="w-full text-left p-4 flex items-center gap-3 hover:bg-red-50 cursor-pointer text-red-500 transition"
          >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sair da Conta</span>
          </button>
        </div>

      </div>
    </div>
  );
}