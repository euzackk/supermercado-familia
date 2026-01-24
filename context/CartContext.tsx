'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Definição do Produto (Incluindo type_sale para saber se é KG ou UN)
export type Product = {
  id: number;
  name: string;
  price: number;
  image_url?: string;
  department?: string;
  description?: string;
  type_sale?: 'unit' | 'bulk' | string; // Campo crucial para a lógica
};

export type CartItem = Product & {
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
};

const CartContext = createContext<CartContextType>({} as CartContextType);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // 1. Carregar carrinho salvo no LocalStorage ao abrir o site
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedCart = localStorage.getItem('familia_cart');
      if (storedCart) {
        try {
          setItems(JSON.parse(storedCart));
        } catch (error) {
          console.error("Erro ao carregar o carrinho:", error);
          localStorage.removeItem('familia_cart');
        }
      }
    }
  }, []);

  // 2. Salvar no LocalStorage sempre que o carrinho mudar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('familia_cart', JSON.stringify(items));
    }
  }, [items]);

  // Adicionar ao carrinho (soma quantidade se já existir)
  const addToCart = (product: Product, quantity = 1) => {
    setItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);

      if (existingItem) {
        // Se já existe, atualiza a quantidade (funciona para inteiros e decimais)
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      }

      // Se é novo, adiciona na lista
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId: number) => {
    setItems(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems(prev => prev.map(item => item.id === productId ? { ...item, quantity } : item));
  };

  const clearCart = () => setItems([]);

  // Contagem de itens (número de produtos distintos)
  const cartCount = items.length;

  // Total em Reais
  const cartTotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);