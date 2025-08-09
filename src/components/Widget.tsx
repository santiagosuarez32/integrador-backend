"use client";

import React from "react";

/** Card / Widget */
interface WidgetProps {
  title: string;
  content: string;
}

const Widget: React.FC<WidgetProps> = ({ title, content }) => {
  return (
    <div
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5
                 backdrop-blur-md p-6 md:p-8 text-white shadow-lg transition
                 hover:shadow-[0_20px_60px_-10px_rgba(124,58,237,0.35)]
                 hover:-translate-y-0.5"
      role="article"
      aria-label={title}
    >
      {/* borde/acento degradado */}
      <span
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          background:
            "linear-gradient(135deg, rgba(139,92,246,0.35), rgba(56,189,248,0.35))",
          mask: "linear-gradient(#000,#000) content-box, linear-gradient(#000,#000)",
          WebkitMask:
            "linear-gradient(#000,#000) content-box, linear-gradient(#000,#000)",
          // “truco” para simular border gradient fino:
          padding: "1px",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
        aria-hidden="true"
      />

      {/* Glow decorativo */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-violet-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-cyan-400/20 blur-3xl" />

      {/* Icono */}
      <div className="mb-4 md:mb-5 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </div>

      {/* Título */}
      <h3 className="text-lg md:text-xl font-bold tracking-tight">
        {title}
      </h3>

      {/* Texto */}
      <p className="mt-2 md:mt-3 text-sm md:text-base text-white/80">
        {content}
      </p>

      {/* CTA */}
      <div className="mt-5 md:mt-6">
        <button
          className="inline-flex items-center gap-2 rounded-full bg-white text-black
                     px-4 py-2 md:px-5 md:py-2.5 text-sm font-semibold
                     hover:bg-gray-200 transition"
          type="button"
        >
          Leer más
          <span className="transition-transform group-hover:translate-x-0.5">→</span>
        </button>
      </div>

      {/* Shine sutil al hover */}
      <span
        className="pointer-events-none absolute -inset-x-10 -top-1/2 h-1/2 opacity-0
                   bg-gradient-to-r from-transparent via-white/30 to-transparent
                   rotate-12 transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden="true"
      />
    </div>
  );
};

/** Container */
const WidgetsContainer: React.FC = () => {
  const widgetsInfo = [
    { title: "Envío Gratis", content: "Disfruta de envío gratis en pedidos mayores a $50." },
    { title: "Soporte 24/7", content: "Nuestro equipo está disponible para ayudarte en cualquier momento." },
    { title: "Devoluciones fáciles", content: "Si no estás satisfecho, te devolvemos tu dinero." },
  ];

  return (
    <section
      aria-labelledby="benefits-title"
      className="w-full px-6 md:px-8 py-10 md:py-14"
    >
      <h2 id="benefits-title" className="sr-only">Beneficios</h2>

      <div className="mx-auto max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {widgetsInfo.map(({ title, content }) => (
          <Widget key={title} title={title} content={content} />
        ))}
      </div>
    </section>
  );
};

export default WidgetsContainer;
