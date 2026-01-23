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
    <div className="py-4 border-b border-gray-50 last:border-0">
      {/* Cabeçalho da Seção */}
      <div className="flex items-center justify-between px-4 mb-3">
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
        <Link 
          href={deptLink} 
          className="text-xs font-semibold text-orange-500 flex items-center hover:underline"
        >
          Ver mais <ArrowRight className="w-3 h-3 ml-1" />
        </Link>
      </div>

      {/* Lista Horizontal (Scroll Snap) */}
      <div className="flex overflow-x-auto gap-3 px-4 pb-4 snap-x snap-mandatory scrollbar-hide">
        {products.map((product) => (
          <div key={product.id} className="snap-start flex-shrink-0">
            {/* Usamos o modo compact aqui */}
            <ProductCard product={product} compact={true} />
          </div>
        ))}
        
        {/* Card final "Ver Todos" */}
        <Link href={deptLink} className="snap-start flex-shrink-0 w-[140px] flex flex-col items-center justify-center bg-orange-50 rounded-xl border-2 border-dashed border-orange-200 text-orange-500 hover:bg-orange-100 transition cursor-pointer">
          <span className="font-bold text-sm">Ver todos de</span>
          <span className="text-xs mt-1">{title}</span>
          <div className="mt-3 bg-white p-2 rounded-full shadow-sm">
            <ArrowRight className="w-4 h-4" />
          </div>
        </Link>
      </div>
    </div>
  );
}