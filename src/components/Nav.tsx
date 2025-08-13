// src/components/Nav.tsx
"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  User2,
  ChevronDown,
  LogOut,
  Package,
  Settings,
  LayoutDashboard,
} from "lucide-react";
import CartDrawer from "@/components/CartDrawer";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

const links = [
  { name: "Home", href: "/" },
  { name: "Productos", href: "/products" },
  { name: "Contacto", href: "/contact" },
  { name: "About", href: "/about" },
];

const supabase = supabaseBrowser();

const Nav: React.FC = () => {
  const router = useRouter();

  // ======= estado UI general =======
  const [mobileOpen, setMobileOpen] = useState(false); // menú mobile
  const toggle = useCallback(() => setMobileOpen((v) => !v), []);
  const close = useCallback(() => setMobileOpen(false), []);

  // ✅ estado DEL CARRITO desde el contexto (no uses un useState local)
  const { open: cartOpen, setOpen: setCartOpen, count } = useCart();

  const [userMenuOpen, setUserMenuOpen] = useState(false); // dropdown user
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Montaje para evitar hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // ======= data =======
  const { user, loading, signOut } = useAuth();

  const displayName = useMemo(() => {
    const n1 = (user?.user_metadata?.name as string) || "";
    const n2 = (user?.user_metadata?.full_name as string) || "";
    if (n1) return n1;
    if (n2) return n2;
    if (user?.email) return user.email.split("@")[0];
    return "";
  }, [user]);

  // Avatar + flag admin desde profiles
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const defaultAvatar = useMemo(() => {
    const seed = encodeURIComponent(displayName || user?.email || "User");
    return `https://api.dicebear.com/8.x/initials/svg?seed=${seed}&backgroundType=gradientLinear`;
  }, [displayName, user?.email]);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!user) {
        setAvatarUrl(null);
        setIsAdmin(false);
        return;
      }
      const { data, error } = await supabase
        .from("profiles")
        .select("avatar_url,is_admin")
        .eq("id", user.id)
        .maybeSingle();

      if (!active) return;
      if (error) {
        setAvatarUrl(null);
        setIsAdmin(false);
      } else {
        setAvatarUrl(data?.avatar_url ?? null);
        setIsAdmin(Boolean(data?.is_admin));
      }
    })();
    return () => {
      active = false;
    };
  }, [user]);

  // Bloquear scroll del body si hay overlays (menú o carrito)
  useEffect(() => {
    const anyOpen = mobileOpen || cartOpen;
    document.body.style.overflow = anyOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen, cartOpen]);

  // Cerrar menú mobile por gesto/scroll (solo móvil)
  useEffect(() => {
    if (!mobileOpen) return;
    const mm = window.matchMedia("(max-width: 767px)");
    if (!mm.matches) return;

    let last = window.scrollY;
    let touchY = 0;

    const onScroll = () => {
      if (window.scrollY > last + 6) close();
      last = window.scrollY;
    };
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY > 8) close();
    };
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0]?.clientY ?? 0;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (Math.abs((e.touches[0]?.clientY ?? 0) - touchY) > 14) close();
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
  }, [mobileOpen, close]);

  // Cerrar dropdown user por click afuera/Escape
  useEffect(() => {
    if (!userMenuOpen) return;
    function onDocClick(e: MouseEvent) {
      if (!userMenuRef.current) return;
      if (!userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setUserMenuOpen(false);
    }
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [userMenuOpen]);

  // ======= acciones =======
  const goAccount = () => router.push("/account");
  const goOrders = () => router.push("/account/orders");
  const goAdmin = () => router.push("/admin/dashboard");
  const onSignOut = async () => {
    await signOut();
    setUserMenuOpen(false);
    router.refresh();
  };

  return (
    <nav className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto max-w-[1120px] mt-3 md:mt-4 px-4 md:px-6">
        {/* overflow-visible para que el dropdown no se recorte */}
        <div className="relative rounded-2xl border border-neutral-800 bg-neutral-950/80 backdrop-blur-md shadow-sm text-slate-100 overflow-visible">
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
              {/* Carrito */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative w-10 h-10 grid place-items-center rounded-full hover:bg-white/5"
                aria-label="Abrir carrito"
              >
                <ShoppingCart className="w-5 h-5" strokeWidth={2.2} />
                {count > 0 && (
                  <span
                    className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-amber-400 text-neutral-900 text-[11px] leading-[18px] font-bold text-center px-[5px]"
                    aria-live="polite"
                  >
                    {count}
                  </span>
                )}
              </button>

              {/* Placeholder mientras monta para evitar mismatch */}
              {!mounted ? (
                <div className="h-10 w-[220px]" aria-hidden />
              ) : !loading && !user ? (
                <>
                  <Link href="/login" className="text-slate-300 hover:text-white transition-colors">
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="rounded-full bg-amber-400 text-neutral-900 px-4 py-2 text-sm font-semibold hover:bg-amber-300 transition"
                  >
                    Sign up
                  </Link>
                </>
              ) : (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen((v) => !v)}
                    className="inline-flex items-center gap-2 rounded-full border border-neutral-800 pl-1.5 pr-2.5 py-1.5 hover:bg-white/5 transition"
                    aria-haspopup="menu"
                    aria-expanded={userMenuOpen}
                  >
                    {/* avatar + fallback */}
                    {avatarUrl || defaultAvatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={avatarUrl || defaultAvatar}
                        alt="avatar"
                        className="w-6 h-6 rounded-full border border-neutral-700 object-cover shrink-0"
                      />
                    ) : (
                      <User2 className="w-4 h-4" />
                    )}
                    <span className="text-sm">Hola {displayName}</span>
                    <ChevronDown className="w-4 h-4 opacity-70" />
                  </button>

                  {userMenuOpen && (
                    <div
                      role="menu"
                      className="absolute right-0 top-[calc(100%+8px)] z-50 w-56 rounded-xl border border-neutral-800 bg-neutral-950/95 backdrop-blur p-1 shadow-lg"
                    >
                      {isAdmin && (
                        <button
                          onClick={goAdmin}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 text-sm"
                          role="menuitem"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          Panel de admin
                        </button>
                      )}
                      <button
                        onClick={goAccount}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 text-sm"
                        role="menuitem"
                      >
                        <Settings className="w-4 h-4" />
                        Mi cuenta
                      </button>
                      <button
                        onClick={goOrders}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 text-sm"
                        role="menuitem"
                      >
                        <Package className="w-4 h-4" />
                        Mis pedidos
                      </button>
                      <div className="my-1 h-px bg-neutral-800" />
                      <button
                        onClick={onSignOut}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 text-sm text-red-300"
                        role="menuitem"
                      >
                        <LogOut className="w-4 h-4" />
                        Cerrar sesión
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Acciones mobile: carrito + burger */}
            <div className="md:hidden flex items-center gap-1.5">
              <button
                onClick={() => setCartOpen(true)}
                className="relative w-10 h-10 grid place-items-center rounded-full hover:bg-white/5"
                aria-label="Abrir carrito"
              >
                <ShoppingCart className="w-5 h-5" strokeWidth={2.2} />
                {count > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-amber-400 text-neutral-900 text-[11px] leading-[18px] font-bold text-center px-[5px]">
                    {count}
                  </span>
                )}
              </button>

              <button
                onClick={toggle}
                aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
                aria-expanded={mobileOpen}
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
            className={`md:hidden grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              mobileOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
            }`}
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

                {/* Área de cuenta en mobile */}
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {!mounted || loading ? (
                    <>
                      <div className="rounded-full border border-neutral-800 px-4 py-2 text-center opacity-60">
                        …
                      </div>
                      <div className="rounded-full bg-amber-400/60 text-neutral-900 font-semibold px-4 py-2 text-center">
                        …
                      </div>
                    </>
                  ) : !user ? (
                    <>
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
                    </>
                  ) : (
                    <>
                      {isAdmin && (
                        <button
                          onClick={() => {
                            close();
                            router.push("/admin/dashboard");
                          }}
                          className="rounded-full border border-neutral-800 px-4 py-2 text-center hover:bg-white/5 transition col-span-2"
                        >
                          Panel de admin
                        </button>
                      )}
                      <button
                        onClick={() => {
                          close();
                          router.push("/account");
                        }}
                        className="rounded-full border border-neutral-800 px-4 py-2 text-center hover:bg-white/5 transition"
                      >
                        Mi cuenta
                      </button>
                      <button
                        onClick={() => {
                          close();
                          router.push("/account/orders");
                        }}
                        className="rounded-full border border-neutral-800 px-4 py-2 text-center hover:bg-white/5 transition"
                      >
                        Mis pedidos
                      </button>
                      <button
                        onClick={async () => {
                          await onSignOut();
                          close();
                        }}
                        className="mt-2 col-span-2 rounded-full border border-neutral-800 px-4 py-2 text-center hover:bg-white/5 transition text-red-300"
                      >
                        Cerrar sesión
                      </button>
                    </>
                  )}
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Drawer del carrito — usa el estado del contexto */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </nav>
  );
};

export default Nav;
