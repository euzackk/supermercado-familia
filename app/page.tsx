'use client';

import { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import ProductCarousel from '@/components/ProductCarousel';

export default function HomePage() {
  const [groupedProducts, setGroupedProducts] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Busca 200 produtos para garantir variedade
        const { data, error } = await supabase.from('products').select('*').limit(200);
        if (error) throw error;

        // Agrupa por departamento
        const groups: Record<string, any[]> = {};
        
        data?.forEach((prod) => {
          // Usa 'Outros' se o departamento estiver vazio
          const dept = prod.department?.trim() || 'Outros';
          
          if (!groups[dept]) groups[dept] = [];
          
          // Lógica: Mostra apenas os primeiros 6 produtos de cada dept na Home
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

  // Função simples para limpar texto da URL
  const slugify = (text: string) => 
    text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w\s-]/g, "").replace(/\s+/g, '-');

  return (
    <div className="flex-1 flex flex-col bg-white pb-24 overflow-y-auto">
      
      {/* Busca (Visual) */}
      <div className="sticky top-0 bg-white z-20 px-4 py-3 shadow-sm border-b border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="O que você procura hoje?"
            className="w-full bg-gray-100 rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-orange-200 outline-none transition"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center mt-20 gap-2">
          <Loader2 className="animate-spin text-orange-500 w-8 h-8" />
          <p className="text-gray-400 text-xs">Carregando prateleiras...</p>
        </div>
      ) : (
        <div className="space-y-2 mt-2">
          {Object.keys(groupedProducts).length === 0 ? (
             <p className="text-center text-gray-400 mt-10">Nenhum produto encontrado.</p>
          ) : (
            // Cria um carrossel para cada grupo
            Object.entries(groupedProducts).map(([deptName, products]) => (
              <ProductCarousel 
                key={deptName}
                title={deptName}
                products={products}
                // Link para a página exclusiva
                deptLink={`/categoria/${slugify(deptName)}?nome=${encodeURIComponent(deptName)}`}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}