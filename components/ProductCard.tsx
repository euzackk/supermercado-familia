'use client';

import { ShoppingCart, Plus, Scale } from 'lucide-react';
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

  // Verifica se é produto de balança (Bulk) lendo do banco
  const isBulk = product.type_sale === 'bulk';

  const handleInteraction = (e: React.MouseEvent) => {
    e.preventDefault(); // Impede o Link principal de abrir (se houver)
    e.stopPropagation();

    if (isBulk) {
      // SE FOR PESO: Redireciona para a página de detalhes para escolher a quantidade
      router.push(`/produto/${product.id}`);
    } else {
      // SE FOR UNIDADE: Adiciona direto (1 unidade)
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
      {/* Imagem */}
      <div className="relative h-32 w-full bg-gray-50 flex items-center justify-center p-4">
        {product.image_url ? (
          <Image 
            src={product.image_url} 
            alt={product.name} 
            fill 
            className="object-contain mix-blend-multiply p-2"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        ) : (
          <div className="text-gray-300 text-xs">Sem foto</div>
        )}
      </div>

      {/* Conteúdo */}
      <div className="p-3 flex flex-col flex-1">
        <div className="flex-1">
            <h3 className="text-sm font-bold text-gray-800 line-clamp-2 mb-1 leading-tight min-h-[2.5em]">
            {product.name}
            </h3>
            {/* Tag discreta para identificar o tipo */}
            {isBulk && (
                <span className="inline-block text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded mb-1">
                    Vendido por Peso
                </span>
            )}
        </div>

        <div className="mt-2 flex items-center justify-between gap-2">
          <div className="flex flex-col">
             <span className="text-xs text-gray-400">Preço</span>
             <span className="text-lg font-extrabold text-blue-900">
               R$ {product.price.toFixed(2).replace('.', ',')}
               <span className="text-xs font-normal text-gray-400">/{isBulk ? 'kg' : 'un'}</span>
             </span>
          </div>

          <button 
            onClick={handleInteraction}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition shadow-sm active:scale-90 flex-shrink-0
                ${isBulk 
                    ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' // Botão Azul para Peso (Leva pra página)
                    : adding 
                        ? 'bg-green-500 text-white' 
                        : 'bg-orange-500 text-white hover:bg-orange-600' // Botão Laranja para Unidade (Adiciona direto)
                }
            `}
          >
            {isBulk ? (
                <Scale className="w-4 h-4" /> // Ícone de balança para indicar "escolher"
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