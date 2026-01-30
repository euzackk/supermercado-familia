'use client';

import { useAuth } from '@/context/AuthContext';
// 1. AQUI É FEITA A IMPORTAÇÃO DOS ÍCONES
import { 
  User, 
  LogOut, 
  MapPin, 
  Phone, 
  Heart, 
  FileText, 
  HelpCircle, 
  ChevronRight, 
  Package // <--- Adicionamos o ícone de pacote aqui
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
            <User className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-500 mb-6 text-center">Você não está logado.</p>
        <Link href="/login" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition w-full max-w-xs text-center">
          Entrar na minha conta
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Cabeçalho do Perfil */}
      <div className="bg-blue-900 text-white p-6 pt-12 pb-16 rounded-b-[2.5rem] shadow-lg">
        <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold border-2 border-white/30">
                {user.user_metadata?.full_name?.charAt(0).toUpperCase() || 'C'}
            </div>
            <div>
                <h1 className="text-xl font-bold">Olá, {user.user_metadata?.full_name?.split(' ')[0] || 'Cliente'}!</h1>
                <p className="text-blue-200 text-sm">{user.email}</p>
            </div>
        </div>
      </div>

      <div className="px-4 -mt-8 space-y-3 relative z-10">
        
        {/* --- NOVO BOTÃO: MEUS PEDIDOS --- */}
        <Link href="/meus-pedidos" className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:border-blue-200 transition">
            <div className="bg-blue-100 p-2.5 rounded-lg text-blue-600">
                <Package className="w-5 h-5" />
            </div>
            <div className="flex-1">
                <h3 className="font-bold text-gray-800">Meus Pedidos</h3>
                <p className="text-xs text-gray-500">Acompanhe seu histórico</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
        </Link>
        {/* -------------------------------- */}

        <Link href="/enderecos" className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:border-blue-200 transition">
            <div className="bg-orange-100 p-2.5 rounded-lg text-orange-600">
                <MapPin className="w-5 h-5" />
            </div>
            <div className="flex-1">
                <h3 className="font-bold text-gray-800">Meus Endereços</h3>
                <p className="text-xs text-gray-500">Gerenciar locais de entrega</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
        </Link>

        <Link href="/favoritos" className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:border-blue-200 transition">
            <div className="bg-red-100 p-2.5 rounded-lg text-red-600">
                <Heart className="w-5 h-5" />
            </div>
            <div className="flex-1">
                <h3 className="font-bold text-gray-800">Meus Favoritos</h3>
                <p className="text-xs text-gray-500">Seus produtos queridinhos</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
        </Link>

        <div className="pt-4 pb-2">
            <h2 className="px-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Suporte & Info</h2>
        </div>

        <Link href="https://wa.me/5569992557719" target="_blank" className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:border-blue-200 transition">
            <div className="bg-green-100 p-2.5 rounded-lg text-green-600">
                <Phone className="w-5 h-5" />
            </div>
            <div className="flex-1">
                <h3 className="font-bold text-gray-800">Fale Conosco</h3>
                <p className="text-xs text-gray-500">Atendimento via WhatsApp</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
        </Link>

        <Link href="/politicas" className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:border-blue-200 transition">
            <div className="bg-gray-100 p-2.5 rounded-lg text-gray-600">
                <FileText className="w-5 h-5" />
            </div>
            <div className="flex-1">
                <h3 className="font-bold text-gray-800">Políticas</h3>
                <p className="text-xs text-gray-500">Privacidade e Termos</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
        </Link>

        <Link href="/sugestoes" className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:border-blue-200 transition">
            <div className="bg-yellow-100 p-2.5 rounded-lg text-yellow-600">
                <HelpCircle className="w-5 h-5" />
            </div>
            <div className="flex-1">
                <h3 className="font-bold text-gray-800">Sugerir Produto</h3>
                <p className="text-xs text-gray-500">Não achou o que queria?</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
        </Link>

        <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 bg-red-50 p-4 rounded-xl border border-red-100 mt-6 text-red-600 hover:bg-red-100 transition"
        >
            <div className="bg-white p-2.5 rounded-lg border border-red-100">
                <LogOut className="w-5 h-5" />
            </div>
            <span className="font-bold">Sair da conta</span>
        </button>
        
        <div className="text-center pt-8 pb-4">
             <p className="text-xs text-gray-400">Versão 1.0.5</p>
             <p className="text-[10px] text-gray-300 mt-1">Feito com ❤️ por Supermercado Família</p>
        </div>
      </div>
    </div>
  );
}