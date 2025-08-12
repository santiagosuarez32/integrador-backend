// src/components/Nav.tsx
"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import CartDrawer from "@/components/CartDrawer";
import { useCart } from "@/contexts/CartContext";

const Nav: React.FC = () => {
  // Menú móvil
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen((v) => !v), []);
  const close = useCallback(() => setOpen(false), []);

  // Drawer carrito
  const [cartOpen, setCartOpen] = useState(false);
  const openCart = useCallback(() => setCartOpen(true), []);
  const closeCart = useCallback(() => setCartOpen(false), []);

  // Contador de items
  const { count } = useCart();

  // Bloquear scroll del body si hay algo abierto (menú o carrito)
  useEffect(() => {
    const anyOpen = open || cartOpen;
    document.body.style.overflow = anyOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, cartOpen]);

  // Cerrar menú móvil si hay scroll/gesto (evita superposición)
  useEffect(() => {
    if (!open) return;

    const mm = window.matchMedia("(max-width: 767px)");
    if (!mm.matches) return; // solo móvil

    let lastScrollY = window.scrollY;
    let touchStartY = 0;

    const onScroll = () => {
      if (window.scrollY > lastScrollY + 6) close();
      lastScrollY = window.scrollY;
    };

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY > 8) close();
    };

    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0]?.clientY ?? 0;
    };

    const onTouchMove = (e: TouchEvent) => {
      const dy = (e.touches[0]?.clientY ?? 0) - touchStartY;
      if (Math.abs(dy) > 14) close();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [open, close]);

// src/components/Nav.tsx
const links = [
  { name: "Home", href: "/" },
  { name: "Productos", href: "/products" },
  { name: "Contacto", href: "/contact" }, 
  { name: "About", href: "/about" }, 

];


  return (
    <nav className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto max-w-[1120px] mt-3 md:mt-4 px-4 md:px-6">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-950/80 backdrop-blur-md shadow-sm text-slate-100 overflow-hidden">
          {/* HEADER */}
          <div className="h-14 px-5 md:px-8 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 font-extrabold tracking-tight">
              <svg
                className="w-5 h-5 text-amber-300"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7l6 6-6 6" />
              </svg>
              <span>CHICX</span>
            </Link>

            {/* Links desktop */}
            <ul className="hidden md:flex items-center gap-6 text-sm font-medium">
              {links.map((l) => (
                <li key={l.name}>
                  <Link href={l.href} className="text-slate-300 hover:text-white transition-colors">
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Acciones derecha (desktop) */}
            <div className="hidden md:flex items-center gap-3">
              {/* Cart con lucide + badge */}
              <button
                onClick={openCart}
                className="relative w-10 h-10 grid place-items-center rounded-full hover:bg-white/5"
                aria-label="Abrir carrito"
              >
                <ShoppingCart className="w-5 h-5" strokeWidth={2.2} />
                {count > 0 && (
                  <span
                    className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full
                               bg-amber-400 text-neutral-900 text-[11px] leading-[18px]
                               font-bold text-center px-[5px]"
                    aria-live="polite"
                  >
                    {count}
                  </span>
                )}
              </button>

              <Link href="/login" className="text-slate-300 hover:text-white transition-colors">
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-amber-400 text-neutral-900 px-4 py-2 text-sm font-semibold hover:bg-amber-300 transition"
              >
                Sign up
              </Link>
            </div>

            {/* Botones mobile: cart + burger */}
            <div className="md:hidden flex items-center gap-1.5">
              <button
                onClick={openCart}
                className="relative w-10 h-10 grid place-items-center rounded-full hover:bg-white/5"
                aria-label="Abrir carrito"
              >
                <ShoppingCart className="w-5 h-5" strokeWidth={2.2} />
                {count > 0 && (
                  <span
                    className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full
                               bg-amber-400 text-neutral-900 text-[11px] leading-[18px]
                               font-bold text-center px-[5px]"
                    aria-live="polite"
                  >
                    {count}
                  </span>
                )}
              </button>

              <button
                onClick={toggle}
                aria-label={open ? "Cerrar menú" : "Abrir menú"}
                aria-expanded={open}
                aria-controls="mobile-dropdown"
                className="grid place-items-center w-10 h-10 rounded-full hover:bg-white/5"
              >
                <span className="sr-only">Toggle menu</span>
                <div className="space-y-1.5">
                  <span className="block h-0.5 w-6 bg-white" />
                  <span className="block h-0.5 w-6 bg-white" />
                  <span className="block h-0.5 w-6 bg-white" />
                </div>
              </button>
            </div>
          </div>

          {/* DROPDOWN móvil */}
          <div
            id="mobile-dropdown"
            className={`md:hidden grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
              ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
            role="dialog"
            aria-modal="true"
          >
            <div className="overflow-hidden">
              <div className="h-px w-full bg-gradient-to-r from-transparent via-neutral-800 to-transparent" />
              <nav className="px-5 py-4">
                <ul className="flex flex-col gap-1">
                  {links.map((l) => (
                    <li key={l.name}>
                      <Link
                        href={l.href}
                        onClick={close}
                        className="block rounded-xl px-4 py-3 text-base hover:bg-white/5 active:bg-white/10 transition"
                      >
                        {l.name}
                      </Link>
                    </li>
                  ))}
                </ul>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <Link
                    href="/login"
                    onClick={close}
                    className="rounded-full border border-neutral-800 px-4 py-2 text-center hover:bg-white/5 transition"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={close}
                    className="rounded-full bg-amber-400 text-neutral-900 font-semibold px-4 py-2 text-center hover:bg-amber-300 transition"
                  >
                    Sign up
                  </Link>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Drawer del carrito */}
      <CartDrawer open={cartOpen} onClose={closeCart} />
    </nav>
  );
};

export default Nav;
