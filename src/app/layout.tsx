// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { CartProvider } from "@/contexts/CartContext";

export const metadata: Metadata = {
  title: "CHICX Perfumes",
  description: "Perfumes exclusivos y elegantes",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      style={{
        background: `linear-gradient(to top, #f1ece1 0%, #d6cfc0 40%, #c7c0b3 100%)`,
        backgroundAttachment: "fixed",
        minHeight: "100%",
      }}
    >
      <body className="text-slate-100 bg-transparent">
        <CartProvider>
          <Nav />
          <main className="min-h-screen pt-16 md:pt-20">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
