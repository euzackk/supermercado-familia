'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Loader2, Search } from 'lucide-react';
import ProductCard from '@/components/ProductCard';

export default function CategoriaPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const deptNameReal = searchParams.get('nome'); // Pega o nome real da URL
  
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDeptProducts() {
      if (!deptNameReal) return;
      setLoading(true);
      
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('department', deptNameReal); // Busca TODOS os produtos desse dept
      
      setProducts(data || []);
      setLoading(false);
    }

    fetchDeptProducts();
  }, [deptNameReal]);

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header da Categoria */}
      <div className="bg-white px-4 py-3 sticky top-0 z-20 shadow-sm flex items-center gap-3 border-b border-gray-100">
        <button onClick={() => router.back()} className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full transition">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="font-bold text-lg text-gray-800 capitalize line-clamp-1">
          {deptNameReal || 'Departamento'}
        </h1>
      </div>

      <div className="p-4">
        {loading ? (
           <div className="flex justify-center mt-20"><Loader2 className="animate-spin text-orange-500 w-8 h-8"/></div>
        ) : products.length > 0 ? (
          // GRID NORMAL (Não carrossel) para ver todos os produtos
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map(prod => (
              <ProductCard key={prod.id} product={prod} compact={false} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center mt-20 text-gray-400">
            <Search className="w-12 h-12 mb-2 opacity-20" />
            <p>Nenhum produto encontrado aqui.</p>
          </div>
        )}
      </div>
    </div>
  );
}