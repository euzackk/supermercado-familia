'use client';

import { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import ProductCarousel from '@/components/ProductCarousel';
import Link from 'next/link';

export default function HomePage() {
  const [groupedProducts, setGroupedProducts] = useState<Record<string, any[]>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Busca produtos e agrupa por departamento
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Buscamos 200 produtos para ter variedade
        const { data, error } = await supabase.from('products').select('*').limit(200);
        if (error) throw error;

        // Agrupamento manual via Javascript
        const groups: Record<string, any[]> = {};
        data?.forEach((prod) => {
          const dept = prod.department || 'Outros';
          if (!groups[dept]) groups[dept] = [];
          // Limitamos a 6 produtos por carrossel na home
          if (groups[dept].length < 6) {
            groups[dept].push(prod);
          }
        });

        setGroupedProducts(groups);
      } catch (error) {
        console.error('Erro ao buscar:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Função para criar URL amigável (slug)
  const slugify = (text: string) => 
    text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

  return (
    <div className="flex-1 flex flex-col bg-white pb-24 overflow-y-auto">
      
      {/* Busca (Apenas visual, leva para página de busca se quiser implementar depois) */}
      <div className="sticky top-0 bg-white z-20 px-4 py-3 shadow-sm border-b border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="O que você precisa?"
            className="w-full bg-gray-100 rounded-full py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-orange-200 outline-none transition"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center mt-20">
          <Loader2 className="animate-spin text-orange-500 w-8 h-8" />
        </div>
      ) : (
        <div className="space-y-2 mt-2">
          {/* Se tiver busca, exibe mensagem simples (ou implemente filtro aqui) */}
          {searchTerm ? (
             <div className="p-8 text-center text-gray-500">
                <p>A busca global está sendo implementada.</p>
                <p>Por enquanto, navegue pelos departamentos abaixo.</p>
             </div>
          ) : (
            // Renderiza um Carrossel para cada Departamento encontrado
            Object.entries(groupedProducts).map(([deptName, products]) => (
              <ProductCarousel 
                key={deptName}
                title={deptName}
                products={products}
                deptLink={`/categoria/${slugify(deptName)}?nome=${encodeURIComponent(deptName)}`}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}