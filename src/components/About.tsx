"use client";

import React from "react";

type Service = {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
};

const services: Service[] = [
  {
    id: 1,
    title: "Consultoría",
    description:
      "Asesoramiento experto para optimizar tus procesos y estrategias.",
    icon: (
      <svg
        className="w-8 h-8 text-yellow-500"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12h6m-3-3v6m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    id: 2,
    title: "Desarrollo Web",
    description:
      "Creación de sitios web modernos, rápidos y responsivos a medida.",
    icon: (
      <svg
        className="w-8 h-8 text-yellow-500"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 7v4a1 1 0 001 1h3m10-5h3a1 1 0 011 1v4m-6 2v6m-6 0v-6m6 0H9"
        />
      </svg>
    ),
  },
  {
    id: 3,
    title: "Soporte Técnico",
    description:
      "Atención y solución rápida a cualquier problema técnico que tengas.",
    icon: (
      <svg
        className="w-8 h-8 text-yellow-500"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 8v4l3 3m6 1a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
];

const ServicesSection: React.FC = () => {
  return (
    <section className="py-16 px-6 md:px-10 bg-transparent">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-slate-900 mb-12 tracking-tight">
          Nuestros Servicios
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(({ id, title, description, icon }) => (
            <article
              key={id}
              className="relative rounded-3xl bg-white border border-yellow-400 shadow-md hover:shadow-lg hover:shadow-yellow-200 p-6 sm:p-8 text-center transition-transform duration-300 hover:-translate-y-1"
            >
              {/* Fondo decorativo suave */}
              <div className="absolute -top-6 -left-6 h-20 w-20 rounded-full bg-yellow-200/30 blur-2xl pointer-events-none" />
              <div className="absolute -bottom-6 -right-6 h-20 w-20 rounded-full bg-yellow-200/30 blur-2xl pointer-events-none" />

              {/* Icono en círculo negro */}
              <div className="mb-4 flex items-center justify-center">
                <div className="h-14 w-14 flex items-center justify-center rounded-full bg-black border border-yellow-400 shadow-sm">
                  {icon}
                </div>
              </div>

              {/* Texto */}
              <h3 className="text-lg md:text-xl font-bold text-black mb-2">
                {title}
              </h3>
              <p className="text-sm md:text-base text-slate-600">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
