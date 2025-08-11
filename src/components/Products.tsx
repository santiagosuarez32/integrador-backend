"use client";

import React from "react";
import Link from "next/link"; // Importamos Link

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  category: string;
  imageUrl: string;
}

const products: Product[] = [
  {
    id: 1,
    name: "Aroma Floral",
    description: "Fragancia fresca con notas florales y cítricas.",
    price: "$59.99",
    category: "Floral",
    imageUrl:
      "https://images.unsplash.com/photo-1513708928675-8a9e7b9b5eab?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 2,
    name: "Esencia Amaderada",
    description: "Perfume con notas intensas de madera y especias.",
    price: "$79.99",
    category: "Amaderada",
    imageUrl:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 3,
    name: "Toque Oriental",
    description: "Fragancia cálida con toques de vainilla y ámbar.",
    price: "$69.99",
    category: "Oriental",
    imageUrl:
      "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 4,
    name: "Brisa Cítrica",
    description: "Aroma refrescante con notas cítricas y verdes.",
    price: "$49.99",
    category: "Cítrica",
    imageUrl:
      "https://images.unsplash.com/photo-1512499617640-c2f999018b72?auto=format&fit=crop&w=400&q=80",
  },
];

const ProductsSection: React.FC = () => {
  return (
    <section className="py-12 px-6 md:px-12 bg-transparent">
      <h2 className="text-3xl md:text-4xl font-extrabold text-center text-slate-900 mb-10 md:mb-12 tracking-wide">
        Nuestros Perfumes Exclusivos
      </h2>

      <div className="mx-auto max-w-7xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
        {products.map(({ id, name, description, price, category, imageUrl }) => (
          <Link key={id} href={`/products/${id}`} className="group">
            <article
              className="relative rounded-2xl bg-white border border-gray-200 shadow-md hover:shadow-lg transition-transform duration-300 hover:-translate-y-1 cursor-pointer"
            >
              {/* imagen */}
              <div className="relative">
                <img
                  src={imageUrl}
                  alt={name}
                  className="w-full h-48 object-cover rounded-t-2xl"
                  loading="lazy"
                />
                {/* badge categoría */}
                <span className="absolute top-3 left-3 text-xs font-semibold px-3 py-1 rounded-full bg-yellow-500 text-white shadow">
                  {category}
                </span>
              </div>

              {/* contenido */}
              <div className="p-5 flex flex-col text-slate-800">
                <h3 className="text-xl md:text-2xl font-bold mb-2">
                  {name}
                </h3>
                <p className="text-sm md:text-base text-slate-600 mb-4 flex-grow">
                  {description}
                </p>

                <div className="mt-auto flex items-center justify-between">
                  <p className="text-lg md:text-xl font-extrabold text-yellow-600">
                    {price}
                  </p>
                  <span
                    className="inline-flex items-center gap-2 rounded-full bg-yellow-500 text-white font-semibold
                               px-4 py-2 hover:bg-yellow-400 transition"
                  >
                    Ver más →
                  </span>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ProductsSection;
