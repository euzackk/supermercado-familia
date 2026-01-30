'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { Search, Save, Link as LinkIcon, AlertCircle, Lock, Bug } from 'lucide-react';

// --- CONFIGURAÇÃO ---
// ⚠️ IMPORTANTE: Certifique-se de que seu e-mail está exatamente igual aqui
const ADMIN_EMAILS = ['isaacmelo592@gmail.com']; 

export default function ImageManager() {
  const { user, loading: authLoading } = useAuth(); // Pegando loading do Auth também
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Se o Auth ainda estiver carregando, mostra um "Aguarde..."
  if (authLoading) {
    return <div className="flex h-screen items-center justify-center">Verificando usuário...</div>;
  }
  
  // 🔒 BLOQUEIO DE SEGURANÇA (COM DIAGNÓSTICO)
  // Verificamos se o usuário existe E se o email está na lista
  if (!user || !user.email || !ADMIN_EMAILS.includes(user.email)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-6 bg-gray-50">
        <div className="bg-red-100 p-4 rounded-full mb-4">
            <Lock className="w-8 h-8 text-red-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Acesso Negado</h1>
        
        {/* --- ÁREA DE DIAGNÓSTICO --- */}
        <div className="mt-6 bg-white p-6 rounded-xl border border-gray-200 shadow-sm max-w-md w-full text-left">
            <h3 className="flex items-center gap-2 font-bold text-gray-800 mb-4 border-b pb-2">
                <Bug className="w-4 h-4 text-orange-500"/> Diagnóstico de Erro
            </h3>
            
            <div className="space-y-3 text-sm">
                <div>
                    <p className="text-gray-500 text-xs uppercase font-bold">Status do Login:</p>
                    <p className={user ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                        {user ? "Usuário Logado" : "Nenhum usuário detectado"}
                    </p>
                </div>

                <div>
                    <p className="text-gray-500 text-xs uppercase font-bold">O Sistema leu seu e-mail como:</p>
                    <div className="bg-gray-100 p-2 rounded border font-mono text-gray-700 break-all">
                        {user?.email || "(Vazio / Não encontrado)"}
                    </div>
                </div>

                <div>
                    <p className="text-gray-500 text-xs uppercase font-bold">E-mail esperado na lista:</p>
                    <div className="bg-blue-50 p-2 rounded border border-blue-100 font-mono text-blue-700 break-all">
                        {ADMIN_EMAILS.join(', ')}
                    </div>
                </div>

                <div className="bg-orange-50 p-3 rounded text-orange-800 text-xs mt-4">
                    <strong>Dica:</strong> Verifique se há letras maiúsculas/minúsculas diferentes ou espaços em branco no final.
                </div>
            </div>
        </div>
      </div>
    );
  }

  // --- CÓDIGO NORMAL DA PÁGINA (SÓ EXECUTA SE PASSAR DO BLOQUEIO) ---

  useEffect(() => {
    fetchProducts();
  }, []);

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
      alert("Imagem Salva com Sucesso!");
      fetchProducts(); 
    } else {
      alert("Erro ao salvar a imagem.");
    }
  }

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 pb-24 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-900">Gerenciador de Imagens</h1>
        <div className="flex flex-col items-end">
             <span className="text-xs text-gray-500">Logado como:</span>
             <span className="text-sm font-bold text-blue-800">{user.email}</span>
        </div>
      </div>
      
      <div className="bg-blue-50 p-6 rounded-xl mb-8 border border-blue-100">
        <h3 className="font-bold text-blue-800 flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5"/> Instruções
        </h3>
        <p className="text-sm text-blue-700">
            Vá no <strong>Google Imagens</strong>, pesquise o produto, clique com o botão direito na foto e escolha <strong>"Copiar Endereço da Imagem"</strong>. Cole no campo abaixo e clique no botão verde.
        </p>
      </div>

      <div className="sticky top-0 bg-white pt-4 pb-4 z-10 shadow-sm mb-4 -mx-6 px-6">
        <div className="relative w-full">
            <Search className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
            <input 
            type="text" 
            placeholder="Buscar produto por nome..." 
            className="w-full pl-10 p-3 rounded-lg border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-200 outline-none"
            value={search}
            onChange={e => setSearch(e.target.value)}
            />
        </div>
      </div>

      {loading ? (
          <div className="text-center py-10 text-gray-500">Carregando produtos...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.slice(0, 50).map(product => (
            <div key={product.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-3">
                <div className="flex gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden border border-gray-200 relative">
                        {product.image_url ? (
                            <img src={product.image_url} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs text-center p-1">Sem Foto</div>
                        )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-800 text-sm truncate">{product.name}</h3>
                        <p className="text-xs text-gray-500 mt-1">{product.barcode || 'Sem código'}</p>
                        <span className="inline-block bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded mt-1">
                            {product.department}
                        </span>
                    </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-gray-50">
                <div className="relative flex-1">
                    <LinkIcon className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <input 
                    type="text" 
                    placeholder="Cole o link da imagem aqui..."
                    defaultValue={product.image_url || ''}
                    id={`input-${product.id}`}
                    className="w-full pl-9 p-2 text-sm bg-gray-50 rounded border border-gray-200 focus:border-blue-500 outline-none transition"
                    />
                </div>
                <button 
                    onClick={() => {
                        const input = document.getElementById(`input-${product.id}`) as HTMLInputElement;
                        updateImage(product.id, input.value);
                    }}
                    className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 shadow-sm active:scale-95 transition"
                >
                    <Save className="w-5 h-5" />
                </button>
                </div>
            </div>
            ))}
        </div>
      )}
    </div>
  );
}