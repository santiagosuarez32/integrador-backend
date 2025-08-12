// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

// Importamos Nav y Footer
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "CHICX Perfumes",
  description: "Perfumes exclusivos y elegantes",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      style={{
        // De abajo (oscuro) a arriba (claro), suave y elegante
        background: `
          linear-gradient(to top, #f1ece1 0%, #d6cfc0 40%, #c7c0b3 100%)
        `,
        backgroundAttachment: "fixed",
        minHeight: "100%",
      }}
    >
      <body className="text-slate-100 bg-transparent">
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
