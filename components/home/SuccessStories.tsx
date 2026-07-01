"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";

type SuccessStory = {
  logo: string;
  title: string;
  description: string;
  badge: string;
  mockups: string[];
};

interface SuccessStoriesProps {
  data?: {
    title?: string;
    stories?: SuccessStory[];
  };
}

export default function SuccessStories({ data }: SuccessStoriesProps) {
  const [activeStory, setActiveStory] = useState(0);

  const stories: SuccessStory[] = data?.stories || [
    {
      logo: "/assets/83ee8974bc0726865bf381144c9e3d2e353d8317.png",
      title: "Un reto increíble",
      description: "Trabajamos junto a grandes marcas para rediseñar su presencia en puntos de venta físicos, instalando cartelería corpórea y marquesinas de alta gama que redefinen la experiencia visual del cliente.",
      badge: "Marquesina Premium",
      mockups: [
        "/assets/9e26891257a92e1efedb953ccda1b6d003f0894b.png",
        "/assets/4d7146a3b6b4351a4ed6555a37ea662e6640e4f0.png",
        "/assets/0e95ea7680b1be37bf01a1c8bf22a56029fa21a7.png",
      ]
    },
    {
      logo: "/assets/628d0b757003e98f9427c645354850f34e309611.png",
      title: "Identidad Visual Total",
      description: "Creamos un ecosistema publicitario completo desde carpintería metálica hasta impresión gigantográfica, permitiendo que la marca logre un impacto visual coherente y masivo en todo el país.",
      badge: "Herrería & Cartelería",
      mockups: [
        "/assets/34b6c149f3c5ab0ba816977fa7356cb327d3c695.png",
        "/assets/41283939bd74a3453a06d1331bd20247bf8e8fcd.png",
        "/assets/10dc229eeb96a4cabe5c251d305ef92ef93729fb.png",
      ]
    }
  ];

  const title = data?.title || "Casos de éxito";

  const handleNext = () => {
    setActiveStory((prev) => (prev + 1) % stories.length);
  };

  const handlePrev = () => {
    setActiveStory((prev) => (prev - 1 + stories.length) % stories.length);
  };

  const story = stories[activeStory];

  return (
    <section className="w-full py-16 md:py-24 bg-orange-200/40 relative overflow-clip flex flex-col items-center">
      {/* Title */}
      <div className="w-full max-w-7xl px-4 md:px-10 mb-10 text-center md:text-left">
        <h2 className="text-3xl md:text-4xl font-extrabold text-red-main select-none tracking-tight">
          {title}
        </h2>
      </div>

      {/* Interactive Main Area */}
      <div className="w-full max-w-7xl px-4 md:px-10 flex flex-col lg:flex-row items-center justify-between gap-12 relative">
        
        {/* Left Side: Mockups Collage */}
        <div className="w-full lg:w-[650px] h-[400px] md:h-[500px] relative select-none">
          {/* Background circle decorative pattern */}
          <div className="absolute left-[15%] top-[10%] w-[70%] h-[70%] rotate-[14deg] opacity-70 animate-pulse duration-10000 pointer-events-none">
            <img alt="" className="w-full h-full object-contain" src="/assets/dc2d5c9c091835f93a28fdbf94d8607207b7af36.svg" />
          </div>

          {/* Masked base logo mockup shape */}
          <div className="absolute left-[10%] top-[5%] w-[65%] h-[90%] opacity-20 pointer-events-none">
            <img alt="" className="w-full h-full object-contain" src="/assets/ea171e5975821f07ba03309d4b02d25c0e21a76c.svg" />
          </div>

          {/* Mockup 1 (Top Left) */}
          <div className="absolute left-[5%] md:left-[10%] top-[10%] w-[160px] h-[220px] md:w-[220px] md:h-[300px] bg-red-main rounded-xl overflow-hidden shadow-2xl border border-white/10 z-10 transition-all duration-500 ease-in-out hover:scale-105">
            <img alt="Mockup 1" className="w-full h-full object-cover" src={story.mockups[0]} />
          </div>

          {/* Mockup 2 (Bottom Middle) */}
          <div className="absolute left-[25%] md:left-[30%] top-[40%] md:top-[35%] w-[160px] h-[220px] md:w-[220px] md:h-[300px] bg-red-main rounded-xl overflow-hidden shadow-2xl border border-white/10 z-20 transition-all duration-500 ease-in-out hover:scale-105">
            <img alt="Mockup 2" className="w-full h-full object-cover" src={story.mockups[1]} />
          </div>

          {/* Mockup 3 (Right Stack) */}
          <div className="absolute right-[5%] md:right-[10%] top-[15%] md:top-[20%] w-[200px] h-[160px] md:w-[280px] md:h-[220px] bg-red-main rounded-xl overflow-hidden shadow-2xl border border-white/10 z-10 transition-all duration-500 ease-in-out hover:scale-105">
            <img alt="Mockup 3" className="w-full h-full object-cover" src={story.mockups[2]} />
          </div>
        </div>

        {/* Right Side: Quote Panel & Navigation */}
        <div className="flex-1 max-w-xl w-full flex flex-col gap-6 relative">
          
          {/* Main Info Card */}
          <div className="bg-white/40 border border-white/30 p-6 md:p-10 rounded-2xl flex flex-col gap-4 shadow-xl shadow-orange-950/5 relative z-10 backdrop-blur-md">
            {/* Case logo */}
            <div className="h-16 w-auto max-w-[150px] flex items-center mb-2">
              <img
                src={story.logo}
                alt="Client logo"
                className="max-h-full object-contain filter drop-shadow-sm"
              />
            </div>
            
            {/* Title */}
            <h3 className="text-2xl md:text-3xl font-black text-neutral-900 leading-tight">
              {story.title}
            </h3>

            {/* Description */}
            <p className="text-base md:text-lg text-neutral-700 leading-relaxed font-medium">
              {story.description}
            </p>

            {/* Buttons & Link */}
            <div className="flex items-center gap-4 mt-2">
              <Link
                href={`/casos-de-exito/${activeStory}`}
                className="bg-orange-main hover:bg-orange-600 px-6 py-3 rounded-lg text-white font-bold text-sm md:text-base flex items-center gap-2 transition-all duration-200 shadow-md shadow-orange-main/10 cursor-pointer border-none"
              >
                <span>Ver más</span>
                <ArrowUpRight className="w-5 h-5 text-white" />
              </Link>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-start items-center gap-4 px-2">
            <button
              onClick={handlePrev}
              className="p-3.5 bg-orange-main hover:bg-orange-600 text-white rounded-full transition-transform active:scale-95 duration-200 shadow-md shadow-orange-main/20 flex items-center justify-center cursor-pointer"
              aria-label="Previous Success Story"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={handleNext}
              className="p-3.5 bg-orange-main hover:bg-orange-600 text-white rounded-full transition-transform active:scale-95 duration-200 shadow-md shadow-orange-main/20 flex items-center justify-center cursor-pointer"
              aria-label="Next Success Story"
            >
              <ArrowRight className="w-5 h-5 text-white" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
