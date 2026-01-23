'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { ArrowRight, LayoutGrid, Search, Loader2 } from 'lucide-react';

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDepts() {
      try {
        // Busca apenas a coluna de departamento de todos os produtos
        const { data } = await supabase.from('products').select('department');
        
        if (data) {
          // O "Set" remove duplicatas automaticamente
          const uniqueDepts = Array.from(new Set(data.map(p => p.department?.trim() || 'Outros'))).sort();
          setDepartments(uniqueDepts.filter(d => d)); // Remove vazios
        }
      } catch (error) {
        console.error('Erro ao buscar departamentos', error);
      } finally {
        setLoading(false);
      }
    }
    fetchDepts();
  }, []);

  // Função para criar o link (mesma logica da Home)
  const slugify = (text: string) => 
    text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w\s-]/g, "").replace(/\s+/g, '-');

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Cabeçalho */}
      <div className="bg-white p-4 shadow-sm border-b border-gray-100 sticky top-0 z-10">
        <h1 className="text-xl font-bold flex items-center gap-2 text-gray-800">
          <LayoutGrid className="w-6 h-6 text-orange-500" />
          Departamentos
        </h1>
        <p className="text-xs text-gray-500 mt-1">Navegue por todas as seções</p>
      </div>

      {/* Lista de Departamentos */}
      <div className="p-4">
        {loading ? (
          <div className="flex justify-center mt-20">
            <Loader2 className="animate-spin text-orange-500 w-8 h-8" />
          </div>
        ) : departments.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {departments.map((dept) => (
              <Link 
                key={dept}
                // Link formatado corretamente para a pasta [slug]
                href={`/categoria/${slugify(dept)}?nome=${encodeURIComponent(dept)}`}
                className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center gap-3 text-center hover:border-orange-300 hover:shadow-md transition group h-32"
              >
                {/* Ícone Genérico (pode personalizar depois) */}
                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 group-hover:scale-110 transition">
                  <Search className="w-5 h-5" />
                </div>
                
                <span className="font-semibold text-sm text-gray-700 group-hover:text-orange-600 line-clamp-2">
                  {dept}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 mt-20">
            <p>Nenhum departamento encontrado.</p>
          </div>
        )}
      </div>
    </div>
  );
}