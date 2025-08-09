"use client";

import React, { useEffect, useState, useCallback } from "react";

const Nav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = useCallback(() => setIsOpen(v => !v), []);
  const closeMenu = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeMenu();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeMenu]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 md:px-8 py-4 flex items-center justify-between text-white">
      {/* Logo */}
      <a href="#" className="flex items-center gap-3 font-bold text-xl">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 7l6 6-6 6" />
        </svg>
        <span>CHICX</span>
      </a>

      {/* Desktop menu */}
      <ul className="hidden md:flex items-center gap-8 text-sm">
        {["Home","Shop","Sale","Blog","Showcase"].map(item=>(
          <li key={item}><a className="hover:text-violet-300 transition-colors" href="#">{item}</a></li>
        ))}
      </ul>

      <div className="hidden md:flex items-center gap-4">
        <button className="hover:text-violet-300 transition-colors">Login</button>
        <button className="bg-white text-black rounded-full px-4 py-1 font-semibold hover:bg-gray-200 transition">Sign up</button>
      </div>

      {/* Botón hamburguesa (mobile) */}
      <button
        onClick={toggleMenu}
        aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={isOpen}
        aria-controls="mobile-drawer"
        className={`md:hidden relative z-[60] flex flex-col justify-center items-center gap-1.5 w-9 h-9
                    transition ${isOpen ? "opacity-0 pointer-events-none" : "opacity-100"}`}
      >
        <span className={`h-0.5 w-6 bg-white rounded transition-transform duration-300 ${isOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
        <span className={`h-0.5 w-6 bg-white rounded transition-opacity duration-200 ${isOpen ? "opacity-0" : "opacity-100"}`} />
        <span className={`h-0.5 w-6 bg-white rounded transition-transform duration-300 ${isOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
      </button>

      {/* Overlay */}
      <div
        onClick={closeMenu}
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden
                    ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        aria-hidden={!isOpen}
      />

      {/* Drawer izquierdo */}
      <aside
        id="mobile-drawer"
        className={`fixed top-0 left-0 z-[70] h-screen w-[84%] max-w-[340px] md:hidden
                    bg-white/7 border-r border-white/10 backdrop-blur-xl
                    transition-transform duration-300 ease-out
                    ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
        role="dialog" aria-modal="true"
      >
        <div className="h-1 w-full bg-gradient-to-r from-violet-400 via-white to-cyan-300 opacity-80" />

        {/* Header drawer */}
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3 font-bold">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 7l6 6-6 6" />
            </svg>
            <span>CHICX</span>
          </div>
          {/* X grande y accesible */}
          <button
            onClick={closeMenu}
            aria-label="Cerrar menú"
            className="grid place-items-center w-11 h-11 rounded-full hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Links */}
        <nav className="px-5 pt-2">
          <ul className="flex flex-col gap-2 text-base">
            {["Home","Shop","Sale","Blog","Showcase"].map((label, i) => (
              <li
                key={label}
                style={{ transitionDelay: `${100 + i * 60}ms` }}
                className={`transform transition-all duration-300 ${isOpen ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"}`}
              >
                <a href="#" onClick={closeMenu} className="block rounded-xl px-4 py-3 hover:bg-white/10 active:bg-white/15 transition">
                  {label}
                </a>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div
            style={{ transitionDelay: `${100 + 5 * 60}ms` }}
            className={`mt-6 transform transition-all duration-300 ${isOpen ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"}`}
          >
            <button onClick={closeMenu} className="w-full rounded-full bg-white text-black font-semibold px-4 py-2 hover:bg-gray-200 transition">
              Sign up
            </button>
            <button onClick={closeMenu} className="mt-3 w-full rounded-full px-4 py-2 text-white/80 hover:bg-white/10 transition">
              Login
            </button>
          </div>
        </nav>

        {/* Footer mini info */}
        <div className="absolute bottom-4 left-0 right-0 px-5 text-[11px] text-white/60">
          <div className="flex items-center justify-between border-t border-white/10 pt-3">
            <span>New drops weekly</span>
            <span>Easy returns</span>
          </div>
        </div>
      </aside>
    </nav>
  );
};

export default Nav;
