"use client";

import React, { useEffect, useState } from "react";

interface WidgetProps {
  title: string;
  content: string;
}

const Widget: React.FC<WidgetProps> = ({ title, content }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 480);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: "relative",
        borderRadius: 16,
        background: "linear-gradient(135deg, #6b8cff 0%, #88e0ef 100%)",
        padding: isMobile ? "1.5rem 1.5rem 2rem" : "2rem 2.5rem 2.5rem",
        boxShadow: isHovered
          ? "0 15px 35px rgba(104, 132, 255, 0.6)"
          : "0 10px 25px rgba(104, 132, 255, 0.35)",
        maxWidth: 360,
        width: "100%",
        margin: "1rem",
        color: "#fff",
        fontFamily: "'Poppins', sans-serif",
        overflow: "hidden",
        border: "2px solid rgba(255, 255, 255, 0.3)",
        backgroundImage: `radial-gradient(circle at 20% 20%, rgba(255,255,255,0.1) 0%, transparent 40%),
                          radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 40%)`,
        boxSizing: "border-box",
        flex: "1 1 300px",
        transform: isHovered ? "scale(1.03)" : "scale(1)",
        transition: "box-shadow 0.3s ease, transform 0.3s ease",
        cursor: "pointer",
      }}
    >
      {/* Decoración geométrica */}
      <div
        style={{
          position: "absolute",
          top: -40,
          right: -40,
          width: 120,
          height: 120,
          backgroundColor: "rgba(255, 255, 255, 0.15)",
          borderRadius: "50%",
          filter: "blur(40px)",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -30,
          left: -30,
          width: 100,
          height: 100,
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderRadius: "50%",
          filter: "blur(25px)",
          zIndex: 0,
        }}
      />

      {/* Icono simple arriba */}
      <div style={{ marginBottom: "1rem", position: "relative", zIndex: 1 }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="white"
          strokeWidth={2}
          style={{ width: isMobile ? 28 : 36, height: isMobile ? 28 : 36 }}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </div>

      <h3
        style={{
          marginBottom: "1rem",
          fontWeight: 700,
          fontSize: isMobile ? 18 : 24,
          textShadow: "0 2px 6px rgba(0,0,0,0.3)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: isMobile ? 14 : 17,
          lineHeight: 1.6,
          color: "rgba(255, 255, 255, 0.95)",
          position: "relative",
          zIndex: 1,
          marginBottom: "1.8rem",
        }}
      >
        {content}
      </p>

      {/* Botón de acción */}
      <button
        style={{
          position: "relative",
          zIndex: 1,
          backgroundColor: "rgba(255, 255, 255, 0.25)",
          border: "none",
          borderRadius: 30,
          padding: isMobile ? "0.5rem 1.5rem" : "0.6rem 1.8rem",
          color: "#fff",
          fontWeight: 600,
          fontSize: isMobile ? 14 : 16,
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(255, 255, 255, 0.4)",
          transition: "background-color 0.3s ease",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.45)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.25)")
        }
      >
        Leer más
      </button>
    </div>
  );
};

const WidgetsContainer: React.FC = () => {
  const widgetsInfo = [
    {
      title: "Envío Gratis",
      content: "Disfruta de envío gratis en pedidos mayores a $50.",
    },
    {
      title: "Soporte 24/7",
      content: "Nuestro equipo está disponible para ayudarte en cualquier momento.",
    },
    {
      title: "Devoluciones fáciles",
      content: "Si no estás satisfecho, te devolvemos tu dinero.",
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        gap: "2rem",
        justifyContent: "center",
        flexWrap: "wrap",
        padding: "2rem",
      }}
    >
      {widgetsInfo.map(({ title, content }) => (
        <Widget key={title} title={title} content={content} />
      ))}
    </div>
  );
};

export default WidgetsContainer;
