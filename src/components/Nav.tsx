"use client";

import React, { useState } from "react";

const Nav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-black text-white px-8 py-4 flex items-center justify-between  relative">
      {/* Logo */}
      <div className="flex items-center space-x-3 font-bold text-xl z-20 relative">
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 7l6 6-6 6" />
        </svg>
        <span>CHICX</span>
      </div>

      {/* Botón menú hamburguesa (solo móvil) */}
      <button
        onClick={toggleMenu}
        className="md:hidden flex flex-col space-y-1 z-20 relative focus:outline-none"
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        <span
          className={`block h-0.5 w-6 bg-white rounded transform transition duration-300 ease-in-out ${
            isOpen ? "rotate-45 translate-y-1.5" : ""
          }`}
        />
        <span
          className={`block h-0.5 w-6 bg-white rounded transition duration-300 ease-in-out ${
            isOpen ? "opacity-0" : "opacity-100"
          }`}
        />
        <span
          className={`block h-0.5 w-6 bg-white rounded transform transition duration-300 ease-in-out ${
            isOpen ? "-rotate-45 -translate-y-1.5" : ""
          }`}
        />
      </button>

      {/* Menú principal escritorio */}
      <ul className="hidden md:flex space-x-6 bg-gray-900 rounded-full px-4 py-2 text-sm font-medium z-10 relative">
        <li>
          <a
            href="#"
            className="bg-white text-black rounded-full px-4 py-1"
            aria-current="page"
          >
            Home
          </a>
        </li>
        <li>
          <a href="#" className="hover:text-gray-300 transition">
            Shop
          </a>
        </li>
        <li>
          <a href="#" className="hover:text-gray-300 transition">
            Sale
          </a>
        </li>
        <li>
          <a href="#" className="hover:text-gray-300 transition">
            Blog
          </a>
        </li>
        <li>
          <a href="#" className="hover:text-gray-300 transition">
            Showcase
          </a>
        </li>
      </ul>

      {/* Botones login y signup escritorio */}
      <div className="hidden md:flex space-x-4 items-center z-10 relative">
        <button className="flex items-center space-x-1 text-gray-400 hover:text-white transition">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12H3m12 0l-4-4m4 4l-4 4"
            />
          </svg>
          <span>Login</span>
        </button>
        <button className="bg-white text-black rounded-full px-4 py-1 font-semibold hover:bg-gray-200 transition">
          Sign up
        </button>
      </div>

      {/* Menú móvil desplegable */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-black bg-opacity-95 rounded-b-lg shadow-lg md:hidden z-10">
          <ul className="flex flex-col space-y-3 p-6 text-center">
            <li>
              <a
                href="#"
                className="block bg-white text-black rounded-full px-6 py-2 font-semibold"
                onClick={() => setIsOpen(false)}
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block hover:text-gray-300 transition"
                onClick={() => setIsOpen(false)}
              >
                Shop
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block hover:text-gray-300 transition"
                onClick={() => setIsOpen(false)}
              >
                Sale
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block hover:text-gray-300 transition"
                onClick={() => setIsOpen(false)}
              >
                Blog
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block hover:text-gray-300 transition"
                onClick={() => setIsOpen(false)}
              >
                Showcase
              </a>
            </li>
            <li className="pt-4 border-t border-gray-700">
              <button
                className="w-full flex justify-center items-center space-x-2 text-gray-400 hover:text-white transition"
                onClick={() => setIsOpen(false)}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12H3m12 0l-4-4m4 4l-4 4"
                  />
                </svg>
                <span>Login</span>
              </button>
              <button
                className="mt-2 w-full bg-white text-black rounded-full px-4 py-2 font-semibold hover:bg-gray-200 transition"
                onClick={() => setIsOpen(false)}
              >
                Sign up
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Nav;
