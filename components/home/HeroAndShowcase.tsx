"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, ArrowUpRight, ArrowLeft, ArrowRight } from "lucide-react";

type CardConfig = {
  src: string;
  tag: string;
  heroDesktopX: number;
  heroDesktopY: number;
  heroMobileX: number;
  heroMobileY: number;
  heroRotate: number;
  showcaseDesktopX: number;
  showcaseDesktopY: number;
  showcaseMobileX: number;
  showcaseMobileY: number;
  showcaseRotate: number;
};

type CategoryInfo = {
  id: string;
  label: string;
  title: string;
  description: string;
};

interface HeroAndShowcaseProps {
  data?: {
    title?: string;
    highlight?: string;
    categories?: CategoryInfo[];
    cards?: CardConfig[];
    tagline?: string;
  };
}

export default function HeroAndShowcase({ data }: HeroAndShowcaseProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const showcaseCenterRef = useRef<HTMLDivElement>(null);

  const categories: CategoryInfo[] = data?.categories || [
    {
      id: "Marquesina",
      label: "Marquesina",
      title: "Marquesinas y Fachadas",
      description: "Estructuras corpóreas de soporte e iluminación LED para marquesinas frontales que garantizan máxima visibilidad nocturna.",
    },
    {
      id: "Letras corpóreas",
      label: "Letras corpóreas",
      title: "Letras Corpóreas 3D",
      description: "Creamos letreros tridimensionales en acrílico, metal o madera, con retroiluminación premium para tu comercio.",
    },
    {
      id: "Salientes peatonales",
      label: "Salientes peatonales",
      title: "Carteles Salientes Peatonales",
      description: "Soportes de doble faz metálicos y acrílicos para visualización peatonal en veredas de alto tránsito comercial.",
    },
    {
      id: "Atriles de vereda",
      label: "Atriles de vereda",
      title: "Atriles y Caballetes",
      description: "Estructuras estables y portátiles para cartelería efímera de menús o promociones, ideales para locales gastronómicos.",
    },
    {
      id: "Foodtrucks",
      label: "Foodtrucks",
      title: "Rotulación de Foodtrucks",
      description: "Diseños integrales con vinilos de alta calidad y marquesinas modulares adaptadas a vehículos y trailers comerciales.",
    }
  ];

  const cards: CardConfig[] = data?.cards || [
    {
      src: "/assets/10dc229eeb96a4cabe5c251d305ef92ef93729fb.png", // Starbucks
      tag: "Letras corpóreas",
      heroDesktopX: -420, heroDesktopY: 34,
      heroMobileX: -130, heroMobileY: 20,
      heroRotate: -8.63,
      showcaseDesktopX: -160, showcaseDesktopY: -100,
      showcaseMobileX: -80, showcaseMobileY: -10,
      showcaseRotate: -12,
    },
    {
      src: "/assets/41283939bd74a3453a06d1331bd20247bf8e8fcd.png", // CULTO
      tag: "Atriles de vereda",
      heroDesktopX: -280, heroDesktopY: 10,
      heroMobileX: -85, heroMobileY: 6,
      heroRotate: -5.15,
      showcaseDesktopX: -100, showcaseDesktopY: -60,
      showcaseMobileX: -50, showcaseMobileY: 0,
      showcaseRotate: -6,
    },
    {
      src: "/assets/34b6c149f3c5ab0ba816977fa7356cb327d3c695.png", // ROLD
      tag: "Letras corpóreas",
      heroDesktopX: -140, heroDesktopY: 23,
      heroMobileX: -42, heroMobileY: 14,
      heroRotate: -2.34,
      showcaseDesktopX: -40, showcaseDesktopY: -20,
      showcaseMobileX: -20, showcaseMobileY: 10,
      showcaseRotate: -2,
    },
    {
      src: "/assets/67f0e9cafad48b51ae943ed51f2c03b933ee477a.png", // ORDER HERE
      tag: "Foodtrucks",
      heroDesktopX: 0, heroDesktopY: 5,
      heroMobileX: 0, heroMobileY: 3,
      heroRotate: 1.02,
      showcaseDesktopX: 20, showcaseDesktopY: 20,
      showcaseMobileX: 10, showcaseMobileY: 20,
      showcaseRotate: 2,
    },
    {
      src: "/assets/b1c41062b620e92fe7726e0274f898671941126c.png", // Rainbow heart
      tag: "Marquesina",
      heroDesktopX: 140, heroDesktopY: 23,
      heroMobileX: 42, heroMobileY: 14,
      heroRotate: 6.52,
      showcaseDesktopX: 80, showcaseDesktopY: 60,
      showcaseMobileX: 30, showcaseMobileY: 30,
      showcaseRotate: 6,
    },
    {
      src: "/assets/47b1327b704ce6f68873f4bfd6d23ff098806982.png", // LUCCIA
      tag: "Salientes peatonales",
      heroDesktopX: 280, heroDesktopY: 21,
      heroMobileX: 85, heroMobileY: 12,
      heroRotate: 14.95,
      showcaseDesktopX: 140, showcaseDesktopY: 100,
      showcaseMobileX: 60, showcaseMobileY: 40,
      showcaseRotate: 10,
    },
    {
      src: "/assets/9e26891257a92e1efedb953ccda1b6d003f0894b.png", // Burger King
      tag: "Marquesina",
      heroDesktopX: 420, heroDesktopY: 33,
      heroMobileX: 130, heroMobileY: 19,
      heroRotate: 22.22,
      showcaseDesktopX: 200, showcaseDesktopY: 140,
      showcaseMobileX: 90, showcaseMobileY: 50,
      showcaseRotate: 15,
    }
  ];
  
  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>(categories[0]?.id || "Marquesina");
  const [windowSize, setWindowSize] = useState({ width: 1200, height: 800 });
  
  // Dynamic positioning values measured on resize
  const [showcaseCenter, setShowcaseCenter] = useState({ x: 0, y: 0 });
  const [showcaseCenterYInViewport, setShowcaseCenterYInViewport] = useState(0);
  
  // Measurements ref to avoid closure issues in the scroll handler
  const measurementsRef = useRef({
    showcaseCenterX: 0,
    showcaseCenterY: 0,
    targetScroll: 0,
  });
  
  // Animation and transition states
  const [isFanned, setIsFanned] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionTimerRef = useRef<NodeJS.Timeout | null>(null);

  const changeFilter = (newFilter: string) => {
    setActiveFilter(newFilter);
    setIsTransitioning(true);
    
    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
    }
    
    transitionTimerRef.current = setTimeout(() => {
      setIsTransitioning(false);
    }, 800);
  };


  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      setWindowSize({ width: windowWidth, height: windowHeight });
      
      const mobile = windowWidth < 768;
      setIsMobile(mobile);

      if (showcaseCenterRef.current && containerRef.current) {
        const rect = showcaseCenterRef.current.getBoundingClientRect();
        const parentRect = containerRef.current.getBoundingClientRect();
        
        // Calculate target positions relative to the parent center and viewport center
        const parentCenterX = parentRect.left + parentRect.width / 2;
        const x = (rect.left + rect.width / 2) - parentCenterX;
        const yDiff = (rect.top + rect.height / 2) - parentRect.top;
        const targetScrollPos = Math.max(yDiff - windowHeight / 2, 0);

        measurementsRef.current = {
          showcaseCenterX: x,
          showcaseCenterY: yDiff,
          targetScroll: targetScrollPos,
        };
        
        setShowcaseCenter({ x, y: yDiff });

        // Calculate and set initial offset in viewport
        const scrolled = -parentRect.top;
        setShowcaseCenterYInViewport(yDiff - (scrolled + windowHeight / 2));
      }
    };

    // Calculate layout immediately and after a short timeout to handle page shifts
    handleResize();
    const resizeTimer = setTimeout(handleResize, 150);

    window.addEventListener("resize", handleResize);

    const handleScroll = () => {
      if (!containerRef.current) return;
      const parentRect = containerRef.current.getBoundingClientRect();
      const scrolled = -parentRect.top;
      
      const { targetScroll: target, showcaseCenterY } = measurementsRef.current;
      setShowcaseCenterYInViewport(showcaseCenterY - (scrolled + window.innerHeight / 2));

      if (target <= 0) {
        setProgress(0);
        return;
      }
      
      const p = Math.min(Math.max(scrolled / target, 0), 1);
      setProgress(p);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    // Intersection observer to track if Hero is visible in viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
      if (transitionTimerRef.current) {
        clearTimeout(transitionTimerRef.current);
      }
    };
  }, []);

  // Trigger entrance fan out animation smoothly when Hero enters viewport at scroll top
  useEffect(() => {
    if (isIntersecting && progress === 0) {
      const timer = setTimeout(() => {
        setIsFanned(true);
      }, 150);
      return () => clearTimeout(timer);
    } else if (!isIntersecting) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsFanned(false);
    }
  }, [isIntersecting, progress]);



  const activeCategory = categories.find((c) => c.id === activeFilter) || categories[0];

  const handleNextCategory = () => {
    const currentIndex = categories.findIndex((c) => c.id === activeFilter);
    const nextIndex = (currentIndex + 1) % categories.length;
    changeFilter(categories[nextIndex].id);
  };

  const handlePrevCategory = () => {
    const currentIndex = categories.findIndex((c) => c.id === activeFilter);
    const prevIndex = (currentIndex - 1 + categories.length) % categories.length;
    changeFilter(categories[prevIndex].id);
  };

  // Switch between CSS transition on load vs instant mapping on scroll to avoid lagginess
  const cardTransitionClass = (progress === 0 || isTransitioning)
    ? "transition-all duration-[800ms] cubic-bezier(0.16, 1, 0.3, 1)"
    : "transition-none";

  return (
    <div ref={containerRef} className="relative w-full">
      
      {/* Sticky Viewport containing the Floating Cards (Overlay) */}
      <div className="sticky top-0 h-screen w-full overflow-hidden pointer-events-none z-20 flex items-center justify-center">
        
        {/* Left Navigation Arrow Button (sticky) */}
        <button
          onClick={handlePrevCategory}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-3.5 bg-orange-main hover:bg-orange-600 text-white rounded-full active:scale-95 transition-all duration-300 shadow-lg shadow-orange-main/20 pointer-events-auto z-30 cursor-pointer"
          style={{
            opacity: progress * 2.5 - 1.2,
            pointerEvents: progress < 0.6 ? "none" : "auto",
          }}
          aria-label="Previous Category"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>

        {/* Right Navigation Arrow Button (sticky) */}
        <button
          onClick={handleNextCategory}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-3.5 bg-orange-main hover:bg-orange-600 text-white rounded-full active:scale-95 transition-all duration-300 shadow-lg shadow-orange-main/20 pointer-events-auto z-30 cursor-pointer"
          style={{
            opacity: progress * 2.5 - 1.2,
            pointerEvents: progress < 0.6 ? "none" : "auto",
          }}
          aria-label="Next Category"
        >
          <ArrowRight className="w-6 h-6 text-white" />
        </button>
        
        {/* Full-screen absolute cards container */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          {cards.map((card, idx) => {
            // Hero coordinate fanned values
            const hx = isMobile ? card.heroMobileX : card.heroDesktopX;
            const hy = isMobile ? card.heroMobileY : card.heroDesktopY;
            const hrot = card.heroRotate;

            // Stacked pile layout (initial state before entrance)
            const sx_stacked = 0;
            const sy_stacked = 0;
            const srot_stacked = idx * 2.5 - 7.5; // shuffled stack rotation offsets

            // Get base coordinates before scroll transition (apply entrance progress)
            const currentHeroX = isFanned ? hx : sx_stacked;
            const currentHeroY = isFanned ? hy : sy_stacked;
            const currentHeroRot = isFanned ? hrot : srot_stacked;

            // Target Showcase fanned coordinates based on category ordering (peeking slider)
            const cardCatIdx = Math.max(categories.findIndex((c) => c.id === card.tag), 0);
            const activeCatIdx = Math.max(categories.findIndex((c) => c.id === activeFilter), 0);

            let sx = 0;
            let sy = 0;
            let srot = 0;
            let targetScale = 1;
            let targetOpacity = 1;

            if (cardCatIdx === activeCatIdx) {
              // Active category: centered in the Showcase column
              sx = (isMobile ? card.showcaseMobileX : card.showcaseDesktopX) + showcaseCenter.x;
              sy = (isMobile ? card.showcaseMobileY : card.showcaseDesktopY) + showcaseCenterYInViewport;
              srot = card.showcaseRotate;
              targetScale = 1.15;
              targetOpacity = 1.0;
            } else if (cardCatIdx < activeCatIdx) {
              // Previous category: peeking from the LEFT edge
              const leftEdgeX = -windowSize.width / 2;
              sx = leftEdgeX + (isMobile ? -10 : 30);
              const verticalStagger = (cardCatIdx - activeCatIdx) * (isMobile ? 15 : 40);
              sy = showcaseCenterYInViewport + verticalStagger;
              srot = -15 + (idx % 3) * 3;
              targetScale = 0.85;
              targetOpacity = 0.4;
            } else {
              // Subsequent category: peeking from the RIGHT edge
              const rightEdgeX = windowSize.width / 2;
              sx = rightEdgeX - (isMobile ? -10 : 30);
              const verticalStagger = (cardCatIdx - activeCatIdx) * (isMobile ? 15 : 40);
              sy = showcaseCenterYInViewport + verticalStagger;
              srot = 15 - (idx % 3) * 3;
              targetScale = 0.85;
              targetOpacity = 0.4;
            }

            // Interpolate coordinate path with Scroll progress
            const tx = currentHeroX + (sx - currentHeroX) * progress;
            const ty = currentHeroY + (sy - currentHeroY) * progress;
            const rot = currentHeroRot + (srot - currentHeroRot) * progress;

            // Interpolate scale and opacity past 65% scroll
            let cardScale = 1;
            let cardOpacity = idx < 7 ? 1 : 0;
            if (progress > 0.65) {
              const fadeProgress = (progress - 0.65) / 0.35; // 0 to 1
              cardScale = 1 + (targetScale - 1) * fadeProgress;
              
              const startOpacity = idx < 7 ? 1 : 0;
              cardOpacity = startOpacity + (targetOpacity - startOpacity) * fadeProgress;
            }

            const matchesFilter = cardCatIdx === activeCatIdx;
            const isShowcaseActive = progress > 0.65;

            return (
              <div
                key={idx}
                className={`absolute shadow-[0px_8px_24px_rgba(0,0,0,0.12)] rounded-xl w-[90px] h-[105px] md:w-[210px] md:h-[235px] overflow-hidden bg-white border border-neutral-200/50 cursor-pointer origin-center ${cardTransitionClass}`}
                style={{
                  zIndex: matchesFilter && isShowcaseActive ? 40 : 10 + idx,
                  left: "50%",
                  top: "50%",
                  transform: `translate(-50%, -50%) translate3d(${tx}px, ${ty}px, 0) rotate(${rot}deg) scale(${cardScale})`,
                  opacity: cardOpacity,
                  pointerEvents: cardOpacity === 0 ? "none" : "auto",
                  boxShadow: matchesFilter && isShowcaseActive 
                    ? "0 0 20px 4px rgba(246, 131, 34, 0.4), 0px 8px 24px rgba(0,0,0,0.15)"
                    : "0px 8px 24px rgba(0,0,0,0.12)",
                  borderColor: matchesFilter && isShowcaseActive ? "#f68322" : "rgba(229, 229, 230, 0.5)",
                }}
                onClick={() => {
                  if (isShowcaseActive) {
                    changeFilter(card.tag);
                  }
                }}
              >
                <img
                  alt={card.tag}
                  className="w-full h-full object-cover pointer-events-none"
                  src={card.src}
                />

                {/* Card Tag overlays (fades in past 40% scroll) */}
                <div 
                  className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-neutral-950/80 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[8px] md:text-[10px] whitespace-nowrap font-bold transition-opacity duration-300 select-none border border-white/5 pointer-events-none"
                  style={{
                    opacity: progress > 0.4 ? 1 : 0
                  }}
                >
                  {card.tag}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scrollable Text Content Layers (Normal Flow) */}
      <div className="relative z-10 w-full flex flex-col mt-[-100vh]">
        
        {/* HERO SECTION VIEW (First Page Height) */}
        <div 
          className="min-h-screen w-full flex flex-col items-center justify-between py-12 md:py-24 px-4 md:px-10 text-center select-none"
          style={{
            opacity: 1 - progress * 2.5, // Fades out as you scroll down
            pointerEvents: progress > 0.35 ? "none" : "auto"
          }}
        >
          {/* Main Title Heading */}
          <h1 className="max-w-[1100px] text-center font-black leading-[1.1] text-4xl md:text-[80px] lg:text-[96px] text-neutral-900 tracking-tight mt-6">
            {data?.title || "Te ayudamos a materializar"}{" "}
            <span className="bg-gradient-to-r from-orange-main to-red-main bg-clip-text text-transparent inline-block">
              {data?.highlight || "tu marca"}
            </span>
          </h1>

          {/* Spacer for fanned cards */}
          <div className="h-[220px] md:h-[360px] pointer-events-none" />

          {/* Action buttons and tagline */}
          <div className="flex flex-col items-center gap-6 w-full mb-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md">
              <a
                href="#trabajos"
                className="w-full sm:w-[250px] py-4 flex items-center justify-center font-bold text-lg rounded-xl bg-neutral-200 text-neutral-900 hover:bg-neutral-300 transition-colors duration-200"
              >
                Trabajos
              </a>
              <a
                href="/contacto"
                className="w-full sm:w-[250px] py-4 flex items-center justify-center gap-2 font-bold text-lg rounded-xl bg-orange-main text-white hover:opacity-95 shadow-lg shadow-orange-main/20 transition-all duration-200"
              >
                <MessageCircle className="w-6 h-6 text-white" />
                Contactar
              </a>
            </div>
            
            <p className="text-sm md:text-lg text-neutral-400 font-semibold tracking-wide">
              {data?.tagline || "Power Print & Graphic Solutions"}
            </p>
          </div>
        </div>

        {/* SHOWCASE SECTION VIEW (Second Page Height) */}
        <div 
          className="min-h-screen w-full flex items-center px-4 md:px-24 py-16"
          style={{
            opacity: progress * 2.5 - 1.2, // Fades in as you scroll down
            pointerEvents: progress < 0.6 ? "none" : "auto"
          }}
        >
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Filter and Description Text */}
            <div className="lg:col-span-5 flex flex-col gap-6 text-center lg:text-left z-30">
              
              {/* Category pill filters */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-2.5">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => changeFilter(cat.id)}
                    className={`px-4 py-2 rounded-full text-xs md:text-sm font-bold transition-all cursor-pointer ${
                      activeFilter === cat.id
                        ? "bg-orange-main text-white shadow-md shadow-orange-main/15"
                        : "bg-white/60 hover:bg-white text-neutral-600 border border-neutral-200/50"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Text content details */}
              <div className="flex flex-col gap-3 min-h-[160px] justify-center">
                <span className="text-xs font-black uppercase tracking-widest text-orange-600">
                  Nuestros Socios
                </span>
                <h2 className="text-2xl md:text-4xl font-extrabold text-neutral-900 leading-tight">
                  Empresas que crecen con nosotros
                </h2>
                <p className="text-sm md:text-base text-neutral-500 leading-relaxed font-medium">
                  Acompañamos a organizaciones de diferentes industrias en sus iniciativas publicitarias e innovación tecnológica.
                </p>

                {/* Sub-panel displaying details for the active filter */}
                <div className="mt-4 p-5 bg-orange-50/70 border border-orange-200/40 rounded-xl text-left shadow-sm">
                  <h3 className="text-base font-extrabold text-orange-600 uppercase tracking-wider">
                    {activeCategory.title}
                  </h3>
                  <p className="text-sm text-neutral-600 mt-1 leading-relaxed">
                    {activeCategory.description}
                  </p>
                </div>
              </div>

              {/* Badge */}
              <div className="flex items-center justify-center lg:justify-start mt-2">
                <div className="bg-gradient-to-r from-orange-main to-red-main px-6 py-3 rounded-full flex items-center gap-2 shadow-lg shadow-orange-main/10 hover:scale-[1.02] transition-transform cursor-pointer">
                  <span className="text-xs md:text-sm font-bold text-neutral-50 whitespace-nowrap">
                    Solicitar Info
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-white" />
                </div>
              </div>

            </div>
            {/* Right Column: Contains the target center ref for the cards */}
            <div ref={showcaseCenterRef} className="lg:col-span-7 h-[200px] md:h-[450px] pointer-events-none relative flex items-center justify-center" />

          </div>
        </div>

      </div>

    </div>
  );
}
