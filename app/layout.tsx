import type { Metadata, Viewport } from "next"; // Adicione Viewport
import { Inter } from "next/font/google";
import "./globals.css";
import AppLayoutWrapper from "@/components/AppLayoutWrapper";
import { CartProvider } from "@/context/CartContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

// Configuração de Visual (Viewport) separada no Next.js 16
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Impede zoom pinça, sensação de app nativo
  themeColor: "#1e3a8a", // Pinta a barra de status do Android de azul
};

export const metadata: Metadata = {
  title: "Supermercado Família",
  description: "O melhor para sua casa",
  manifest: "/manifest.json", // Link automático pro arquivo que criamos
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Sup. Família",
  },
  icons: {
    icon: "/logo.png", // Ícone da aba
    apple: "/logo.png", // Ícone da tela inicial do iPhone
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