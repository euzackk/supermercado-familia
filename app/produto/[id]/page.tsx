'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/context/FavoritesContext';
import { 
  ArrowLeft, 
  ShoppingCart, 
  Loader2, 
  Minus, 
  Plus, 
  Heart, 
  LayoutGrid 
} from 'lucide-react';
import Link from 'next/link';

export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  
  // Tenta pegar o contexto de favoritos, mas previne erro se não existir
  const favoritesContext = useFavorites();
  const toggleFavorite = favoritesContext?.toggleFavorite;
  const isFavorite = favoritesContext?.isFavorite;

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) console.error('Erro ao buscar:', error);
      setProduct(data);
      setLoading(false);
    }
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    setAdding(true);
    // Adiciona o item X vezes baseado na quantidade escolhida
    for (let i = 0; i < qty; i++) {
      addToCart(product);
    }
    
    // Pequeno feedback visual
    setTimeout(() => setAdding(false), 500);
  };

  const handleBack = () => {
    // Tenta voltar, se não der (ex: abriu direto no link), vai para home
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-white">
      <Loader2 className="animate-spin text-orange-500 w-8 h-8"/>
    </div>
  );

  if (!product) return (
    <div className="h-screen flex flex-col items-center justify-center bg-white p-4 text-center">
      <p className="text-gray-500 mb-4">Produto não encontrado.</p>
      <button onClick={() => router.push('/')} className="text-orange-500 font-bold hover:underline">
        Voltar para o início
      </button>
    </div>
  );

  const liked = isFavorite ? isFavorite(product.id) : false;

  return (
    <div className="min-h-screen bg-white pb-32">
      
      {/* --- HEADER DE NAVEGAÇÃO --- */}
      <div className="fixed top-0 w-full p-4 flex justify-between items-center z-20 pointer-events-none">
        
        {/* Botão Voltar */}
        <button 
          onClick={handleBack} 
          className="pointer-events-auto bg-white/90 backdrop-blur shadow-sm p-2.5 rounded-full text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition active:scale-95 border border-gray-100"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        {/* Botão Ver Departamentos (Direita) */}
        <Link 
          href="/depts"
          className="pointer-events-auto bg-white/90 backdrop-blur shadow-sm px-4 py-2.5 rounded-full text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition active:scale-95 border border-gray-100 flex items-center gap-2 text-xs font-bold uppercase tracking-wide"
        >
          Departamentos <LayoutGrid className="w-4 h-4" />
        </Link>
      </div>

      {/* --- IMAGEM DO PRODUTO --- */}
      <div className="w-full h-[45vh] bg-gray-50 flex items-center justify-center p-8 relative">
        {product.image_url ? (
          <img 
            src={product.image_url} 
            alt={product.name} 
            className="w-full h-full object-contain mix-blend-multiply drop-shadow-xl" 
          />
        ) : (
          <div className="text-gray-300 flex flex-col items-center">
            <LayoutGrid className="w-12 h-12 mb-2"/>
            Sem imagem
          </div>
        )}
      </div>

      {/* --- DETALHES (CARD QUE SOBE) --- */}
      <div className="-mt-8 bg-white rounded-t-[2.5rem] relative z-10 px-6 py-8 min-h-[50vh] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] border-t border-gray-100">
        
        {/* Barra decorativa */}
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-8" />
        
        <div className="flex justify-between items-start gap-4">
          <div>
            <span className="inline-block px-2.5 py-1 rounded-lg bg-orange-100 text-orange-600 text-[10px] font-bold uppercase tracking-wider mb-2">
              {product.department || 'Geral'}
            </span>
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">
              {product.name}
            </h1>
          </div>

          {/* Botão Favoritar Grande */}
          <button 
            onClick={() => toggleFavorite && toggleFavorite(product)}
            className="flex-shrink-0 p-3 rounded-full bg-gray-50 hover:bg-red-50 transition active:scale-90"
          >
            <Heart 
              className={`w-6 h-6 transition-colors ${liked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} 
            />
          </button>
        </div>
        
        {/* Preço */}
        <div className="mt-6 flex items-baseline gap-1">
          <span className="text-sm font-medium text-gray-400">R$</span>
          <span className="text-4xl font-extrabold text-gray-900 tracking-tight">
            {product.price.toFixed(2).replace('.', ',')}
          </span>
          <span className="text-sm font-medium text-gray-400">/unidade</span>
        </div>

        {/* Descrição */}
        <div className="mt-8">
          <h3 className="text-sm font-bold text-gray-900 mb-2">Sobre o produto</h3>
          <p className="text-gray-500 leading-relaxed text-sm">
            {product.description || "Este é um produto de excelente qualidade selecionado especialmente para você. Aproveite as melhores ofertas do nosso supermercado com entrega rápida e segura."}
          </p>
        </div>
      </div>

      {/* --- BARRA FIXA DE COMPRA (BOTTOM) --- */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 p-4 pb-safe z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="flex gap-4 max-w-md mx-auto">
          
          {/* Seletor de Quantidade */}
          <div className="flex items-center gap-3 bg-gray-100 rounded-2xl px-4 py-2">
            <button 
              onClick={() => setQty(q => Math.max(1, q - 1))} 
              className="p-2 text-gray-500 hover:text-black hover:bg-white rounded-xl transition disabled:opacity-50"
              disabled={qty <= 1}
            >
              <Minus className="w-5 h-5"/>
            </button>
            <span className="font-bold text-lg w-6 text-center text-gray-900">{qty}</span>
            <button 
              onClick={() => setQty(q => q + 1)} 
              className="p-2 text-gray-500 hover:text-black hover:bg-white rounded-xl transition"
            >
              <Plus className="w-5 h-5"/>
            </button>
          </div>
          
          {/* Botão Adicionar */}
          <button 
            onClick={handleAddToCart}
            disabled={adding}
            className={`flex-1 font-bold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-200 active:scale-[0.98] py-4
              ${adding ? 'bg-green-500 text-white' : 'bg-orange-500 text-white hover:bg-orange-600'}
            `}
          >
            {adding ? (
              <>Adicionado! <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span></>
            ) : (
              <>
                <ShoppingCart className="w-5 h-5" />
                <span className="text-sm">
                  Adicionar {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price * qty)}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}