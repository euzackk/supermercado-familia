'use client';

import { Heart, ArrowLeft } from "lucide-react";
import { useFavorites } from "@/context/FavoritesContext";
import ProductCard from "@/components/ProductCard";
import { useRouter } from "next/navigation";

export default function FavoritosPage() {
  const { favorites } = useFavorites();
  const router = useRouter();

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] p-4">
        <div className="bg-gray-100 p-6 rounded-full mb-4">
          <Heart className="w-10 h-10 text-gray-400" />
        </div>
        <h1 className="text-xl font-bold text-blue-900 mb-2">
           Lista de Desejos Vazia
        </h1>
        <p className="text-gray-500 text-center max-w-xs mb-6">
          Você ainda não marcou nenhum produto como favorito.
        </p>
        <button onClick={() => router.push('/')} className="text-orange-500 font-bold text-sm hover:underline">
            Ir para a loja
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 pb-24">
      <div className="flex items-center gap-2 mb-6">
         <button onClick={() => router.back()} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
             <ArrowLeft className="w-5 h-5 text-gray-600"/>
         </button>
         <h1 className="text-2xl font-bold text-blue-900 flex items-center gap-2">
            Meus Favoritos
         </h1>
      </div>
      
      {/* Lista de Favoritos usando o mesmo Card */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {favorites.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
        ))}
      </div>
    </div>
  );
}