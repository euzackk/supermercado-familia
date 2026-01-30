import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppLayoutWrapper from "@/components/AppLayoutWrapper";
import { CartProvider } from "@/context/CartContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner"; 

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
  description: "O melhor para sua casa em Porto Velho",
  manifest: "/manifest.json", 
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Supermercado Família",
  },
  icons: {
    icon: "/logo-app.png",
    apple: "/logo-app.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 🔍 DADOS ESTRUTURADOS (SEO LOCAL)
  // Isso diz ao Google: "Sou um mercado físico em Porto Velho"
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "GroceryStore",
    "name": "Supermercado Família",
    "image": "https://seusite.com/logo-app.png", // ⚠️ IMPORTANTE: Troque pelo seu domínio real quando subir
    "telephone": "5569992557719",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Rua do Comércio, 123",
      "addressLocality": "Porto Velho",
      "addressRegion": "RO",
      "postalCode": "76800-000",
      "addressCountry": "BR"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        "opens": "07:00",
        "closes": "19:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Sunday",
        "opens": "07:00",
        "closes": "13:00"
      }
    ],
    "priceRange": "$$"
  };

  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-white h-full w-full m-0 p-0`}>
        {/* Injeção do JSON-LD para o Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <AuthProvider> 
          <CartProvider>
            <FavoritesProvider>
              <AppLayoutWrapper>
                {children}
              </AppLayoutWrapper>
              {/* Notificações (Toasts) */}
              <Toaster position="top-center" richColors />
            </FavoritesProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}