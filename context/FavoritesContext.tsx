'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Product = {
  id: number;
  name: string;
  price: number;
  department: string;
  image_url?: string;
};

type FavoritesContextType = {
  favorites: Product[];
  toggleFavorite: (product: Product) => void;
  isFavorite: (id: number) => boolean;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Product[]>([]);

  // Carrega do LocalStorage ao iniciar
  useEffect(() => {
    const saved = localStorage.getItem('favorites-storage');
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (e) {
        console.error("Erro ao ler favoritos", e);
      }
    }
  }, []);

  // Salva no LocalStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem('favorites-storage', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (product: Product) => {
    setFavorites(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) {
        return prev.filter(p => p.id !== product.id); // Remove
      } else {
        return [...prev, product]; // Adiciona
      }
    });
  };

  const isFavorite = (id: number) => {
    return favorites.some(p => p.id === id);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  // Retornamos um objeto vazio ou funções dummy se o contexto falhar, para não quebrar a app
  if (!context) {
    return {
      favorites: [],
      toggleFavorite: () => {},
      isFavorite: () => false
    };
  }
  return context;
};