import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppLayoutWrapper from "@/components/AppLayoutWrapper";
import { CartProvider } from "@/context/CartContext";
import { FavoritesProvider } from "@/context/FavoritesContext"; // Importe aqui

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Supermercado Família",
  description: "O melhor para sua casa",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        <div className="mx-auto max-w-7xl bg-white min-h-screen shadow-sm relative">
          <CartProvider>
            <FavoritesProvider> {/* Adicione o Provider aqui */}
              <AppLayoutWrapper>
                {children}
              </AppLayoutWrapper>
            </FavoritesProvider>
          </CartProvider>
        </div>
      </body>
    </html>
  );
}