import Image from "next/image";
import { getProductById, products } from "@/lib/products";

type Props = { params: { id: string } };

export function generateStaticParams() {
  // si vas a usar SSG
  return products.map((p) => ({ id: String(p.id) }));
}

export default function ProductDetailPage({ params }: Props) {
  const id = Number(params.id);
  const product = getProductById(id);

  if (!product) {
    return (
      <section className="px-6 md:px-8 py-20">
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="text-2xl font-bold text-slate-900">Producto no encontrado</h1>
          <p className="mt-2 text-slate-600">El producto solicitado no existe.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="px-6 md:px-8 pt-24 md:pt-28 pb-16 md:pb-20">
      <div className="mx-auto max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* Imagen */}
        <div className="relative rounded-3xl overflow-hidden bg-white border border-gray-200 shadow-md">
          <div className="relative aspect-[4/3]">
            {/* Usá <img> si preferís */}
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Info */}
        <div className="rounded-3xl bg-white border border-gray-200 shadow-md p-6 sm:p-8 text-slate-900">
          <span className="inline-flex items-center rounded-full bg-yellow-100 text-yellow-700 px-3 py-1 text-xs font-semibold">
            {product.category}
          </span>

          <h1 className="mt-4 text-3xl md:text-4xl font-extrabold tracking-tight">
            {product.name}
          </h1>

          <p className="mt-3 text-slate-600">
            {product.description}
          </p>

          <div className="mt-6 flex items-center justify-between">
            <span className="text-2xl font-extrabold text-yellow-600">{product.price}</span>
            <button className="rounded-full bg-yellow-500 text-white font-semibold px-6 py-3 hover:bg-yellow-400 transition">
              Agregar al carrito
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
