// src/app/products/page.tsx
import Link from "next/link";
import Image from "next/image";
import { fetchProducts } from "@/lib/products";

export const revalidate = 60;
export const metadata = { title: "Productos" };

export default async function ProductsPage() {
  const products = await fetchProducts();

  return (
    <section className="py-12 px-6 md:px-12 bg-transparent">
      <h2 className="text-3xl md:text-4xl font-extrabold text-center text-slate-900 mb-10 md:mb-12 tracking-wide">
        Nuestros Perfumes Exclusivos
      </h2>

      <div className="mx-auto max-w-7xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
        {products.map(({ id, name, description, price, category, imageUrl }) => {
          const imgSrc: string = imageUrl ?? "/placeholder.png"; // 👈 fallback
          return (
            <Link key={id} href={`/products/${id}`} className="group">
              <article className="relative rounded-2xl bg-white border border-gray-200 shadow-md hover:shadow-lg transition-transform duration-300 hover:-translate-y-1 cursor-pointer">
                <div className="relative">
                  <Image
                    src={imgSrc}
                    alt={name}
                    width={600}
                    height={400}
                    className="w-full h-48 object-cover rounded-t-2xl"
                    sizes="(max-width: 768px) 100vw,
                           (max-width: 1200px) 50vw,
                           25vw"
                  />
                  {category && (
                    <span className="absolute top-3 left-3 text-xs font-semibold px-3 py-1 rounded-full bg-yellow-500 text-white shadow">
                      {category}
                    </span>
                  )}
                </div>

                <div className="p-5 flex flex-col text-slate-800">
                  <h3 className="text-xl md:text-2xl font-bold mb-2">{name}</h3>
                  {description && (
                    <p className="text-sm md:text-base text-slate-600 mb-4 flex-grow">
                      {description}
                    </p>
                  )}

                  <div className="mt-auto flex items-center justify-between">
                    <p className="text-lg md:text-xl font-extrabold text-yellow-600">
                      {price}
                    </p>
                    <span className="inline-flex items-center gap-2 rounded-full bg-yellow-500 text-white font-semibold px-4 py-2 group-hover:bg-yellow-400 transition">
                      Ver más →
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
