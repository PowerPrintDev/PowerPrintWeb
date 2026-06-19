"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle } from "lucide-react";

type CardConfig = {
  src: string;
  desktopX: number;
  desktopY: number;
  mobileX: number;
  mobileY: number;
  rotate: number;
};

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFanned, setIsFanned] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const cards: CardConfig[] = [
    { 
      src: "/assets/10dc229eeb96a4cabe5c251d305ef92ef93729fb.png", // Starbucks
      desktopX: -420, 
      desktopY: 34, 
      mobileX: -130, 
      mobileY: 20, 
      rotate: -8.63 
    },
    { 
      src: "/assets/41283939bd74a3453a06d1331bd20247bf8e8fcd.png", // CULTO
      desktopX: -280, 
      desktopY: 10, 
      mobileX: -85, 
      mobileY: 6, 
      rotate: -5.15 
    },
    { 
      src: "/assets/34b6c149f3c5ab0ba816977fa7356cb327d3c695.png", // ROLD
      desktopX: -140, 
      desktopY: 23, 
      mobileX: -42, 
      mobileY: 14, 
      rotate: -2.34 
    },
    { 
      src: "/assets/67f0e9cafad48b51ae943ed51f2c03b933ee477a.png", // ORDER HERE
      desktopX: 0, 
      desktopY: 5, 
      mobileX: 0, 
      mobileY: 3, 
      rotate: 1.02 
    },
    { 
      src: "/assets/b1c41062b620e92fe7726e0274f898671941126c.png", // Rainbow heart
      desktopX: 140, 
      desktopY: 23, 
      mobileX: 42, 
      mobileY: 14, 
      rotate: 6.52 
    },
    { 
      src: "/assets/47b1327b704ce6f68873f4bfd6d23ff098806982.png", // LUCCIA
      desktopX: 280, 
      desktopY: 21, 
      mobileX: 85, 
      mobileY: 12, 
      rotate: 14.95 
    },
    { 
      src: "/assets/9e26891257a92e1efedb953ccda1b6d003f0894b.png", // Burger King
      desktopX: 420, 
      desktopY: 33, 
      mobileX: 130, 
      mobileY: 19, 
      rotate: 22.22 
    },
  ];

  useEffect(() => {
    // Check screen size
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);

    // Setup scroll observer
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsFanned(true);
        } else {
          // Collapse cards back when out of viewport
          setIsFanned(false);
        }
      },
      {
        threshold: 0.15, // Trigger when 15% of the element is visible
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener("resize", checkMobile);
      observer.disconnect();
    };
  }, []);

  return (
    <section 
      ref={containerRef}
      id="inicio" 
      className="w-full flex flex-col items-center py-12 md:py-20 px-4 md:px-10 overflow-clip"
    >
      {/* Title */}
      <h1 className="max-w-[1100px] text-center font-black leading-[1.1] text-4xl md:text-[80px] lg:text-[96px] text-neutral-900 tracking-tight">
        Te ayudamos a materializar{" "}
        <span className="bg-gradient-to-r from-orange-main to-red-main bg-clip-text text-transparent inline-block">
          tu marca
        </span>
      </h1>

      {/* Overlapping Mockup Cards Fan */}
      <div className="relative w-full max-w-[1200px] h-[260px] md:h-[420px] my-10 md:my-16 select-none flex justify-center items-start">
        {cards.map((card, idx) => {
          // Target position
          const tx = isMobile ? card.mobileX : card.desktopX;
          const ty = isMobile ? card.mobileY : card.desktopY;
          const rot = card.rotate;
          
          // Collapsed position (stacked in center with slight rotation shuffle)
          const shuffleRot = idx * 2.5 - 7.5; // -7.5 to 7.5 deg
          
          const transformStyle = isFanned
            ? `translateX(${tx}px) translateY(${ty}px) rotate(${rot}deg)`
            : `translateX(0px) translateY(0px) rotate(${shuffleRot}deg)`;

          return (
            <div
              key={idx}
              className="absolute shadow-[0px_8px_24px_rgba(0,0,0,0.12)] rounded-xl w-[90px] h-[105px] md:w-[210px] md:h-[235px] overflow-hidden bg-white border border-neutral-200/50 cursor-pointer origin-bottom transition-all duration-[850ms] cubic-bezier(0.16, 1, 0.3, 1) hover:scale-105 hover:z-50 hover:-translate-y-4"
              style={{
                zIndex: 10 + idx,
                transform: transformStyle,
                left: "calc(50% - 45px)", // Center horizontally on mobile
                marginLeft: isMobile ? "0px" : "-60px", // Align offset for centering
                top: "20px",
                // Set offset top and width in desktop media scale
              }}
            >
              <img
                alt={`Muestra ${idx + 1}`}
                className="w-full h-full object-cover pointer-events-none"
                src={card.src}
              />
            </div>
          );
        })}
      </div>

      {/* Buttons Action Group */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md mt-6 z-20">
        <a
          href="#trabajos"
          className="w-full sm:w-[250px] py-4 flex items-center justify-center font-bold text-lg rounded-xl bg-neutral-200 text-neutral-900 hover:bg-neutral-300 transition-colors duration-200"
        >
          Trabajos
        </a>
        <a
          href="#contacto"
          className="w-full sm:w-[250px] py-4 flex items-center justify-center gap-2 font-bold text-lg rounded-xl bg-orange-main text-white hover:opacity-95 shadow-lg shadow-orange-main/20 transition-all duration-200"
        >
          <MessageCircle className="w-6 h-6 text-white" />
          Contactar
        </a>
      </div>

      {/* Branding tagline */}
      <p className="mt-8 text-sm md:text-lg text-neutral-400 font-semibold tracking-wide select-none">
        Power Print & Graphic Solutions
      </p>

      {/* Custom responsive overrides for card dimensions on desktop */}
      <style jsx>{`
        @media (min-width: 768px) {
          div.absolute {
            left: calc(50% - 105px) !important;
            margin-left: 0px !important;
          }
        }
      `}</style>
    </section>
  );
}
