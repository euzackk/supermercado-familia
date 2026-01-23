'use client';

import { Image as ImageIcon, Plus, Heart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/context/FavoritesContext';

interface ProductProps {
  product: {
    id: number;
    name: string;
    price: number;
    department: string;
    image_url?: string;
  };
  compact?: boolean; // Nova propriedade para versao menor
}

export default function ProductCard({ product, compact = false }: ProductProps) {
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(product.price || 0);

  const liked = isFavorite ? isFavorite(product.id) : false;

  return (
    <div className={`bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col relative group overflow-hidden hover:shadow-lg transition-all duration-300 ${compact ? 'w-[160px] md:w-[180px]' : 'w-full'}`}>
      
      {/* Botão Favorito */}
      <button 
        onClick={() => toggleFavorite && toggleFavorite(product)}
        className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white text-gray-400 hover:text-red-500 transition"
      >
        <Heart className={`w-4 h-4 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
      </button>

      {/* Imagem Quadrada (O segredo anti-alongamento) */}
      <div className="w-full aspect-square bg-gray-50 flex items-center justify-center p-3 relative">
        {product.image_url ? (
           <img 
             src={product.image_url} 
             alt={product.name} 
             className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" 
           />
        ) : (
           <ImageIcon className="text-gray-200 w-10 h-10" />
        )}
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1 gap-1">
        <span className="text-[10px] text-orange-500 font-bold uppercase tracking-wider line-clamp-1">
            {product.department}
        </span>
        
        <h3 className="font-medium text-gray-700 text-xs leading-snug line-clamp-2 min-h-[2.5em]" title={product.name}>
          {product.name}
        </h3>
        
        <div className="mt-auto pt-2 flex items-center justify-between">
          <span className="font-bold text-sm text-gray-900">
            {formattedPrice}
          </span>
          
          <button 
            onClick={() => addToCart(product)}
            className="bg-green-500 text-white w-7 h-7 rounded-full flex items-center justify-center hover:bg-green-600 active:scale-90 transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}