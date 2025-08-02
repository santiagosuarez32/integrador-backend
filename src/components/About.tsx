"use client";

import React from "react";

interface Service {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const services: Service[] = [
  {
    id: 1,
    title: "Consultoría",
    description:
      "Asesoramiento experto para optimizar tus procesos y estrategias.",
    icon: (
      <svg
        className="w-12 h-12 text-blue-400"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
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
        className="w-12 h-12 text-blue-400"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
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
        className="w-12 h-12 text-blue-400"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
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
    <section className="py-12 px-6 md:px-12">
      <h2 className="text-3xl font-bold text-center text-white mb-10">
        Nuestros Servicios
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {services.map(({ id, title, description, icon }) => (
          <article
            key={id}
            className="flex flex-col items-center text-center p-6 rounded-lg shadow-md bg-transparent"
          >
            <div className="mb-4">{icon}</div>
            <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
            <p className="text-gray-300">{description}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default ServicesSection;
