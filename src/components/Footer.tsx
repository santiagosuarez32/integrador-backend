"use client";

import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sección de navegación */}
        <nav aria-label="Footer Navigation" className="flex flex-col space-y-2">
          <h4 className="text-white font-semibold mb-4">Navegación</h4>
          <a href="#" className="hover:text-white">
            Inicio
          </a>
          <a href="#" className="hover:text-white">
            Productos
          </a>
          <a href="#" className="hover:text-white">
            Servicios
          </a>
          <a href="#" className="hover:text-white">
            Sobre Nosotros
          </a>
          <a href="#" className="hover:text-white">
            Contacto
          </a>
        </nav>

        {/* Sección de contacto */}
        <div>
          <h4 className="text-white font-semibold mb-4">Contacto</h4>
          <address className="not-italic space-y-2">
            <p>Calle Falsa 123, Ciudad, País</p>
            <p>Teléfono: <a href="tel:+1234567890" className="hover:text-white">+1 234 567 890</a></p>
            <p>Email: <a href="mailto:info@ejemplo.com" className="hover:text-white">info@ejemplo.com</a></p>
          </address>
        </div>

        {/* Redes sociales */}
        <div>
          <h4 className="text-white font-semibold mb-4">Síguenos</h4>
          <div className="flex space-x-6">
            <a
              href="#"
              aria-label="Facebook"
              className="hover:text-white"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                className="w-6 h-6 fill-current"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M22 12a10 10 0 10-11.5 9.9v-7h-2v-3h2v-2c0-2 1-3 3-3h2v3h-2c-.5 0-1 .5-1 1v2h3l-1 3h-2v7A10 10 0 0022 12z" />
              </svg>
            </a>
            <a
              href="#"
              aria-label="Twitter"
              className="hover:text-white"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                className="w-6 h-6 fill-current"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.3 4.3 0 001.88-2.38 8.59 8.59 0 01-2.72 1.04 4.28 4.28 0 00-7.3 3.9A12.14 12.14 0 013 5.15a4.28 4.28 0 001.33 5.71 4.24 4.24 0 01-1.94-.54v.05a4.28 4.28 0 003.44 4.2 4.3 4.3 0 01-1.93.07 4.28 4.28 0 004 2.98A8.6 8.6 0 012 19.54a12.14 12.14 0 006.56 1.92c7.88 0 12.2-6.53 12.2-12.2 0-.19 0-.38-.01-.57A8.72 8.72 0 0022.46 6z" />
              </svg>
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="hover:text-white"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                className="w-6 h-6 fill-current"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm10 3a1 1 0 110 2 1 1 0 010-2zm-5 3a5 5 0 110 10 5 5 0 010-10zm0 2a3 3 0 100 6 3 3 0 000-6z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="text-center text-gray-500 text-sm mt-10">
        &copy; {new Date().getFullYear()} Tu Empresa. Todos los derechos reservados.
      </div>
    </footer>
  );
};

export default Footer;
