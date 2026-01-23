'use client';

import { useState, useEffect } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import ProductCard from '@/components/ProductCard';
import EmptyState from '@/components/EmptyState';

// Tipos
type Product = {
  id: number;
  name: string;
  price: number;
  department: string;
  image_url?: string;
};

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  async function fetchProducts(term: string) {
    setLoading(true);
    try {
      let query = supabase.from('products').select('*').limit(50);
      if (term) query = query.ilike('name', `%${term}%`);
      const { data, error } = await query;
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const delayDebounce = setTimeout(() => { fetchProducts(searchTerm); }, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  return (
    <div className="flex-1 flex flex-col px-4 pt-4 pb-24 overflow-y-auto bg-white">
      
      {/* Barra de Busca - Visual levemente melhorado */}
      <div className="sticky top-0 bg-white z-10 py-2">
        <div className="relative w-full">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search className="w-5 h-5" />
          </div>
          <input 
            type="text" 
            placeholder="O que você procura hoje?"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-10 text-gray-700 outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 transition-all shadow-sm"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 p-1 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Grid de Produtos */}
      {loading ? (
        <div className="flex-1 flex flex-col justify-center items-center mt-20 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            <p className="text-sm text-gray-400">Carregando ofertas...</p>
        </div>
      ) : products.length > 0 ? (
        // Grid ajustado: gap-3 para mobile, gap-4 para telas maiores
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 mt-4 animate-in fade-in duration-500">
          {products.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}