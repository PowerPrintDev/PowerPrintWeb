"use client";

import { useState, useEffect } from "react";
import { ArrowUpRight, Grid } from "lucide-react";
import Navbar from "@/components/home/Navbar";
import CTASection from "@/components/home/CTASection";
import Footer from "@/components/home/Footer";
import Testimonials from "@/components/home/Testimonials";

interface Project {
  id: string;
  title: string;
  category: string;
  src: string;
  gridClass?: string;
}

interface WorksClientProps {
  content: any;
}

export default function WorksClient({ content }: WorksClientProps) {
  const [activeCategory, setActiveCategory] = useState("Todos");

  const worksData = content?.worksPage || {
    hero: {
      pill: "Portafolio",
      title: "Nuestros *trabajos destacados*",
      subtitle: "Una selección de nuestros últimos carteles, letras corpóreas y marquesinas fabricadas a medida para negocios de todo el país."
    },
    projects: [],
    typeHeader: {
      pill: "Explorá por tipo",
      title: "¿Qué tipo de trabajo buscás?"
    },
    types: [],
    testimonialHeader: {
      pill: "Lo que dicen nuestros clientes",
      title: "Resultados que se ven en cada local"
    },
    testimonials: []
  };

  const projects: Project[] = worksData.projects || [];
  
  // Extract unique categories that actually have projects
  const categories = ["Todos", ...Array.from(new Set(projects.map((p) => p.category)))];

  // Auto-filter category from URL search params on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const filterParam = params.get("filter") || params.get("category");
      if (filterParam) {
        const matched = categories.find(
          (c) => c.toLowerCase() === filterParam.toLowerCase()
        );
        if (matched) {
          setTimeout(() => {
            setActiveCategory(matched);
            const element = document.getElementById("portafolio-section");
            if (element) {
              element.scrollIntoView({ behavior: "smooth" });
            }
          }, 100);
        }
      }
    }
  }, [categories]);

  // Helper to count projects per category
  const getCategoryCount = (category: string) => {
    if (category === "Todos") return projects.length;
    return projects.filter((p) => p.category === category).length;
  };

  const filteredProjects = activeCategory === "Todos" 
    ? projects 
    : projects.filter((p) => p.category === activeCategory);

  const handleSelectCategory = (category: string) => {
    setActiveCategory(category);
    const element = document.getElementById("portafolio-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const parseTitle = (text: string) => {
    if (!text) return "";
    const parts = text.split(/(\*[^*]+\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith("*") && part.endsWith("*")) {
        const cleanText = part.slice(1, -1);
        return (
          <span key={idx} className="bg-gradient-to-r from-orange-main to-red-main bg-clip-text text-transparent inline-block font-black">
            {cleanText}
          </span>
        );
      }
      const subParts = part.split("\n");
      return subParts.map((sub, sIdx) => (
        <span key={`${idx}-${sIdx}`}>
          {sub}
          {sIdx < subParts.length - 1 && <br />}
        </span>
      ));
    });
  };

  // Helper to resolve specific grid positioning for Bento grid layout
  // So that even if columns are filtered, they look beautiful
  const getBentoClass = (gridClass?: string, index?: number) => {
    if (activeCategory !== "Todos") {
      // In filtered view, make a uniform look or use simple classes
      return "col-span-1 row-span-1 h-[260px]";
    }
    
    // Default gridClasses from JSON, or fallbacks if not defined
    if (gridClass) return gridClass;
    
    // Fallback bento classes based on index
    const fallbacks = [
      "md:col-span-2 md:row-span-2 h-[540px]", // 0
      "md:col-span-1 md:row-span-1 h-[260px]", // 1
      "md:col-span-1 md:row-span-2 h-[540px]", // 2
      "md:col-span-1 md:row-span-1 h-[260px]", // 3
      "md:col-span-2 md:row-span-1 h-[260px]", // 4
      "md:col-span-1 md:row-span-1 h-[260px]", // 5
      "md:col-span-1 md:row-span-1 h-[260px]", // 6
      "md:col-span-2 md:row-span-2 h-[540px]", // 7
    ];
    return fallbacks[index ?? 0] || "md:col-span-1 md:row-span-1 h-[260px]";
  };

  return (
    <div className="min-h-screen w-full flex flex-col font-sans antialiased bg-gradient-to-t from-neutral-50 via-neutral-50 to-orange-100/30 overflow-x-clip selection:bg-orange-200/80 selection:text-orange-950">
      
      {/* Navigation Header */}
      <Navbar data={content?.navbar} categories={content?.heroAndShowcase?.categories} />

      <main className="flex-1 w-full flex flex-col items-center">
        
        {/* HERO HEADER */}
        <section className="w-full max-w-7xl mx-auto px-6 pt-24 pb-12 md:pt-32 md:pb-16 flex flex-col items-center gap-6 text-center select-none">
          <div className="bg-orange-50 border border-orange-main/30 px-4 py-1.5 rounded-full flex items-center shrink-0">
            <span className="text-xs font-extrabold text-orange-main uppercase tracking-wider">
              {worksData.hero?.pill || "Portafolio"}
            </span>
          </div>
          
          <h1 className="max-w-[900px] text-center font-black leading-[1.1] text-4xl md:text-[70px] lg:text-[80px] text-neutral-900 tracking-tight">
            {parseTitle(worksData.hero?.title || "Nuestros trabajos")}
          </h1>

          <p className="max-w-[700px] text-sm md:text-lg text-neutral-500 font-semibold leading-relaxed mt-2">
            {worksData.hero?.subtitle}
          </p>
        </section>

        {/* CATEGORY FILTER TABS */}
        <section id="portafolio-section" className="w-full max-w-7xl mx-auto px-6 mb-12 scroll-mt-24">
          <div className="flex flex-wrap gap-2 justify-center items-center">
            {categories.map((category) => {
              const isActive = activeCategory === category;
              const count = getCategoryCount(category);
              
              return (
                <button
                  key={category}
                  onClick={() => handleSelectCategory(category)}
                  className={`px-4 py-2.5 rounded-full text-xs md:text-sm font-bold flex items-center gap-2 transition-all duration-300 cursor-pointer shadow-sm ${
                    isActive 
                      ? "bg-neutral-950 text-white scale-[1.03] shadow-md" 
                      : "bg-white border border-neutral-200 hover:border-neutral-300 text-neutral-600 hover:text-neutral-900"
                  }`}
                >
                  {category === "Todos" && <Grid className="w-3.5 h-3.5" />}
                  <span>{category}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold transition-colors ${
                    isActive ? "bg-orange-main text-white" : "bg-neutral-100 text-neutral-400 group-hover:bg-neutral-200"
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* BENTO GRID OF PROJECTS */}
        <section className="w-full max-w-7xl mx-auto px-6 pb-24">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-20 bg-white/50 border border-neutral-200 rounded-[32px] shadow-sm flex flex-col items-center gap-4">
              <span className="text-4xl">📁</span>
              <p className="text-neutral-400 font-bold">No hay proyectos cargados en esta categoría.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[260px]">
              {filteredProjects.map((project, idx) => {
                const bentoClass = getBentoClass(project.gridClass, idx);
                const isDoubleRow = bentoClass.includes("row-span-2");
                const cardHeightClass = isDoubleRow ? "h-full" : "h-full";
                
                return (
                  <div
                    key={project.id || idx}
                    className={`relative rounded-[32px] overflow-hidden bg-neutral-100 border border-neutral-200 shadow-sm transition-all duration-500 hover:shadow-xl hover:border-orange-main/20 group cursor-pointer ${bentoClass} ${cardHeightClass}`}
                  >
                    {/* Project Image */}
                    {project.src ? (
                      <img
                        src={project.src}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-neutral-100 flex items-center justify-center">
                        <span className="text-3xl text-neutral-300">🖼️</span>
                      </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent opacity-60 group-hover:opacity-75 transition-opacity duration-300" />

                    {/* Project Detail Card */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 flex flex-col gap-2 text-left justify-end z-10">
                      <span className="text-[10px] md:text-xs font-extrabold text-orange-main uppercase tracking-widest block">
                        {project.category}
                      </span>
                      <h3 className="text-lg md:text-xl lg:text-2xl font-black text-white leading-tight group-hover:text-orange-100 transition-colors">
                        {project.title}
                      </h3>
                      
                      {/* Decorative Action Indicator */}
                      <div className="flex items-center gap-1.5 text-xs text-neutral-300 font-bold opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300 mt-2">
                        <span>Ver detalles</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* WHAT TYPE OF WORK ARE YOU LOOKING FOR? */}
        {worksData.types && worksData.types.length > 0 && (
          <section className="w-full bg-white border-y border-neutral-200/50 py-16 md:py-24">
            <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-12 text-center">
              
              <div className="flex flex-col gap-4 items-center">
                <div className="bg-orange-50 border border-orange-main/30 px-4 py-1.5 rounded-full flex items-center shrink-0">
                  <span className="text-xs font-extrabold text-orange-main uppercase tracking-wider">
                    {worksData.typeHeader?.pill || "Explorá por tipo"}
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-neutral-950">
                  {worksData.typeHeader?.title || "¿Qué tipo de trabajo buscás?"}
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full mt-2">
                {worksData.types.map((type: any, idx: number) => (
                  <div
                    key={idx}
                    onClick={() => handleSelectCategory(type.filterTag)}
                    className="bg-neutral-50/50 border border-neutral-200 p-8 rounded-[24px] flex flex-col items-center justify-between gap-6 hover:shadow-lg hover:border-orange-main/20 hover:bg-white transition-all duration-300 group cursor-pointer"
                  >
                    <div className="w-16 h-16 bg-neutral-100 text-neutral-800 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-sm">
                      {type.icon}
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <h4 className="text-lg font-black text-neutral-950 group-hover:text-orange-main transition-colors">
                        {type.title}
                      </h4>
                      <p className="text-xs text-neutral-500 font-semibold leading-relaxed">
                        {type.description}
                      </p>
                    </div>

                    <button
                      type="button"
                      className="text-xs font-bold text-orange-main hover:text-orange-600 flex items-center gap-1.5 mt-2 transition-colors cursor-pointer"
                    >
                      <span>Ver trabajos</span>
                      <span>→</span>
                    </button>
                  </div>
                ))}
              </div>

            </div>
          </section>
        )}

        {/* CUSTOMER TESTIMONIALS */}
        <Testimonials testimonials={worksData.testimonials} header={worksData.testimonialHeader} />

        {/* CALL TO ACTION SECTION */}
        <CTASection data={{ ...content?.ctaSection, logoTypo: content?.navbar?.logoWhite }} />

      </main>

      {/* FOOTER SECTION */}
      <Footer data={content?.footer} />
      
    </div>
  );
}
