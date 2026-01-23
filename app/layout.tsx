import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppLayoutWrapper from "@/components/AppLayoutWrapper";
import { CartProvider } from "@/context/CartContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#1e3a8a",
};

export const metadata: Metadata = {
  title: "Supermercado Família",
  description: "O melhor para sua casa",
  manifest: "/manifest.json", 
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Supermercado Família", // NOME INTEIRO PARA IPHONE
  },
  icons: {
    icon: "/logo-app.png",
    apple: "/logo-app.png", // Ícone para iPhone
  },
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