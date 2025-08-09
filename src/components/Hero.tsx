"use client";

import React from "react";

const Hero: React.FC = () => {
  const navHeight = 64;

  return (
    <section
      className="relative isolate overflow-hidden text-white rounded-b-3xl px-6 py-16 sm:py-24 flex items-center justify-center"
      style={{ height: `calc(100vh - ${navHeight}px)` }}
    >
      {/* Contenido */}
      <div className="relative mx-auto max-w-5xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 backdrop-blur-md shadow-[0_0_0_1px_rgba(255,255,255,0.06)]">
          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_2px_rgba(16,185,129,0.7)]" />
          <span className="text-[11px] font-semibold tracking-[0.18em] text-white/90">
            NEW SPRING COLLECTION 2023
          </span>
        </div>

        <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
          <span className="bg-gradient-to-r from-violet-300 via-white to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_6px_24px_rgba(124,58,237,0.35)]">
            Where style speaks, trends resonate,
          </span>
          <br />
          <span className="bg-gradient-to-r from-cyan-200 via-white to-violet-300 bg-clip-text text-transparent">
            fashion flourishes
          </span>
        </h1>

        <p className="mt-5 mx-auto max-w-2xl text-sm sm:text-base text-white/70">
          Unveiling a fashion destination where trends blend seamlessly with your
          individual style aspirations. Discover today!
        </p>

        <div className="mt-8 flex items-center justify-center gap-4">
          <a
            href="#new"
            className="group inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-semibold text-black
                       bg-gradient-to-r from-white via-white to-white
                       hover:translate-y-[-1px] transition-transform shadow-xl shadow-violet-500/10"
          >
            New collection
            <span
              className="inline-block transition-transform group-hover:translate-x-0.5"
              aria-hidden
            >
              →
            </span>
          </a>

          <a
            href="#trending"
            className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-semibold
                       text-white border border-white/15 bg-white/5 backdrop-blur
                       hover:bg-white/10 hover:border-white/25 transition"
          >
            Explore trending
          </a>
        </div>

        <div className="mt-10 mx-auto w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur shadow-[0_8px_40px_-8px_rgba(59,130,246,0.25)]">
          <div className="flex items-center justify-between text-xs text-white/70">
            <span>Free shipping over $99</span>
            <span>New drops weekly</span>
            <span>Easy returns</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-xs">
        <div className="flex flex-col items-center gap-2">
          <span>Scroll</span>
          <span className="animate-bounce">⌄</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
