// app/products/[id]/AddToCartButton.tsx
"use client";

import React from "react";
import { useCart } from "@/contexts/CartContext";

type Props = {
  id: number;
  name: string;
  priceDisplay: string;
  priceNumber: number;
  imageUrl: string;
  category?: string;
};

export default function AddToCartButton(props: Props) {
  const { add } = useCart();
  const [loading, setLoading] = React.useState(false);

  const onAdd = async () => {
    setLoading(true);
    const res = add(
      {
        id: props.id,
        name: props.name,
        price: props.priceNumber,
        priceDisplay: props.priceDisplay,
        imageUrl: props.imageUrl,
        category: props.category,
      },
      1
    );
    // Podés integrar un toast acá si querés
    if (!res.ok) {
      // alert(res.error);
      console.warn(res.error);
    }
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
