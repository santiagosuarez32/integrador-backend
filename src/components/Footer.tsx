"use client";

import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="relative mt-16">
      {/* capa glass */}
      <div className="relative border-t border-white/10 bg-white/5 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Navegación */}
          <nav aria-label="Footer Navigation">
            <h4 className="text-white font-semibold mb-4">Navegación</h4>
            <ul className="space-y-2 text-sm text-white/80">
              {["Inicio", "Productos", "Servicios", "Sobre Nosotros", "Contacto"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="transition-colors hover:text-violet-300"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contacto */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contacto</h4>
            <address className="not-italic space-y-2 text-sm text-white/80">
              <p>Calle Falsa 123, Ciudad, País</p>
              <p>
                Teléfono:{" "}
                <a
                  href="tel:+1234567890"
                  className="hover:text-violet-300 transition-colors"
                >
                  +1 234 567 890
                </a>
              </p>
              <p>
                Email:{" "}
                <a
                  href="mailto:info@ejemplo.com"
                  className="hover:text-violet-300 transition-colors"
                >
                  info@ejemplo.com
                </a>
              </p>
            </address>
          </div>

          {/* Redes sociales */}
          <div>
            <h4 className="text-white font-semibold mb-4">Síguenos</h4>
            <div className="flex space-x-6">
              {[
                {
                  label: "Facebook",
                  icon: (
                    <path d="M22 12a10 10 0 10-11.5 9.9v-7h-2v-3h2v-2c0-2 1-3 3-3h2v3h-2c-.5 0-1 .5-1 1v2h3l-1 3h-2v7A10 10 0 0022 12z" />
                  ),
                },
                {
                  label: "Twitter",
                  icon: (
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.3 4.3 0 001.88-2.38 8.59 8.59 0 01-2.72 1.04 4.28 4.28 0 00-7.3 3.9A12.14 12.14 0 013 5.15a4.28 4.28 0 001.33 5.71 4.24 4.24 0 01-1.94-.54v.05a4.28 4.28 0 003.44 4.2 4.3 4.3 0 01-1.93.07 4.28 4.28 0 004 2.98A8.6 8.6 0 012 19.54a12.14 12.14 0 006.56 1.92c7.88 0 12.2-6.53 12.2-12.2 0-.19 0-.38-.01-.57A8.72 8.72 0 0022.46 6z" />
                  ),
                },
                {
                  label: "Instagram",
                  icon: (
                    <path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm10 3a1 1 0 110 2 1 1 0 010-2zm-5 3a5 5 0 110 10 5 5 0 010-10zm0 2a3 3 0 100 6 3 3 0 000-6z" />
                  ),
                },
              ].map(({ label, icon }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="text-white/80 hover:text-violet-300 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    className="w-6 h-6 fill-current"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    {icon}
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* línea inferior */}
        <div className="border-t border-white/10 mt-10 pt-6 text-center text-xs text-white/60">
          &copy; {new Date().getFullYear()} Tu Empresa. Todos los derechos
          reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
