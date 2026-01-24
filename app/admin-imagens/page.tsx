'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Upload, 
  Search, 
  Image as ImageIcon, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Filter
} from 'lucide-react';

export default function AdminImagensPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterMissing, setFilterMissing] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('name', { ascending: true });
    
    if (data) setProducts(data);
    setLoading(false);
  }

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterMissing ? !p.image_url : true;
    return matchesSearch && matchesFilter;
  });

  // Função para fazer o upload e atualizar o banco automaticamente
  async function handleUpload(file: File, productId: number) {
    try {
      setUploading(String(productId));
      
      // 1. Upload para o Storage do Supabase (Bucket 'products')
      const fileExt = file.name.split('.').pop();
      const fileName = `${productId}-${Math.random()}.${fileExt}`;
      const filePath = `product-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Pegar a URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);

      // 3. Atualizar o produto no banco
      const { error: updateError } = await supabase
        .from('products')
        .update({ image_url: publicUrl })
        .eq('id', productId);

      if (updateError) throw updateError;

      // Atualiza o estado local para sumir da lista de pendentes
      setProducts(prev => prev.map(p => 
        p.id === productId ? { ...p, image_url: publicUrl } : p
      ));

    } catch (error) {
      console.error('Erro no upload:', error);
      alert('Erro ao enviar imagem');
    } finally {
      setUploading(null);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Inteligente */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-black text-blue-900 flex items-center gap-2">
              <ImageIcon className="w-8 h-8 text-orange-500" />
              Gestor de Imagens
            </h1>
            <p className="text-gray-500 text-sm">Vincule fotos aos seus produtos rapidamente</p>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setFilterMissing(!filterMissing)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition ${
                filterMissing ? 'bg-orange-500 text-white shadow-lg shadow-orange-200' : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              <Filter className="w-4 h-4" />
              {filterMissing ? 'Mostrando Sem Foto' : 'Mostrando Todos'}
            </button>
          </div>
        </div>

        {/* Busca */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text"
            placeholder="Buscar produto pelo nome..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-blue-100 transition"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Grid de Produtos */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-blue-900 animate-spin" />
            <p className="mt-4 text-gray-500 font-medium">Carregando estoque...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((product) => (
              <div 
                key={product.id}
                className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 group hover:border-blue-200 transition-colors"
              >
                {/* Preview Miniatura */}
                <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center border border-gray-50 relative">
                  {product.image_url ? (
                    <img src={product.image_url} alt="" className="w-full h-full object-contain p-2" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-gray-300" />
                  )}
                  {uploading === String(product.id) && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                      <Loader2 className="w-6 h-6 text-blue-900 animate-spin" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-800 text-sm truncate">{product.name}</h3>
                  <p className="text-xs text-gray-400 mb-2">{product.department}</p>
                  
                  {/* Input de Arquivo Customizado */}
                  <label className="cursor-pointer">
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleUpload(file, product.id);
                      }}
                    />
                    <div className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition ${
                      product.image_url 
                        ? 'bg-green-50 text-green-600 hover:bg-green-100' 
                        : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                    }`}>
                      {product.image_url ? (
                        <><CheckCircle2 className="w-3 h-3" /> Alterar Foto</>
                      ) : (
                        <><Upload className="w-3 h-3" /> Enviar Foto</>
                      )}
                    </div>
                  </label>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">Nenhum produto pendente encontrado!</p>
          </div>
        )}
      </div>
    </div>
  );
}