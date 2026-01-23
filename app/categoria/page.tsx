'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';

export default function CategoriaPage() {
  const params = useParams(); // Pega o slug da URL
  const searchParams = useSearchParams();
  const deptNameReal = searchParams.get('nome'); // Pega o nome bonito via ?nome=...
  
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDeptProducts() {
      if (!deptNameReal) return;
      setLoading(true);
      
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('department', deptNameReal); // Busca exata pelo nome do departamento
      
      setProducts(data || []);
      setLoading(false);
    }

    fetchDeptProducts();
  }, [deptNameReal]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header Simples com Voltar */}
      <div className="bg-white px-4 py-3 sticky top-0 z-10 shadow-sm flex items-center gap-3">
        <Link href="/" className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="font-bold text-lg capitalize">{deptNameReal || 'Departamento'}</h1>
      </div>

      <div className="p-4">
        {loading ? (
           <div className="flex justify-center mt-10"><Loader2 className="animate-spin text-orange-500"/></div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {products.map(prod => (
              // Aqui NÃO usamos compact=true, para ele preencher a grid
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}
        
        {!loading && products.length === 0 && (
          <p className="text-center text-gray-400 mt-10">Nenhum produto encontrado neste departamento.</p>
        )}
      </div>
    </div>
  );
}