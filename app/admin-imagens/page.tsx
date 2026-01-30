'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { Search, Save, Link as LinkIcon, AlertCircle, Lock, LogOut } from 'lucide-react';
import Image from 'next/image';

// ⚠️ IMPORTANTE: Mantenha seu e-mail correto aqui
const ADMIN_EMAILS = ['seuemail@gmail.com']; 

export default function ImageManager() {
  const { user, loading: authLoading, signOut } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // --- FUNÇÕES (Hooks sempre no topo) ---

  async function fetchProducts() {
    setLoading(true);
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('name');
    if (data) setProducts(data);
    setLoading(false);
  }

  async function updateImage(id: number, url: string) {
    if (!url) return;
    const { error } = await supabase
      .from('products')
      .update({ image_url: url })
      .eq('id', id);

    if (!error) {
      // Feedback visual simples
      const btn = document.getElementById(`btn-${id}`);
      if(btn) {
         btn.innerText = "Salvo!";
         btn.classList.add("bg-green-800");
         setTimeout(() => {
            btn.innerText = "";
            btn.classList.remove("bg-green-800");
            // Adiciona ícone de volta se necessário, ou apenas reseta
            fetchProducts(); 
         }, 1000);
      } else {
        fetchProducts();
      }
    } else {
      alert("Erro ao salvar.");
    }
  }

  useEffect(() => {
    // Busca automática se estiver logado e autorizado
    if (!authLoading && user && user.email && ADMIN_EMAILS.includes(user.email)) {
        fetchProducts();
    }
  }, [authLoading, user]);

  // --- RENDERIZAÇÃO CONDICIONAL (Agora pode usar return) ---

  if (authLoading) {
    return <div className="flex h-screen items-center justify-center text-gray-500">Carregando acesso...</div>;
  }
  
  // Bloqueio de Segurança (Tela Limpa)
  if (!user || !user.email || !ADMIN_EMAILS.includes(user.email)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-6 bg-gray-50">
        <div className="bg-red-100 p-4 rounded-full mb-4 shadow-sm">
            <Lock className="w-8 h-8 text-red-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Área Restrita</h1>
        <p className="text-gray-500 mt-2 max-w-md">
            Você precisa estar logado com uma conta de administrador para acessar esta página.
        </p>
        <button 
            onClick={signOut}
            className="mt-6 text-sm text-red-600 underline hover:text-red-800"
        >
            Sair e tentar outra conta
        </button>
      </div>
    );
  }

  // --- ÁREA DO ADMIN ---
  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-20">
          <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
                <h1 className="text-2xl font-bold text-blue-900 flex items-center gap-2">
                    Gerenciador de Imagens
                    <span className="text-xs font-normal bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Admin</span>
                </h1>
                <p className="text-xs text-gray-400 mt-0.5">Logado como {user.email}</p>
            </div>

            <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input 
                    type="text" 
                    placeholder="Buscar produto..." 
                    className="w-full pl-9 p-2.5 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none transition"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>
          </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 pb-24">
        {loading ? (
            <div className="text-center py-20 text-gray-400 flex flex-col items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                Carregando catálogo...
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.slice(0, 50).map(product => (
                <div key={product.id} className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex gap-3 group hover:border-blue-200 transition">
                    {/* Preview da Imagem */}
                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden border border-gray-200 relative">
                        {product.image_url ? (
                            <img src={product.image_url} className="w-full h-full object-cover" alt="" />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 text-[10px] text-center p-1">
                                <AlertCircle className="w-5 h-5 mb-1 opacity-50"/> Sem Foto
                            </div>
                        )}
                    </div>
                    
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                        <div>
                            <h3 className="font-bold text-gray-800 text-sm leading-tight line-clamp-2" title={product.name}>
                                {product.name}
                            </h3>
                            <p className="text-[10px] text-gray-400 mt-1 font-mono">
                                {product.barcode || 'Sem EAN'}
                            </p>
                        </div>

                        <div className="flex gap-2 mt-2">
                            <div className="relative flex-1">
                                <LinkIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                                <input 
                                    type="text" 
                                    placeholder="URL da imagem..."
                                    defaultValue={product.image_url || ''}
                                    id={`input-${product.id}`}
                                    className="w-full pl-8 pr-2 py-1.5 text-xs bg-gray-50 rounded border border-gray-200 focus:border-blue-500 focus:bg-white outline-none transition"
                                />
                            </div>
                            <button 
                                id={`btn-${product.id}`}
                                onClick={() => {
                                    const input = document.getElementById(`input-${product.id}`) as HTMLInputElement;
                                    updateImage(product.id, input.value);
                                }}
                                className="bg-blue-600 text-white px-3 py-1.5 rounded text-xs font-bold hover:bg-blue-700 shadow-sm active:scale-95 transition flex items-center justify-center min-w-[3rem]"
                            >
                                <Save className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
}