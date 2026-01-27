'use client';

import { Plus, Scale, Heart } from 'lucide-react'; // Importei o Heart
import { useCart, Product } from '@/context/CartContext';
import { useFavorites } from '@/context/FavoritesContext'; // <--- Importe seu contexto
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

// Se o seu contexto de favoritos não exportar um hook 'useFavorites', 
// certifique-se de criar ou ajustar a importação acima.
// Vou assumir que ele tem a função toggleFavorite e isFavorite.

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  
  // Assumindo que seu FavoritesContext tem essas funções. 
  // Se não tiver, me avise que ajustamos o Contexto.
  const { toggleFavorite, isFavorite } = useFavorites(); 
  
  const router = useRouter();
  const [adding, setAdding] = useState(false);

  const isBulk = product.type_sale === 'bulk';
  const isFav = isFavorite ? isFavorite(product.id) : false; // Proteção caso o contexto não esteja pronto

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
    // Feedback visual rápido de "Piscada"
    setTimeout(() => setAdding(false), 500);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (toggleFavorite) toggleFavorite(product);
  };

  return (
    <Link 
        href={`/produto/${product.id}`}
        className="group block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all relative flex flex-col h-full"
    >
      {/* Botão de Favorito Flutuante */}
      <button 
        onClick={handleFavoriteClick}
        className="absolute top-2 right-2 z-10 p-2 rounded-full bg-white/80 hover:bg-white shadow-sm transition-transform active:scale-90"
      >
        <Heart 
            className={`w-4 h-4 transition-colors ${isFav ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} 
        />
      </button>

      {/* 1. CONTAINER DA IMAGEM */}
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
            // Placeholder melhorado
          <div className="flex flex-col items-center justify-center text-gray-300">
             <div className="w-8 h-8 rounded-full bg-gray-200 mb-1" />
             <span className="text-[10px] font-bold uppercase tracking-tighter">Sem Foto</span>
          </div>
        )}
      </div>

      {/* 2. CONTEÚDO */}
      <div className="p-3 flex flex-col flex-1">
        
        {/* Título */}
        <div className="h-10 mb-1 flex items-start overflow-hidden"> 
          <h3 className="text-sm font-bold text-gray-800 line-clamp-2 leading-tight">
            {product.name}
          </h3>
        </div>

        {/* Etiqueta */}
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

        {/* Rodapé e Botão de Ação */}
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
                        ? 'bg-green-500 text-white shadow-green-200' 
                        : 'bg-orange-500 text-white hover:bg-orange-600 shadow-orange-200'
                }
            `}
          >
            {isBulk ? (
                <Scale className="w-5 h-5" />
            ) : adding ? (
                <Plus className="w-6 h-6 animate-pulse" /> // Mudei para icone fixo com pulse
            ) : (
                <Plus className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>
    </Link>
  );
}