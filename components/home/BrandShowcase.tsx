"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";

type ProjectCategory = {
  title: string;
  description: string;
  badge: string;
  images: string[];
};

export default function BrandShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);

  const categories: ProjectCategory[] = [
    {
      title: "Empresas que crecen con nosotros",
      description: "Acompañamos a organizaciones de diferentes industrias en sus iniciativas publicitarias e innovación tecnológica.",
      badge: "Marquesina y carteles",
      images: [
        "/assets/67f0e9cafad48b51ae943ed51f2c03b933ee477a.png", // Muestra04
        "/assets/b1c41062b620e92fe7726e0274f898671941126c.png", // Muestra03
        "/assets/47b1327b704ce6f68873f4bfd6d23ff098806982.png", // Muestra02
        "/assets/9e26891257a92e1efedb953ccda1b6d003f0894b.png", // Muestra01
      ]
    },
    {
      title: "Soluciones de Impresión Premium",
      description: "Brindamos la más alta fidelidad de colores y materiales duraderos para destacar tu negocio en cualquier entorno.",
      badge: "Impresión de Alta Calidad",
      images: [
        "/assets/10dc229eeb96a4cabe5c251d305ef92ef93729fb.png", // Muestra07
        "/assets/41283939bd74a3453a06d1331bd20247bf8e8fcd.png", // Muestra06
        "/assets/34b6c149f3c5ab0ba816977fa7356cb327d3c695.png", // Muestra05
        "/assets/67f0e9cafad48b51ae943ed51f2c03b933ee477a.png", // Muestra04
      ]
    },
    {
      title: "Identidad Visual Exclusiva",
      description: "Diseños que hablan por sí mismos, logrando una conexión instantánea con tus clientes potenciales.",
      badge: "Diseños Personalizados",
      images: [
        "/assets/b1c41062b620e92fe7726e0274f898671941126c.png", // Muestra03
        "/assets/47b1327b704ce6f68873f4bfd6d23ff098806982.png", // Muestra02
        "/assets/9e26891257a92e1efedb953ccda1b6d003f0894b.png", // Muestra01
        "/assets/10dc229eeb96a4cabe5c251d305ef92ef93729fb.png", // Muestra07
      ]
    }
  ];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % categories.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + categories.length) % categories.length);
  };

  const current = categories[activeIndex];

  // Stack styling configurations
  const cardStyles = [
    { rotate: "rotate-[1deg]", top: "top-[15px] md:top-[34px]", left: "left-[10px] md:left-[109px]", zIndex: 10 },
    { rotate: "rotate-[6.52deg]", top: "top-[32px] md:top-[69px]", left: "left-[30px] md:left-[156px]", zIndex: 11 },
    { rotate: "rotate-[14.95deg]", top: "top-[58px] md:top-[145px]", left: "left-[50px] md:left-[204px]", zIndex: 12 },
    { rotate: "rotate-[22.22deg]", top: "top-[85px] md:top-[223px]", left: "left-[70px] md:left-[255px]", zIndex: 13 },
  ];

  return (
    <section id="nosotros" className="w-full py-16 px-4 md:px-24 bg-white/40 backdrop-blur-md relative overflow-clip border-y border-orange-200/20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
        
        {/* Navigation - Left Control */}
        <button
          onClick={handlePrev}
          className="order-3 md:order-1 p-3.5 bg-orange-main hover:bg-orange-600 text-white rounded-full transition-transform active:scale-95 duration-200 shadow-md shadow-orange-main/20 flex items-center justify-center cursor-pointer"
          aria-label="Previous Project"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>

        {/* Text Area */}
        <div className="order-1 md:order-2 flex-1 text-center md:text-left max-w-xl">
          <span className="text-sm font-extrabold uppercase tracking-widest text-orange-600 block mb-2">
            Nuestros Socios
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-neutral-900 leading-tight transition-all duration-300">
            {current.title}
          </h2>
          <p className="mt-4 text-base md:text-lg text-neutral-600 leading-relaxed transition-all duration-300">
            {current.description}
          </p>
        </div>

        {/* Card Deck Showcase */}
        <div className="order-2 md:order-3 w-full md:w-[600px] h-[340px] md:h-[616px] relative select-none">
          
          {/* Overlapping Mockup Stack */}
          {current.images.map((imgSrc, index) => {
            const style = cardStyles[index];
            return (
              <div
                key={index}
                className={`absolute transition-all duration-500 ease-in-out hover:scale-105 hover:-translate-y-2 hover:z-40 ${style.top} ${style.left} ${style.rotate} shadow-[0px_8px_20px_rgba(0,0,0,0.12)] rounded-2xl w-[130px] h-[155px] md:w-[277px] md:h-[311px] overflow-hidden bg-white border border-neutral-100`}
                style={{ zIndex: style.zIndex }}
              >
                <img
                  alt={`Slide Card ${index}`}
                  className="w-full h-full object-cover"
                  src={imgSrc}
                />
              </div>
            );
          })}

          {/* Action Badge */}
          <div
            className="absolute bottom-4 left-4 md:left-[71px] md:bottom-[120px] z-30 bg-gradient-to-r from-orange-main to-red-main px-6 py-3 rounded-full flex items-center gap-3 shadow-lg shadow-orange-main/20 hover:scale-[1.03] transition-all cursor-pointer duration-300"
          >
            <span className="text-sm md:text-lg font-bold text-neutral-50 whitespace-nowrap">
              {current.badge}
            </span>
            <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </div>

        </div>

        {/* Navigation - Right Control */}
        <button
          onClick={handleNext}
          className="order-4 md:order-4 p-3.5 bg-orange-main hover:bg-orange-600 text-white rounded-full transition-transform active:scale-95 duration-200 shadow-md shadow-orange-main/20 flex items-center justify-center cursor-pointer"
          aria-label="Next Project"
        >
          <ArrowRight className="w-6 h-6 text-white" />
        </button>

      </div>
    </section>
  );
}
