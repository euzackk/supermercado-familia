'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { List, Box, ChevronRight } from "lucide-react";

export default function DepartamentosPage() {
  const [departments, setDepartments] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getDepts() {
        // Busca apenas a coluna department de todos os produtos
        const { data, error } = await supabase
            .from('products')
            .select('department');
        
        if (!error && data) {
            // Filtra duplicatas (Cria um Set com valores únicos e volta para array)
            // Também remove nulos e vazios
            const uniqueDepts = Array.from(new Set(data.map(item => item.department)))
                .filter(dept => dept) 
                .sort(); // Ordena alfabeticamente
            
            setDepartments(uniqueDepts as string[]);
        }
        setLoading(false);
    }
    getDepts();
  }, []);

  return (
    <div className="p-4 pb-24 bg-gray-50 min-h-full">
       <h1 className="text-2xl font-bold text-blue-900 mb-6 flex items-center gap-2">
        <List className="text-orange-500" /> Departamentos
      </h1>
      
      {loading ? (
          <p className="text-gray-500 text-center mt-10">Carregando categorias...</p>
      ) : (
          <div className="grid grid-cols-1 gap-3">
            {departments.map((dept, index) => (
                <div 
                    key={index} 
                    className="bg-white p-4 rounded-xl flex items-center justify-between shadow-sm border border-gray-100 cursor-pointer active:scale-95 transition"
                >
                    <div className="flex items-center gap-4">
                        <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
                            <Box className="w-5 h-5" />
                        </div>
                        <span className="text-gray-800 font-bold text-sm uppercase">
                            {dept}
                        </span>
                    </div>
                    <ChevronRight className="text-gray-300 w-5 h-5" />
                </div>
            ))}
          </div>
      )}
    </div>
  );
}