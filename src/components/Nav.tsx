"use client";

import React, { useEffect, useState, useCallback } from "react";

const Nav: React.FC = () => {
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen(v => !v), []);
  const close  = useCallback(() => setOpen(false), []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const links = ["Home", "Shop", "Sale", "Blog", "Showcase"];

  return (
    <nav className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto max-w-[1120px] mt-3 md:mt-4 px-4 md:px-6">
        {/* WRAPPER único: borde y redondeo en un SOLO contenedor */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-950/80 backdrop-blur-md shadow-sm text-slate-100 overflow-hidden">
          {/* HEADER */}
          <div className="h-14 px-5 md:px-8 flex items-center justify-between">
            <a href="#" className="flex items-center gap-2 font-extrabold tracking-tight">
              <svg className="w-5 h-5 text-amber-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7l6 6-6 6" />
              </svg>
              <span>CHICX</span>
            </a>

            {/* Desktop */}
            <ul className="hidden md:flex items-center gap-6 text-sm font-medium">
              {links.map(l => (
                <li key={l}>
                  <a href="#" className="text-slate-300 hover:text-white transition-colors">{l}</a>
                </li>
              ))}
            </ul>
            <div className="hidden md:flex items-center gap-3">
              <button className="text-slate-300 hover:text-white transition-colors">Login</button>
              <button className="rounded-full bg-amber-400 text-neutral-900 px-4 py-2 text-sm font-semibold hover:bg-amber-300 transition">
                Sign up
              </button>
            </div>

            {/* Burger */}
            <button
              onClick={toggle}
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={open}
              aria-controls="mobile-dropdown"
              className="md:hidden grid place-items-center w-10 h-10 rounded-full hover:bg-white/5"
            >
              <span className="sr-only">Toggle menu</span>
              <div className="space-y-1.5">
                <span className="block h-0.5 w-6 bg-white" />
                <span className="block h-0.5 w-6 bg-white" />
                <span className="block h-0.5 w-6 bg-white" />
              </div>
            </button>
          </div>

          {/* DROPDOWN móvil: animación SUAVE con grid-rows */}
          <div
            id="mobile-dropdown"
            className={`md:hidden grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
              ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
            role="dialog" aria-modal="true"
          >
            {/* Contenido colapsable (recorta con overflow-hidden) */}
            <div className="overflow-hidden">
              {/* sutil divisor superior */}
              <div className="h-px w-full bg-gradient-to-r from-transparent via-neutral-800 to-transparent" />
              <nav className="px-5 py-4">
                <ul className="flex flex-col gap-1">
                  {links.map(l => (
                    <li key={l}>
                      <a
                        href="#"
                        onClick={close}
                        className="block rounded-xl px-4 py-3 text-base hover:bg-white/5 active:bg-white/10 transition"
                      >
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>

                <div className="mt-3 space-y-2">
                  <button
                    onClick={close}
                    className="w-full rounded-full bg-amber-400 text-neutral-900 font-semibold px-4 py-2 hover:bg-amber-300 transition"
                  >
                    Sign up
                  </button>
                  <button
                    onClick={close}
                    className="w-full rounded-full border border-neutral-800 px-4 py-2 text-slate-200 hover:bg-white/5 transition"
                  >
                    Login
                  </button>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div aria-hidden className="h-16" />
    </nav>
  );
};

export default Nav;
