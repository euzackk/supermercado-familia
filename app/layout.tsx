import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppLayoutWrapper from "@/components/AppLayoutWrapper";
import { CartProvider } from "@/context/CartContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { AuthProvider } from "@/context/AuthContext"; // Importante!

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Supermercado Família",
  description: "O melhor para sua casa",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-white h-full w-full m-0 p-0`}>
        <AuthProvider> 
          <CartProvider>
            <FavoritesProvider>
              <AppLayoutWrapper>
                {children}
              </AppLayoutWrapper>
            </FavoritesProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}