"use client";

import React from "react";

const PerfumeBrandsCarousel: React.FC = () => {
  const images = [
    { src: "https://greenarg.com/wp-content/uploads/2025/06/Frame-20.png.webp", alt: "Marca 1" },
    { src: "https://greenarg.com/wp-content/uploads/2025/06/Frame-21.png.webp", alt: "Marca 2" },
    { src: "https://greenarg.com/wp-content/uploads/2025/06/Frame-21-1.png.webp", alt: "Marca 3" },
    { src: "https://greenarg.com/wp-content/uploads/2025/06/Frame-21-2.png.webp", alt: "Marca 4" },
    { src: "https://greenarg.com/wp-content/uploads/2025/06/Frame-24.png.webp", alt: "Marca 5" },
    { src: "https://greenarg.com/wp-content/uploads/2025/06/Frame-24-1.png.webp", alt: "Marca 6" },
    { src: "https://greenarg.com/wp-content/uploads/2025/06/Frame-24-2.png.webp", alt: "Marca 7" },
    { src: "https://greenarg.com/wp-content/uploads/2025/06/Frame-25.png.webp", alt: "Marca 8" },
    { src: "https://greenarg.com/wp-content/uploads/2025/06/Frame-25-1.png.webp", alt: "Marca 9" },
    { src: "https://greenarg.com/wp-content/uploads/2025/06/Frame-25-2.png.webp", alt: "Marca 10" },
    { src: "https://greenarg.com/wp-content/uploads/2025/06/Frame-26.png.webp", alt: "Marca 11" },
    { src: "https://greenarg.com/wp-content/uploads/2025/06/Frame-26-1.png.webp", alt: "Marca 12" },
  ];

  const duplicatedImages = [...images, ...images];

  return (
    <section className="relative w-full py-10 overflow-hidden">
      <div
        className="flex w-max animate-[scroll_20s_linear_infinite]"
        style={{
          animationName: "scroll",
        }}
      >
        {duplicatedImages.map(({ src, alt }, index) => (
          <div key={index} className="flex-shrink-0 mx-6">
            <img
              src={src}
              alt={alt}
              loading="lazy"
              className="h-20 sm:h-24 md:h-28 object-contain opacity-80 hover:opacity-100 transition duration-300"
            />
          </div>
        ))}
      </div>

      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
};

export default PerfumeBrandsCarousel;
