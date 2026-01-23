'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import ProductCard from './ProductCard';

interface ProductCarouselProps {
  title: string;
  products: any[];
  deptLink: string;
}

export default function ProductCarousel({ title, products, deptLink }: ProductCarouselProps) {
  if (!products || products.length === 0) return null;

  return (
    <div className="py-4 border-b border-gray-50 last:border-0 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Cabeçalho da Seção */}
      <div className="flex items-center justify-between px-4 mb-3">
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
        <Link 
          href={deptLink} 
          className="text-xs font-semibold text-orange-500 flex items-center hover:underline bg-orange-50 px-2 py-1 rounded-full"
        >
          Ver mais <ArrowRight className="w-3 h-3 ml-1" />
        </Link>
      </div>

      {/* Lista Horizontal (Com scroll suave) */}
      <div className="flex overflow-x-auto gap-3 px-4 pb-4 snap-x snap-mandatory scrollbar-hide">
        {products.map((product) => (
          <div key={product.id} className="snap-start flex-shrink-0">
            {/* Aqui ativamos o modo compact */}
            <ProductCard product={product} compact={true} />
          </div>
        ))}
        
        {/* Card final "Ver Todos" */}
        <Link href={deptLink} className="snap-start flex-shrink-0 w-[140px] flex flex-col items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 hover:bg-orange-50 hover:text-orange-500 hover:border-orange-200 transition cursor-pointer">
          <span className="font-bold text-sm">Ver todos</span>
          <div className="mt-2 bg-white p-2 rounded-full shadow-sm">
            <ArrowRight className="w-4 h-4" />
          </div>
        </Link>
      </div>
    </div>
  );
}