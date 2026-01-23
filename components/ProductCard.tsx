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
}

export default function ProductCard({ product }: ProductProps) {
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(product.price || 0);

  const liked = isFavorite(product.id);

  return (
    <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex flex-col h-full relative group hover:border-orange-300 hover:shadow-md transition-all">
      
      {/* Botão de Favoritar (Coração) no topo direito */}
      <button 
        onClick={() => toggleFavorite(product)}
        className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-white/80 shadow-sm hover:bg-white transition"
      >
        <Heart className={`w-4 h-4 ${liked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
      </button>

      {/* Imagem do Produto */}
      <div className="bg-gray-50 h-32 rounded-lg mb-2 flex items-center justify-center relative overflow-hidden">
        {product.image_url ? (
           <img src={product.image_url} alt={product.name} className="object-contain w-full h-full p-2" />
        ) : (
           <ImageIcon className="text-gray-200 w-8 h-8" />
        )}
      </div>

      {/* Informações */}
      <div className="flex flex-col flex-1 justify-between">
        <div>
          <span className="text-[9px] text-orange-500 font-bold uppercase tracking-wider mb-1 line-clamp-1">
              {product.department || 'Geral'}
          </span>
          
          <h3 className="font-medium text-gray-800 text-xs leading-tight mb-2 line-clamp-2 min-h-[2.5em]" title={product.name}>
            {product.name}
          </h3>
        </div>
        
        {/* Preço e Botão Adicionar */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-50 mt-1">
          <span className="font-bold text-blue-900 text-sm">
            {formattedPrice}
          </span>
          
          <button 
            onClick={() => addToCart(product)}
            className="bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-green-600 active:scale-90 transition shadow-sm"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}