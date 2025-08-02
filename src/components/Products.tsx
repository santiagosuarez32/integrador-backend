"use client";

import React from "react";

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
    <section className="py-12 px-6 md:px-12">
      <h2 className="text-4xl font-extrabold text-center text-white mb-12 tracking-wide">
        Nuestros Perfumes Exclusivos
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {products.map(({ id, name, description, price, category, imageUrl }) => (
          <article
            key={id}
            className="relative rounded-xl overflow-hidden flex flex-col cursor-pointer"
            style={{
              background:
                "linear-gradient(135deg, rgba(75,85,99,0.85) 0%, rgba(31,41,55,0.85) 100%)",
              boxShadow:
                "0 10px 25px rgba(31,41,55,0.6), 0 4px 6px rgba(75,85,99,0.4)",
              border: "1.5px solid rgba(255, 255, 255, 0.15)",
              transition: "box-shadow 0.3s ease, transform 0.3s ease",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              el.style.boxShadow =
                "0 18px 40px rgba(31,41,55,0.85), 0 8px 15px rgba(75,85,99,0.65)";
              el.style.transform = "translateY(-6px)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              el.style.boxShadow =
                "0 10px 25px rgba(31,41,55,0.6), 0 4px 6px rgba(75,85,99,0.4)";
              el.style.transform = "translateY(0)";
            }}
          >
            <div className="relative">
              <img
                src={imageUrl}
                alt={name}
                className="w-full h-48 object-cover"
                loading="lazy"
              />
              <span
                className="absolute top-3 left-3 text-sm font-semibold px-3 py-1 rounded-full"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                  color: "#f9fafb",
                  backdropFilter: "blur(6px)",
                  boxShadow: "0 0 8px rgba(255,255,255,0.2)",
                }}
              >
                {category}
              </span>
            </div>

            <div className="p-5 flex flex-col flex-grow text-gray-100">
              <h3 className="text-2xl font-bold mb-2 drop-shadow-md">{name}</h3>
              <p className="flex-grow text-gray-300 mb-4">{description}</p>
              <div className="mt-auto flex items-center justify-between">
                <p className="text-xl font-extrabold drop-shadow-md text-cyan-400">
                  {price}
                </p>
                <button
                  className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold px-5 py-2 rounded-full shadow-md transition-colors"
                  aria-label={`Comprar ${name}`}
                >
                  Comprar
                </button>
              </div>
            </div>

            {/* Decoraciones geométricas borrosas */}
            <div
              style={{
                position: "absolute",
                top: -40,
                right: -40,
                width: 120,
                height: 120,
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderRadius: "50%",
                filter: "blur(40px)",
                zIndex: 0,
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: -30,
                left: -30,
                width: 100,
                height: 100,
                backgroundColor: "rgba(255, 255, 255, 0.07)",
                borderRadius: "50%",
                filter: "blur(25px)",
                zIndex: 0,
              }}
            />
          </article>
        ))}
      </div>
    </section>
  );
};

export default ProductsSection;
