// src/app/about/page.tsx
import Image from "next/image";

export const metadata = {
  title: "Sobre nosotros — CHICX",
  description: "Conocé la historia, misión y valores de CHICX",
};

export default function AboutPage() {
  return (
    <section className="px-6 md:px-8 pt-12 md:pt-16 pb-20">
      <div className="mx-auto max-w-6xl">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-300/60 bg-white px-5 py-2 text-xs sm:text-sm font-semibold tracking-[0.18em] text-slate-600">
            OUR STORY
          </span>
          <h1 className="mt-4 text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
            Perfumería creada con pasión, detalle y propósito
          </h1>
          <p className="mt-3 text-slate-600">
            Desde 2015 diseñamos fragancias que combinan tradición artesanal con
            innovación. Creemos en aromas que acompañan momentos y crean recuerdos.
          </p>
        </div>

        {/* Imagen + copy */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          <div className="relative rounded-3xl overflow-hidden bg-white border border-gray-200 shadow-md">
            <div className="relative aspect-[4/3]">
              <Image
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80"
                alt="Nuestro taller"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          </div>

          <div className="rounded-3xl bg-white border border-gray-200 shadow-md p-6 sm:p-8 text-slate-900">
            <h2 className="text-xl md:text-2xl font-extrabold">Nuestra misión</h2>
            <p className="mt-3 text-slate-600">
              Crear perfumes honestos y duraderos con materias primas seleccionadas
              de manera responsable. Buscamos que cada fragancia cuente una historia
              —la tuya— y que te acompañe todos los días.
            </p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { t: "Calidad", d: "Blend propio y controles estrictos." },
                { t: "Sustentabilidad", d: "Proveedores con trazabilidad." },
                { t: "Diseño", d: "Estética simple, atemporal." },
              ].map((it) => (
                <div
                  key={it.t}
                  className="rounded-2xl bg-white border border-slate-200 shadow p-4"
                >
                  <div className="font-bold text-slate-900">{it.t}</div>
                  <div className="text-sm text-slate-600 mt-1">{it.d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="mt-12 rounded-3xl bg-white border border-gray-200 shadow-md p-6 sm:p-8 text-slate-900">
          <h3 className="text-xl md:text-2xl font-extrabold">Nuestra historia</h3>
          <ul className="mt-6 space-y-5">
            {[
              { y: "2015", t: "Nacemos en Buenos Aires", d: "Primeras mezclas artesanales en un pequeño taller." },
              { y: "2018", t: "Colección Signature", d: "Presentamos 6 fragancias que se vuelven best-sellers." },
              { y: "2021", t: "Expansión regional", d: "Abrimos envíos a toda LATAM y partnership con boutiques." },
              { y: "2024", t: "Sello sustentable", d: "Migramos a packaging reciclable y tintas vegetales." },
            ].map((e) => (
              <li key={e.y} className="grid grid-cols-[80px_1fr] gap-4">
                <div className="text-amber-600 font-extrabold">{e.y}</div>
                <div>
                  <div className="font-semibold">{e.t}</div>
                  <div className="text-slate-600 text-sm">{e.d}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Equipo pequeño */}
        <div className="mt-12">
          <h3 className="text-center text-xl md:text-2xl font-extrabold text-slate-900">
            Un equipo pequeño, obsesionado con el detalle
          </h3>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                n: "Valentina Romero",
                r: "Maestra Perfumista",
                img: "https://images.unsplash.com/photo-1544006659-f0b21884ce1d?auto=format&fit=crop&w=600&q=80",
              },
              {
                n: "Luciano Pérez",
                r: "Operaciones & Calidad",
                img: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&w=600&q=80",
              },
              {
                n: "Sofía Álvarez",
                r: "Diseño & Marca",
                img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80",
              },
            ].map((p) => (
              <div
                key={p.n}
                className="rounded-2xl bg-white border border-gray-200 shadow overflow-hidden"
              >
                <div className="relative h-44">
                  <Image
                    src={p.img}
                    alt={p.n}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-4">
                  <div className="font-bold text-slate-900">{p.n}</div>
                  <div className="text-sm text-slate-600">{p.r}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-slate-600">
            ¿Te gustaría colaborar o distribuir nuestras fragancias?
          </p>
          <a
            href="/contact"
            className="mt-4 inline-flex items-center justify-center rounded-full bg-amber-400 text-neutral-900 font-semibold px-6 py-3 hover:bg-amber-300 transition"
          >
            Hablemos
          </a>
        </div>
      </div>
    </section>
  );
}
