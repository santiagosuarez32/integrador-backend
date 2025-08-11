"use client";

import React from "react";

const PerfumeBrandsCarousel: React.FC = () => {
  const images = [
    { src: "https://www.kindpng.com/picc/m/160-1603188_transparent-versace-logo-png-versace-logo-transparent-png.png", alt: "Versace" },
    { src: "https://brandemia.org/sites/default/files/sites/default/files/paco_rabanne-logo_nuevo.jpg", alt: "Paco Rabanne" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Dior_Logo.svg/1200px-Dior_Logo.svg.png", alt: "Dior" },
    { src: "https://www.kindpng.com/picc/m/136-1366869_chanel-logo-hd-png-download.png", alt: "Chanel" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/e/e2/CK_Calvin_Klein_logo.svg", alt: "Calvin Klein" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/7/79/1960s_Gucci_Logo.svg", alt: "Gucci" },
    { src: "https://cdn.worldvectorlogo.com/logos/prada.svg", alt: "Prada" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Hugo-Boss-Logo.svg/2560px-Hugo-Boss-Logo.svg.png", alt: "Hugo Boss" },
  ];

  const duplicated = [...images, ...images];

  return (
    <section aria-label="Marcas asociadas" className="relative px-6 md:px-8 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="relative rounded-3xl bg-[#faf8f4] border border-black/5 shadow-2xl shadow-black/10 p-6 sm:p-8">
          <div className="mb-6 flex items-center justify-between">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-300/60 bg-white px-4 py-1.5 text-[11px] font-semibold tracking-[0.18em] text-slate-600">
              OUR PARTNERS
            </span>
            <span className="hidden sm:block text-sm text-slate-500">
              +8 marcas premium
            </span>
          </div>

          <div
            className="relative isolate overflow-hidden rounded-2xl bg-white/70 backdrop-blur border border-slate-200 py-4"
            style={{
              WebkitMaskImage:
                "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
              maskImage:
                "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
            }}
          >
            <div className="flex w-max gap-3 sm:gap-6 animate-marquee hover:[animation-play-state:paused] motion-reduce:animate-none">
              {duplicated.map(({ src, alt }, i) => (
                <div key={i} className="flex-shrink-0">
                  <img
                    src={src}
                    alt={i < images.length ? alt : ""}
                    aria-hidden={i >= images.length}
                    loading="lazy"
                    className="h-10 sm:h-14 md:h-16 object-contain opacity-80 hover:opacity-100 transition duration-300 mx-2 sm:mx-4"
                    width={140}
                    height={64}
                  />
                </div>
              ))}
            </div>

            <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-[#faf8f4] to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-[#faf8f4] to-transparent" />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        @media (max-width: 640px) {
          .animate-marquee {
            animation-duration: 24s;
          }
        }
      `}</style>
    </section>
  );
};

export default PerfumeBrandsCarousel;
