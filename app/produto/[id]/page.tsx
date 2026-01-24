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
  LayoutGrid,
  Scale,
  Banknote
} from 'lucide-react';
import Link from 'next/link';

export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  
  const favoritesContext = useFavorites();
  const toggleFavorite = favoritesContext?.toggleFavorite;
  const isFavorite = favoritesContext?.isFavorite;

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [adding, setAdding] = useState(false);
  const [qtyUnit, setQtyUnit] = useState(1);
  const [bulkMode, setBulkMode] = useState<'weight' | 'price'>('weight');
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;
      const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
      
      if (data) {
        setProduct(data);
        // O banco agora diz se é 'unit' ou 'bulk'. Se for nulo, assume unit.
        // Não precisamos mais da função identifyProductType complexa!
      }
      setLoading(false);
    }
    fetchProduct();
  }, [id]);

  // Se o produto ainda não carregou
  if (loading) return <div className="h-screen flex items-center justify-center bg-white"><Loader2 className="animate-spin text-orange-500 w-8 h-8"/></div>;
  if (!product) return null;

  // Define o tipo baseado no banco (fallback para 'unit' se antigo)
  const productType = product.type_sale || 'unit';

  const getCalculatedQty = () => {
    if (productType === 'unit') return qtyUnit;

    const val = parseFloat(inputValue.replace(',', '.') || '0');
    if (val <= 0) return 0;

    if (bulkMode === 'weight') {
      return val / 1000; // Gramas para KG
    } else {
      return val / product.price; // Reais para KG
    }
  };

  const finalQty = getCalculatedQty();
  const finalPrice = product ? product.price * finalQty : 0;

  const handleAddToCart = () => {
    if (finalQty <= 0) {
      alert("Por favor, informe uma quantidade válida.");
      return;
    }

    setAdding(true);
    addToCart(product, finalQty);
    
    setTimeout(() => {
        setAdding(false);
        setInputValue('');
        setQtyUnit(1);
    }, 1000);
  };

  const liked = isFavorite ? isFavorite(product.id) : false;

  return (
    <div className="min-h-screen bg-white pb-40">
      
      <div className="fixed top-0 w-full p-4 flex justify-between items-center z-20 pointer-events-none">
        <button onClick={() => router.back()} className="pointer-events-auto bg-white/90 backdrop-blur shadow-sm p-2.5 rounded-full text-gray-700 border border-gray-100">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <Link href="/depts" className="pointer-events-auto bg-white/90 backdrop-blur shadow-sm px-4 py-2.5 rounded-full text-gray-700 border border-gray-100 flex items-center gap-2 text-xs font-bold uppercase tracking-wide">
          Departamentos <LayoutGrid className="w-4 h-4" />
        </Link>
      </div>

      <div className="w-full h-[40vh] bg-gray-50 flex items-center justify-center p-8 relative">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
        ) : (
          <LayoutGrid className="w-12 h-12 text-gray-300"/>
        )}
      </div>

      <div className="-mt-8 bg-white rounded-t-[2.5rem] relative z-10 px-6 py-8 min-h-[60vh] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] border-t border-gray-100">
        
        <div className="flex justify-between items-start gap-4">
          <div>
            <span className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider mb-2 ${productType === 'bulk' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
              {productType === 'bulk' ? 'Vendido por Peso' : 'Unidade / Pacote'}
            </span>
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">{product.name}</h1>
          </div>
          <button onClick={() => toggleFavorite && toggleFavorite(product)} className="flex-shrink-0 p-3 rounded-full bg-gray-50 hover:bg-red-50">
            <Heart className={`w-6 h-6 ${liked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
          </button>
        </div>
        
        <div className="mt-4 flex items-baseline gap-1">
          <span className="text-sm font-medium text-gray-400">R$</span>
          <span className="text-4xl font-extrabold text-gray-900">{product.price.toFixed(2).replace('.', ',')}</span>
          <span className="text-sm font-medium text-gray-400">/{productType === 'bulk' ? 'kg' : 'un'}</span>
        </div>

        <div className="mt-8 p-5 bg-gray-50 rounded-2xl border border-gray-100">
          
          {productType === 'unit' ? (
            // === MODO UNIDADE (Arroz 5kg) ===
            <div className="flex items-center justify-between">
              <span className="font-bold text-gray-700">Quantidade</span>
               <div className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl px-2 py-1 shadow-sm">
                  <button onClick={() => setQtyUnit(q => Math.max(1, q - 1))} className="p-3 text-gray-500 hover:bg-gray-50 rounded-lg"><Minus className="w-4 h-4"/></button>
                  <span className="font-bold w-6 text-center text-lg">{qtyUnit}</span>
                  <button onClick={() => setQtyUnit(q => q + 1)} className="p-3 text-gray-500 hover:bg-gray-50 rounded-lg"><Plus className="w-4 h-4"/></button>
               </div>
            </div>

          ) : (
            // === MODO PESO (Fraldinha KG) ===
            <div className="space-y-4">
                <div className="flex p-1 bg-gray-200 rounded-xl">
                    <button 
                        onClick={() => { setBulkMode('weight'); setInputValue(''); }}
                        className={`flex-1 py-2 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition ${bulkMode === 'weight' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}
                    >
                        <Scale className="w-4 h-4"/> Por Gramas
                    </button>
                    <button 
                        onClick={() => { setBulkMode('price'); setInputValue(''); }}
                        className={`flex-1 py-2 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition ${bulkMode === 'price' ? 'bg-white shadow text-green-700' : 'text-gray-500'}`}
                    >
                        <Banknote className="w-4 h-4"/> Por Valor (R$)
                    </button>
                </div>

                <div className="relative">
                    <input 
                        type="number" 
                        inputMode="decimal"
                        placeholder={bulkMode === 'weight' ? "Ex: 500 (para 500g)" : "Ex: 20 (para R$ 20,00)"}
                        className="w-full p-4 text-center text-xl font-bold bg-white border border-gray-200 rounded-xl outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition"
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">
                        {bulkMode === 'weight' ? 'gramas' : 'reais'}
                    </span>
                </div>

                {finalQty > 0 && (
                    <div className="text-center text-sm text-gray-600 bg-orange-50 p-2 rounded-lg border border-orange-100 animate-in fade-in">
                        Você levará aprox: <strong>{finalQty.toFixed(3).replace('.', ',')} kg</strong>
                    </div>
                )}
            </div>
          )}
        </div>

        <div className="mt-8">
          <h3 className="text-sm font-bold text-gray-900 mb-2">Detalhes</h3>
          <p className="text-gray-500 leading-relaxed text-sm">
            {product.description || "Produto selecionado com qualidade garantida Família."}
          </p>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 p-4 pb-safe z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <button 
          onClick={handleAddToCart}
          disabled={adding || finalQty <= 0}
          className={`w-full max-w-md mx-auto py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg active:scale-[0.98]
            ${adding 
                ? 'bg-green-500 text-white shadow-green-200' 
                : finalQty > 0 ? 'bg-orange-500 text-white shadow-orange-200 hover:bg-orange-600' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
          `}
        >
          {adding ? (
            <>Adicionado! <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span></>
          ) : (
            <>
              <ShoppingCart className="w-5 h-5" />
              <div className="flex flex-col items-start leading-none">
                <span className="text-xs opacity-90 font-normal">Adicionar ao carrinho</span>
                <span className="text-lg">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(finalPrice)}
                </span>
              </div>
            </>
          )}
        </button>
      </div>
    </div>
  );
}