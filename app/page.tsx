'use client';

import { useState, useEffect } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import ProductCard from '@/components/ProductCard';
import EmptyState from '@/components/EmptyState';

// ... (Tipos mantidos iguais)
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
    <div className="flex-1 flex flex-col px-4 pt-4 pb-24 overflow-y-auto">
      
      {/* Barra de Busca */}
      <div className="relative w-full mb-6 mt-2">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Search className="w-5 h-5" />
        </div>
        <input 
          type="text" 
          placeholder="Busque por nome..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-gray-100 rounded-lg py-3 pl-10 pr-10 text-gray-700 outline-none focus:ring-2 focus:ring-orange-200 transition-all"
        />
        {searchTerm && (
          <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 p-1">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* AQUI ESTÁ A CORREÇÃO DO LAYOUT: grid-cols-2 */}
      {loading ? (
        <div className="flex-1 flex justify-center items-center mt-20">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
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