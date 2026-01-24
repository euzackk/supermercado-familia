'use client';

import { Plus, Scale } from 'lucide-react';
import { useCart, Product } from '@/context/CartContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const router = useRouter();
  const [adding, setAdding] = useState(false);

  // Verifica se é produto de balança (Bulk)
  const isBulk = product.type_sale === 'bulk';

  const handleInteraction = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isBulk) {
      router.push(`/produto/${product.id}`);
    } else {
      handleQuickAdd();
    }
  };

  const handleQuickAdd = () => {
    setAdding(true);
    addToCart(product, 1);
    setTimeout(() => setAdding(false), 500);
  };

  return (
    <Link 
        href={`/produto/${product.id}`}
        className="group block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all relative flex flex-col h-full"
    >
      {/* 1. CONTAINER DA IMAGEM: Altura fixa obrigatória */}
      <div className="relative h-36 w-full bg-gray-50/50 flex items-center justify-center p-4 flex-shrink-0 border-b border-gray-50">
        {product.image_url ? (
          <Image 
            src={product.image_url} 
            alt={product.name} 
            fill 
            className="object-contain mix-blend-multiply p-3 group-hover:scale-110 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        ) : (
          <div className="text-gray-300 text-[10px] font-bold uppercase tracking-tighter">Sem Imagem</div>
        )}
      </div>

      {/* 2. CONTEÚDO: Espaçamento interno padronizado */}
      <div className="p-3 flex flex-col flex-1">
        
        {/* 3. ÁREA DO TÍTULO: Altura fixa (h-10) garante 2 linhas sempre */}
        <div className="h-10 mb-1 flex items-start overflow-hidden"> 
          <h3 className="text-sm font-bold text-gray-800 line-clamp-2 leading-tight">
            {product.name}
          </h3>
        </div>

        {/* 4. ÁREA DA ETIQUETA: Altura fixa (h-5) para alinhar o preço abaixo */}
        <div className="h-5 mb-2 flex items-center">
          {isBulk ? (
            <span className="text-[9px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider">
              Balança/Kg
            </span>
          ) : (
            <span className="text-[9px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider">
              Unidade
            </span>
          )}
        </div>

        {/* 5. RODAPÉ: mt-auto empurra o preço para a base do card */}
        <div className="mt-auto pt-2 flex items-end justify-between gap-1 border-t border-gray-50">
          <div className="flex flex-col">
             <span className="text-[9px] text-gray-400 font-bold uppercase leading-none">Preço</span>
             <div className="flex items-baseline gap-0.5 mt-1">
                <span className="text-[10px] font-bold text-blue-900">R$</span>
                <span className="text-lg font-black text-blue-900 leading-none">
                  {product.price.toFixed(2).replace('.', ',')}
                </span>
                <span className="text-[10px] font-medium text-gray-400">/{isBulk ? 'kg' : 'un'}</span>
             </div>
          </div>

          <button 
            onClick={handleInteraction}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-sm active:scale-90 flex-shrink-0
                ${isBulk 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : adding 
                        ? 'bg-green-500 text-white' 
                        : 'bg-orange-500 text-white hover:bg-orange-600 shadow-orange-200'
                }
            `}
          >
            {isBulk ? (
                <Scale className="w-5 h-5" />
            ) : adding ? (
                <span className="animate-ping w-2 h-2 bg-white rounded-full"></span>
            ) : (
                <Plus className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>
    </Link>
  );
}