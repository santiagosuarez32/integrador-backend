// src/app/products/[id]/AddToCartButton.tsx
"use client";

import React from "react";
import { useCart } from "@/contexts/CartContext";

type Props = {
  id: number;
  name: string;
  /** Precio numérico en USD (por ej. 79.99) */
  priceNumber?: number;
  /** Texto del precio para mostrar (por ej. "US$ 79,99") */
  priceDisplay?: string;
  imageUrl?: string | null;
  category?: string | null;
};

function parsePriceDisplay(s?: string) {
  if (!s) return null;
  // quita currency y deja solo número; soporta "US$ 79,99" o "79.99"
  const cleaned = s.replace(/[^\d.,-]/g, "");
  // si tiene coma y punto, asumimos formato "1.234,56"
  if (cleaned.includes(",") && cleaned.includes(".")) {
    const normalized = cleaned.replace(/\./g, "").replace(",", ".");
    const n = Number(normalized);
    return Number.isFinite(n) ? n : null;
  }
  // si solo tiene coma, asumimos decimal con coma
  if (cleaned.includes(",") && !cleaned.includes(".")) {
    const n = Number(cleaned.replace(",", "."));
    return Number.isFinite(n) ? n : null;
  }
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

function usd(n: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(n);
}

export default function AddToCartButton({
  id,
  name,
  priceNumber,
  priceDisplay,
  imageUrl,
  category,
}: Props) {
  const { add, setOpen } = useCart();
  const [loading, setLoading] = React.useState(false);

  const onAdd = async () => {
    setLoading(true);

    // 1) precio seguro
    let price = Number(priceNumber);
    if (!Number.isFinite(price) || price <= 0) {
      const parsed = parsePriceDisplay(priceDisplay);
      if (parsed && parsed > 0) price = parsed;
    }

    if (!Number.isFinite(price) || price <= 0) {
      console.warn("price inválido");
      setLoading(false);
      return;
    }

    // 2) display seguro
    const display = priceDisplay && priceDisplay.trim().length > 0 ? priceDisplay : usd(price);

    // 3) imagen segura
    const img =
      imageUrl && imageUrl.length > 0
        ? imageUrl
        : "https://via.placeholder.com/300x200?text=Producto";

    const res = add(
      {
        id: Number(id),
        name,
        price,             // número válido
        priceDisplay: display,
        imageUrl: img,
        category: category || undefined,
      },
      1
    );

    if (!res.ok) console.warn(res.error);

    // abrir el drawer del carrito
    setOpen(true);
    setLoading(false);
  };

  return (
    <button
      onClick={onAdd}
      disabled={loading}
      className="rounded-full bg-yellow-500 text-white font-semibold px-6 py-3 hover:bg-yellow-400 transition disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {loading ? "Agregando..." : "Agregar al carrito"}
    </button>
  );
}
