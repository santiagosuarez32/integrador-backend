import React from "react";

const PerfumeBrandsCarousel: React.FC = () => {
  const images = [
    {
      src: "https://greenarg.com/wp-content/uploads/2025/06/Frame-20.png.webp",
      alt: "Marca 1",
    },
    {
      src: "https://greenarg.com/wp-content/uploads/2025/06/Frame-21.png.webp",
      alt: "Marca 2",
    },
    {
      src: "https://greenarg.com/wp-content/uploads/2025/06/Frame-21-1.png.webp",
      alt: "Marca 3",
    },
    {
      src: "https://greenarg.com/wp-content/uploads/2025/06/Frame-21-2.png.webp",
      alt: "Marca 4",
    },
    {
      src: "https://greenarg.com/wp-content/uploads/2025/06/Frame-24.png.webp",
      alt: "Marca 5",
    },
    {
      src: "https://greenarg.com/wp-content/uploads/2025/06/Frame-24-1.png.webp",
      alt: "Marca 6",
    },
    {
      src: "https://greenarg.com/wp-content/uploads/2025/06/Frame-24-2.png.webp",
      alt: "Marca 7",
    },
    {
      src: "https://greenarg.com/wp-content/uploads/2025/06/Frame-25.png.webp",
      alt: "Marca 8",
    },
    {
      src: "https://greenarg.com/wp-content/uploads/2025/06/Frame-25-1.png.webp",
      alt: "Marca 9",
    },
    {
      src: "https://greenarg.com/wp-content/uploads/2025/06/Frame-25-2.png.webp",
      alt: "Marca 10",
    },
    {
      src: "https://greenarg.com/wp-content/uploads/2025/06/Frame-26.png.webp",
      alt: "Marca 11",
    },
    {
      src: "https://greenarg.com/wp-content/uploads/2025/06/Frame-26-1.png.webp",
      alt: "Marca 12",
    },
  ];

  const duplicatedImages = [...images, ...images];

  return (
    <>
      <style>{`
        /* Evitar scroll horizontal en toda la página */
        body, html {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
        }

        .carousel-container {
          overflow: hidden;
          width: 100%; /* Ocupa el 100% del contenedor padre */
          position: relative;
          top: -190px; /* Mueve el carrusel hacia arriba */
          box-sizing: border-box;
        }

        .carousel-track {
          display: flex;
          width: max-content;
          animation: scroll 20s linear infinite;
        }

        .carousel-item {
          flex: 0 0 auto;
          margin: 0 20px;
        }

        .carousel-item img {
          height: 140px;
          max-height: 15vh;
          max-width: 100%;
          object-fit: contain;
          display: block;
          user-select: none;
          pointer-events: none;
        }

        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-50%));
          }
        }

        /* Responsive */
        @media (max-width: 900px) {
          .carousel-item img {
            height: 110px;
            max-height: 12vh;
          }
          .carousel-item {
            margin: 0 15px;
          }
          .carousel-container {
            top: -120px; /* Ajusta el desplazamiento para pantallas más pequeñas */
          }
        }

        @media (max-width: 600px) {
          .carousel-item img {
            height: 80px;
            max-height: 10vh;
          }
          .carousel-item {
            margin: 0 10px;
          }
          .carousel-container {
            top: -80px; /* Ajuste adicional para móviles */
          }
        }
      `}</style>
      <div className="carousel-container" aria-label="Marcas de perfume">
        <div className="carousel-track">
          {duplicatedImages.map(({ src, alt }, index) => (
            <div className="carousel-item" key={index}>
              <img src={src} alt={alt} loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default PerfumeBrandsCarousel;
