import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppLayoutWrapper from "@/components/AppLayoutWrapper";
import { CartProvider } from "@/context/CartContext";
import { FavoritesProvider } from "@/context/FavoritesContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Supermercado Família",
  description: "O melhor para sua casa",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0", // Impede zoom indesejado em mobile
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-white h-full w-full m-0 p-0`}>
        {/* REMOVIDA A DIV COM max-w-7xl. Agora o AppLayoutWrapper é filho direto. */}
        <CartProvider>
          <FavoritesProvider>
            <AppLayoutWrapper>
              {children}
            </AppLayoutWrapper>
          </FavoritesProvider>
        </CartProvider>
      </body>
    </html>
  );
}