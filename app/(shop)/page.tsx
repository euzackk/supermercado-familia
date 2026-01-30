'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Loader2, X, ChevronRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import ProductCarousel from '@/components/ProductCarousel';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function HomePage() {
  const router = useRouter();
  const [groupedProducts, setGroupedProducts] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);
  
  // Estados da Busca
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  // Carrega produtos da home (Carrosséis)
  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await supabase.from('products').select('*').limit(200);
        const groups: Record<string, any[]> = {};
        data?.forEach((prod) => {
          const dept = prod.department?.trim() || 'Outros';
          if (!groups[dept]) groups[dept] = [];
          if (groups[dept].length < 6) groups[dept].push(prod);
        });
        setGroupedProducts(groups);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Lógica da Busca (Autocomplete)
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    
    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    if (term.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    searchTimeout.current = setTimeout(async () => {
      // Busca no banco produtos que contêm o termo (ilike = case insensitive)
      const { data } = await supabase
        .from('products')
        .select('id, name, price, image_url, department')
        .ilike('name', `%${term}%`)
        .limit(6);
      
      setSearchResults(data || []);
      setIsSearching(false);
    }, 400); // Espera 400ms após parar de digitar para buscar
  };

  const slugify = (text: string) => 
    text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w\s-]/g, "").replace(/\s+/g, '-');

  return (
    <div className="flex-1 flex flex-col bg-white pb-24 overflow-y-auto relative">
      
      {/* --- BARRA DE BUSCA STICKY --- */}
      <div className="sticky top-0 bg-white z-30 px-4 py-3 shadow-sm border-b border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          
          <input 
            type="text" 
            placeholder="Arroz, leite, carne..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full bg-gray-100 rounded-xl py-3 pl-10 pr-10 text-sm focus:ring-2 focus:ring-orange-200 focus:bg-white outline-none transition-all"
          />
          
          {/* Botão limpar busca */}
          {searchTerm && (
            <button 
              onClick={() => { setSearchTerm(''); setSearchResults([]); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 p-1 hover:text-gray-800"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* --- DROPDOWN DE RESULTADOS (A Mágica) --- */}
          {(searchTerm.length >= 2) && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2">
              {isSearching ? (
                <div className="p-4 flex items-center justify-center text-gray-400 gap-2">
                  <Loader2 className="animate-spin w-4 h-4" /> Buscando...
                </div>
              ) : searchResults.length > 0 ? (
                <ul>
                  {searchResults.map((prod) => (
                    <li key={prod.id} className="border-b border-gray-50 last:border-0">
                      <Link 
                        href={`/produto/${prod.id}`} // Link para a nova página de produto
                        className="flex items-center gap-3 p-3 hover:bg-orange-50 transition cursor-pointer"
                      >
                         <div className="w-10 h-10 bg-gray-50 rounded-md flex items-center justify-center flex-shrink-0">
                           {prod.image_url ? (
                             <img src={prod.image_url} className="w-full h-full object-contain" alt="" />
                           ) : <Search className="w-4 h-4 text-gray-300"/>}
                         </div>
                         <div className="flex-1 min-w-0">
                           <p className="text-sm font-medium text-gray-800 truncate">{prod.name}</p>
                           <p className="text-xs text-gray-500">{prod.department}</p>
                         </div>
                         <div className="text-right">
                           <p className="text-sm font-bold text-emerald-600">
                             {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(prod.price)}
                           </p>
                         </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-4 text-center text-gray-500 text-sm">
                  Nenhum produto encontrado para "{searchTerm}"
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* --- CONTEÚDO DA HOME --- */}
      {loading ? (
        <div className="flex flex-col items-center justify-center mt-20 gap-2">
          <Loader2 className="animate-spin text-orange-500 w-8 h-8" />
          <p className="text-gray-400 text-xs">Montando vitrine...</p>
        </div>
      ) : (
        <div className="space-y-2 mt-2">
          {Object.entries(groupedProducts).map(([deptName, products]) => (
            <ProductCarousel 
              key={deptName}
              title={deptName}
              products={products}
              deptLink={`/categoria/${slugify(deptName)}?nome=${encodeURIComponent(deptName)}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}