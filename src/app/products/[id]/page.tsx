// app/products/[id]/page.tsx
import Image from "next/image";
import Link from "next/link";
import { getProductById, products } from "@/lib/products";

// Si querés tipar con el tipo de Next 15:
type PageParams = { id: string };
// Tipado opcional más estricto de Next 15:
// import type { PageProps } from "next";
// export default async function ProductDetailPage({ params }: PageProps<PageParams>) { ... }

export function generateStaticParams() {
  return products.map((p) => ({ id: String(p.id) }));
}

export default async function ProductDetailPage(
  { params }: { params: Promise<PageParams> }
) {
  const { id } = await params;              // 👈 await params
  const numId = Number(id);

  const product = getProductById(numId);

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

  // Productos similares aleatorios (excluye el actual)
  const related = products
    .filter((p) => p.id !== numId)
    .sort(() => Math.random() - 0.5)
    .slice(0, 4);

  return (
    <>
      {/* Detalle producto */}
      <section className="px-6 md:px-8 pt-24 md:pt-28 pb-16 md:pb-20">
        <div className="mx-auto max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Imagen */}
          <div className="relative rounded-3xl overflow-hidden bg-white border border-gray-200 shadow-md">
            <div className="relative aspect-[4/3]">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                priority
                // 👇 requerido cuando usás `fill`
                sizes="(max-width: 768px) 100vw,
                       (max-width: 1200px) 50vw,
                       600px"
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

            <p className="mt-3 text-slate-600">{product.description}</p>

            <div className="mt-6 flex items-center justify-between">
              <span className="text-2xl font-extrabold text-yellow-600">{product.price}</span>
              <button className="rounded-full bg-yellow-500 text-white font-semibold px-6 py-3 hover:bg-yellow-400 transition">
                Agregar al carrito
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Productos similares */}
      <section className="px-6 md:px-8 pb-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 text-center">
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900">
              También te puede gustar
            </h2>
            <span className="text-sm text-slate-500">
              Selección aleatoria para ti
            </span>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {related.map((r) => (
              <Link key={r.id} href={`/products/${r.id}`} className="group w-full sm:w-64">
                <article className="rounded-2xl bg-white border border-gray-200 shadow-md hover:shadow-lg transition-transform duration-300 hover:-translate-y-1 overflow-hidden">
                  <div className="relative">
                    <Image
                      src={r.imageUrl}
                      alt={r.name}
                      width={600}
                      height={400}
                      className="h-44 w-full object-cover"
                    />
                    <span className="absolute top-3 left-3 text-[11px] font-semibold px-3 py-1 rounded-full bg-yellow-500 text-white shadow">
                      {r.category}
                    </span>
                  </div>

                  <div className="p-4 text-slate-900">
                    <h3 className="font-bold leading-tight">{r.name}</h3>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-yellow-600 font-extrabold">{r.price}</span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500 text-white text-xs font-semibold px-3 py-1 group-hover:bg-yellow-400 transition">
                        Ver más →
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
