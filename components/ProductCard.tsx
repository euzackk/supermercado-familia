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
        className="block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow relative flex flex-col h-full"
    >
      {/* 1. Imagem com Altura Fixa (H-32 = 128px) */}
      <div className="relative h-32 w-full bg-gray-50 flex items-center justify-center p-4 flex-shrink-0">
        {product.image_url ? (
          <Image 
            src={product.image_url} 
            alt={product.name} 
            fill 
            className="object-contain mix-blend-multiply p-2"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        ) : (
          <div className="text-gray-300 text-[10px] text-center">Sem foto</div>
        )}
      </div>

      {/* 2. Conteúdo com Flex-1 para empurrar o rodapé para baixo */}
      <div className="p-3 flex flex-col flex-1">
        
        {/* 3. Título com Altura Mínima e Máxima Fixa (2 linhas) */}
        <div className="h-10 mb-1 overflow-hidden"> 
          <h3 className="text-sm font-bold text-gray-800 line-clamp-2 leading-tight">
            {product.name}
          </h3>
        </div>

        {/* 4. Área de Tags com Altura Fixa (H-5) */}
        <div className="h-5 mb-2">
          {isBulk && (
            <span className="inline-block text-[9px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
              Peso/Balança
            </span>
          )}
        </div>

        {/* 5. Rodapé (Preço e Botão) sempre alinhado na base */}
        <div className="mt-auto flex items-center justify-between gap-2">
          <div className="flex flex-col">
             <span className="text-[10px] text-gray-400 font-bold uppercase leading-none">Preço</span>
             <div className="flex items-baseline gap-0.5 mt-1">
                <span className="text-[10px] font-bold text-blue-900">R$</span>
                <span className="text-base font-extrabold text-blue-900 leading-none">
                  {product.price.toFixed(2).replace('.', ',')}
                </span>
                <span className="text-[10px] font-normal text-gray-400">/{isBulk ? 'kg' : 'un'}</span>
             </div>
          </div>

          <button 
            onClick={handleInteraction}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition shadow-sm active:scale-90 flex-shrink-0
                ${isBulk 
                    ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
                    : adding 
                        ? 'bg-green-500 text-white' 
                        : 'bg-orange-500 text-white hover:bg-orange-600'
                }
            `}
          >
            {isBulk ? (
                <Scale className="w-4 h-4" />
            ) : adding ? (
                <span className="animate-ping w-2 h-2 bg-white rounded-full"></span>
            ) : (
                <Plus className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </Link>
  );
}