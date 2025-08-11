// lib/products.ts
export type Product = {
  id: number;
  name: string;
  description: string;
  price: string;
  category: string;
  imageUrl: string;
};

export const products: Product[] = [
  {
    id: 1,
    name: "Aroma Floral",
    description: "Fragancia fresca con notas florales y cítricas.",
    price: "$59.99",
    category: "Floral",
    imageUrl:
      "https://images.unsplash.com/photo-1513708928675-8a9e7b9b5eab?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    name: "Esencia Amaderada",
    description: "Perfume con notas intensas de madera y especias.",
    price: "$79.99",
    category: "Amaderada",
    imageUrl:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    name: "Toque Oriental",
    description: "Fragancia cálida con toques de vainilla y ámbar.",
    price: "$69.99",
    category: "Oriental",
    imageUrl:
      "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    name: "Brisa Cítrica",
    description: "Aroma refrescante con notas cítricas y verdes.",
    price: "$49.99",
    category: "Cítrica",
    imageUrl:
      "https://images.unsplash.com/photo-1512499617640-c2f999018b72?auto=format&fit=crop&w=800&q=80",
  },
];

export const getProductById = (id: number) =>
  products.find((p) => p.id === id);
