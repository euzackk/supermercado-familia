'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Upload, 
  Search, 
  Image as ImageIcon, 
  CheckCircle2, 
  Loader2,
  Filter,
  LayoutGrid,
  List as ListIcon,
  Trash2,
  ChevronLeft,
  ChevronRight,
  XCircle,
  AlertTriangle
} from 'lucide-react';

// --- Tipos ---
type Product = {
  id: number;
  name: string;
  department: string;
  image_url: string | null;
};

type ToastType = {
  id: number;
  type: 'success' | 'error';
  message: string;
};

const ITEMS_PER_PAGE = 12;

export default function AdminImagensPage() {
  // --- Estados ---
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterMissing, setFilterMissing] = useState(true); // Começa mostrando quem falta foto
  const [uploading, setUploading] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [toasts, setToasts] = useState<ToastType[]>([]);
  const [dragActiveId, setDragActiveId] = useState<number | null>(null);

  // --- Efeitos ---
  useEffect(() => {
    fetchProducts();
  }, []);

  // Resetar página quando filtrar
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterMissing]);

  // --- Funções Auxiliares ---
  const showToast = (message: string, type: 'success' | 'error') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  async function fetchProducts() {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('id, name, department, image_url')
      .order('name', { ascending: true });
    
    if (error) {
      showToast('Erro ao carregar produtos', 'error');
    } else if (data) {
      setProducts(data);
    }
    setLoading(false);
  }

  // --- Lógica de Filtragem e Paginação ---
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filterMissing ? !p.image_url : true;
      return matchesSearch && matchesFilter;
    });
  }, [products, search, filterMissing]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // --- Estatísticas ---
  const stats = useMemo(() => {
    const total = products.length;
    const withImg = products.filter(p => p.image_url).length;
    const withoutImg = total - withImg;
    const percentage = total === 0 ? 0 : Math.round((withImg / total) * 100);
    return { total, withImg, withoutImg, percentage };
  }, [products]);

  // --- Manipuladores de Ação ---

  async function handleUpload(file: File, productId: number) {
    // Validação básica
    if (!file.type.startsWith('image/')) {
      showToast('Por favor, envie apenas arquivos de imagem.', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      showToast('A imagem deve ter no máximo 5MB.', 'error');
      return;
    }

    try {
      setUploading(String(productId));
      
      const fileExt = file.name.split('.').pop();
      // Usar timestamp garante que o navegador não faça cache da imagem antiga
      const fileName = `${productId}-${Date.now()}.${fileExt}`;
      const filePath = `product-images/${fileName}`;

      // 1. Upload
      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // 2. Get URL
      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);

      // 3. Update DB
      const { error: updateError } = await supabase
        .from('products')
        .update({ image_url: publicUrl })
        .eq('id', productId);

      if (updateError) throw updateError;

      // 4. Update State Local
      setProducts(prev => prev.map(p => 
        p.id === productId ? { ...p, image_url: publicUrl } : p
      ));
      
      showToast('Imagem atualizada com sucesso!', 'success');

    } catch (error) {
      console.error(error);
      showToast('Erro ao fazer upload da imagem.', 'error');
    } finally {
      setUploading(null);
      setDragActiveId(null);
    }
  }

  async function handleRemoveImage(productId: number) {
    if (!confirm('Tem certeza que deseja remover a imagem deste produto?')) return;

    try {
      setUploading(String(productId));
      
      const { error } = await supabase
        .from('products')
        .update({ image_url: null })
        .eq('id', productId);

      if (error) throw error;

      setProducts(prev => prev.map(p => 
        p.id === productId ? { ...p, image_url: null } : p
      ));
      
      showToast('Imagem removida.', 'success');
    } catch (error) {
      console.error(error);
      showToast('Erro ao remover imagem.', 'error');
    } finally {
      setUploading(null);
    }
  }

  // Drag and Drop Handlers
  const handleDrag = useCallback((e: React.DragEvent, id: number | null) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      if (id) setDragActiveId(id);
    } else if (e.type === 'dragleave') {
      setDragActiveId(null);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, productId: number) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveId(null);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0], productId);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Toast Notification Container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map(t => (
          <div key={t.id} className={`flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg border animate-in slide-in-from-right-full ${
            t.type === 'success' ? 'bg-white border-green-200 text-green-700' : 'bg-white border-red-200 text-red-700'
          }`}>
            {t.type === 'success' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
            <span className="text-sm font-bold">{t.message}</span>
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-8">
        
        {/* --- Header & Stats --- */}
        <div className="mb-8">
          <h1 className="text-2xl font-black text-blue-900 flex items-center gap-2 mb-6">
            <ImageIcon className="w-8 h-8 text-orange-500" />
            Gestor de Mídia
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Total de Produtos</p>
              <div className="text-3xl font-black text-gray-800">{stats.total}</div>
            </div>
            
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
              <div className="flex justify-between items-end mb-2 relative z-10">
                <div>
                  <p className="text-green-600 text-xs font-bold uppercase tracking-wider mb-1">Com Imagem</p>
                  <div className="text-3xl font-black text-gray-800">{stats.withImg}</div>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-green-500">{stats.percentage}%</span>
                </div>
              </div>
              {/* Barra de progresso visual no fundo */}
              <div className="absolute bottom-0 left-0 h-1 bg-green-500 transition-all duration-1000" style={{ width: `${stats.percentage}%` }}></div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
               <p className="text-orange-500 text-xs font-bold uppercase tracking-wider mb-1">Pendentes</p>
               <div className="text-3xl font-black text-gray-800">{stats.withoutImg}</div>
            </div>
          </div>
        </div>

        {/* --- Toolbar --- */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6 sticky top-2 z-30 bg-gray-50/95 backdrop-blur-sm py-2">
          {/* Busca */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text"
              placeholder="Buscar por nome, marca ou categoria..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
            {/* Filtro Toggle */}
            <button 
              onClick={() => setFilterMissing(!filterMissing)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition whitespace-nowrap ${
                filterMissing 
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-200' 
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              <Filter size={16} />
              {filterMissing ? 'Pendentes' : 'Todos'}
            </button>

            {/* View Toggle */}
            <div className="flex bg-white rounded-xl border border-gray-200 p-1">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition ${viewMode === 'grid' ? 'bg-gray-100 text-blue-900' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <LayoutGrid size={20} />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition ${viewMode === 'list' ? 'bg-gray-100 text-blue-900' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <ListIcon size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* --- Conteúdo Principal --- */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            <p className="mt-4 text-gray-500 font-medium">Carregando catálogo...</p>
          </div>
        ) : (
          <>
            {paginatedProducts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                <AlertTriangle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">Nenhum produto encontrado com os filtros atuais.</p>
                <button 
                  onClick={() => { setSearch(''); setFilterMissing(false); }}
                  className="mt-4 text-blue-600 font-bold text-sm hover:underline"
                >
                  Limpar filtros
                </button>
              </div>
            ) : (
              <div className={
                viewMode === 'grid' 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                  : "flex flex-col gap-3"
              }>
                {paginatedProducts.map((product) => (
                  <div 
                    key={product.id}
                    onDragEnter={(e) => handleDrag(e, product.id)}
                    onDragLeave={(e) => handleDrag(e, null)}
                    onDragOver={(e) => handleDrag(e, product.id)}
                    onDrop={(e) => handleDrop(e, product.id)}
                    className={`
                      relative group bg-white border transition-all duration-200
                      ${viewMode === 'grid' ? 'rounded-2xl p-4 hover:shadow-lg' : 'rounded-xl p-3 flex items-center gap-4 hover:border-blue-300'}
                      ${dragActiveId === product.id ? 'border-2 border-dashed border-blue-500 bg-blue-50 ring-4 ring-blue-100' : 'border-gray-100 shadow-sm'}
                    `}
                  >
                    {/* Área da Imagem */}
                    <div className={`
                      relative overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center
                      ${viewMode === 'grid' ? 'w-full h-48 rounded-xl mb-4' : 'w-16 h-16 rounded-lg flex-shrink-0'}
                    `}>
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="w-full h-full object-contain p-2 mix-blend-multiply" />
                      ) : (
                        <ImageIcon className="text-gray-300" size={viewMode === 'grid' ? 48 : 24} />
                      )}
                      
                      {/* Overlay de Uploading */}
                      {uploading === String(product.id) && (
                        <div className="absolute inset-0 bg-white/90 flex items-center justify-center z-10">
                          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                        </div>
                      )}

                      {/* Overlay de Drag Drop Dica */}
                      {dragActiveId === product.id && (
                        <div className="absolute inset-0 bg-blue-500/10 flex items-center justify-center z-20 backdrop-blur-[1px]">
                          <p className="text-blue-600 font-bold bg-white px-3 py-1 rounded-full shadow-sm text-xs pointer-events-none">
                            Solte para enviar
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Informações */}
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-bold text-gray-800 truncate ${viewMode === 'grid' ? 'text-base' : 'text-sm'}`}>
                        {product.name}
                      </h3>
                      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-3">
                        {product.department || 'Sem departamento'}
                      </p>

                      {/* Ações */}
                      <div className="flex items-center gap-2">
                        <label className={`
                          flex-1 flex items-center justify-center gap-2 cursor-pointer transition rounded-lg font-bold text-xs py-2
                          ${product.image_url 
                             ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
                             : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200'}
                        `}>
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleUpload(file, product.id);
                            }}
                          />
                          <Upload size={14} />
                          {product.image_url ? 'Trocar' : 'Enviar Foto'}
                        </label>

                        {product.image_url && (
                          <button 
                            onClick={() => handleRemoveImage(product.id)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition"
                            title="Remover imagem"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* --- Paginação --- */}
            {filteredProducts.length > ITEMS_PER_PAGE && (
              <div className="flex justify-center items-center gap-4 mt-10">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft size={20} />
                </button>
                
                <span className="text-sm font-bold text-gray-600">
                  Página {currentPage} de {totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}