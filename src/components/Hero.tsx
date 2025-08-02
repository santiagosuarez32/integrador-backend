"use client";

import React from "react";

const Hero: React.FC = () => {
  // Altura del nav en px (ajusta si tu nav tiene otra altura)
  const navHeight = 64;

  return (
    <section
      className="relative text-white rounded-b-lg px-6 flex flex-col items-center justify-center"
      style={{
        height: `calc(100vh - ${navHeight}px)`,
      }}
    >
      {/* Overlay semitransparente para mejorar legibilidad */}
     

      {/* Contenido centrado vertical y horizontalmente */}
      <div className="relative max-w-4xl text-center px-4 pb-50">
        <div className="inline-block bg-gray-900 bg-opacity-70 rounded-full px-5 py-2 text-xs uppercase tracking-widest mb-6 shadow-lg">
          NEW SPRING COLLECTION 2023
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-6 drop-shadow-lg">
          Where style speaks, trends resonate, <br /> fashion flourishes
        </h1>

        <p className="text-gray-300 max-w-xl mx-auto mb-10 text-sm sm:text-base">
          Unveiling a fashion destination where trends blend seamlessly with your individual style aspirations. Discover today!
        </p>

        <button className="bg-white text-black rounded-full px-8 py-3 font-semibold hover:bg-gray-200 transition shadow-md hover:shadow-lg">
          New collection &rarr;
        </button>
      </div>
    </section>
  );
};

export default Hero;
