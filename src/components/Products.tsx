"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

type DbProduct = {
  id: number;
  name: string;
  description: string | null;
  price_cents: number | null;
  category: string | null;
  image_url: string | null;
};

const supabase = supabaseBrowser();

const fmtPrice = (cents: number | null) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "USD" }).format(
    ((cents ?? 0) / 100) || 0
  );

const ProductsSection: React.FC = () => {
  const [items, setItems] = useState<DbProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      setErr("");
      const { data, error } = await supabase
        .from("products")
        .select("id,name,description,price_cents,category,image_url")
        .order("id", { ascending: true });

      if (error) setErr(error.message);
      setItems(data ?? []);
      setLoading(false);
    })();
  }, []);

  const products = useMemo(() => items, [items]);

  return (
    <section id="shop" className="py-10 px-4 sm:px-6 md:px-8">
      <div className="max-w-screen-xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-extrabold text-center text-slate-900 mb-8 md:mb-10 tracking-wide">
          Nuestros Perfumes Exclusivos
        </h2>

        {err && (
          <p className="text-center text-sm text-red-600 mb-6">
            {err}
          </p>
        )}

        {/* GRID CENTRADO */}
        {loading ? (
          <div className="grid [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))] gap-5 md:gap-7 justify-items-center">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="w-full max-w-[320px] rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden"
              >
                <div className="h-40 w-full bg-slate-200 animate-pulse" />
                <div className="p-4">
                  <div className="h-4 w-2/3 bg-slate-200 rounded animate-pulse" />
                  <div className="mt-2 h-3 w-full bg-slate-200 rounded animate-pulse" />
                  <div className="mt-4 h-4 w-24 bg-slate-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="text-center text-slate-600">No hay productos para mostrar.</p>
        ) : (
          <div className="grid [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))] gap-5 md:gap-7 justify-items-center">
            {products.map(({ id, name, description, price_cents, category, image_url }) => (
              <Link key={id} href={`/products/${id}`} className="group w-full max-w-[320px]">
                <article className="relative rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-transform duration-300 hover:-translate-y-[2px] cursor-pointer overflow-hidden">
                  {/* Imagen */}
                  <div className="relative">
                    <img
                      src={image_url || "https://via.placeholder.com/600x400?text=Sin+imagen"}
                      alt={name}
                      className="w-full h-40 md:h-44 object-cover"
                      loading="lazy"
                    />
                    {category && (
                      <span className="absolute top-2 left-2 text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-yellow-500 text-white shadow">
                        {category}
                      </span>
                    )}
                  </div>

                  {/* Contenido */}
                  <div className="p-4 flex flex-col text-slate-800">
                    <h3 className="text-base md:text-lg font-bold mb-1 leading-tight line-clamp-2">
                      {name}
                    </h3>
                    {description && (
                      <p className="text-xs md:text-sm text-slate-600 mb-3 line-clamp-2">
                        {description}
                      </p>
                    )}

                    <div className="mt-auto flex items-center justify-between">
                      <p className="text-sm md:text-base font-extrabold text-yellow-600">
                        {fmtPrice(price_cents)}
                      </p>
                      <span
                        className="inline-flex items-center gap-1.5 rounded-full bg-yellow-500 text-white text-xs font-semibold
                                   px-3 py-1.5 group-hover:bg-yellow-400 transition"
                      >
                        Ver más →
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductsSection;
