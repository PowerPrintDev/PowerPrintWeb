"use client";

import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/home/Navbar";
import HeroAndShowcase from "@/components/home/HeroAndShowcase";
import ClientLogos from "@/components/home/ClientLogos";
import SuccessStories from "@/components/home/SuccessStories";
import Services from "@/components/home/Services";
import FactoryTour from "@/components/home/FactoryTour";
import CTASection from "@/components/home/CTASection";
import FAQSection from "@/components/home/FAQSection";
import Footer from "@/components/home/Footer";
import Stats from "@/components/home/Stats";
import WorksClient from "@/app/trabajos/WorksClient";
import ContactClient from "@/app/contacto/ContactClient";
import { ArrowUpRight, MessageCircle, Image as ImageIcon } from "lucide-react";

export default function PreviewClient() {
  const [content, setContent] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>("general");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Listen for messages from the parent window
    const handleMessage = (e: MessageEvent) => {
      if (e.data && e.data.type === "PREVIEW_UPDATE") {
        setContent(e.data.content);
        setActiveTab(e.data.activeTab);
      }
    };
    window.addEventListener("message", handleMessage);

    // Tell the parent we are ready to receive data
    if (window.parent) {
      window.parent.postMessage({ type: "PREVIEW_READY" }, "*");
    }

    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Drag to scroll logic for phone mockup preview
  useEffect(() => {
    const slider = containerRef.current;
    if (!slider) return;

    let isDown = false;
    let startY = 0;
    let scrollTop = 0;

    const handleMouseDown = (e: MouseEvent) => {
      isDown = true;
      slider.classList.add("cursor-grabbing");
      slider.classList.remove("cursor-grab");
      startY = e.pageY;
      scrollTop = slider.scrollTop;
    };

    const handleMouseLeave = () => {
      isDown = false;
      slider.classList.remove("cursor-grabbing");
      slider.classList.add("cursor-grab");
    };

    const handleMouseUp = () => {
      isDown = false;
      slider.classList.remove("cursor-grabbing");
      slider.classList.add("cursor-grab");
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const y = e.pageY;
      const walk = (y - startY) * 1.5; // Scroll speed factor
      slider.scrollTop = scrollTop - walk;
    };

    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
    };

    slider.addEventListener("mousedown", handleMouseDown);
    slider.addEventListener("mouseleave", handleMouseLeave);
    slider.addEventListener("mouseup", handleMouseUp);
    slider.addEventListener("mousemove", handleMouseMove);
    slider.addEventListener("dragstart", handleDragStart);

    // Set cursor drag style
    slider.classList.add("cursor-grab");

    return () => {
      slider.removeEventListener("mousedown", handleMouseDown);
      slider.removeEventListener("mouseleave", handleMouseLeave);
      slider.removeEventListener("mouseup", handleMouseUp);
      slider.removeEventListener("mousemove", handleMouseMove);
      slider.removeEventListener("dragstart", handleDragStart);
    };
  }, [content]);

  if (!content) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center text-xs font-semibold text-neutral-400">
        Cargando vista previa...
      </div>
    );
  }

  // Helper to render title with asterisks
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

  const renderPreviewContent = () => {
    switch (activeTab) {
      case "general":
        return (
          <div className="flex flex-col min-h-full">
            <Navbar data={content.navbar} categories={content.heroAndShowcase?.categories} />
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center select-none bg-neutral-50/50">
              <span className="text-3xl mb-2">🎨</span>
              <h4 className="text-sm font-black text-neutral-900">Configuración General & Colores</h4>
              <p className="text-[11px] text-neutral-500 font-semibold mt-1">El tema de color seleccionado se aplica a todos los componentes de la web.</p>
              <div className="mt-4 flex gap-2">
                <span className="w-5 h-5 rounded-full border border-neutral-300 shadow-sm" style={{ backgroundColor: content.theme?.orangeMain }} title="Orange Main" />
                <span className="w-5 h-5 rounded-full border border-neutral-300 shadow-sm" style={{ backgroundColor: content.theme?.redMain }} title="Red Main" />
                <span className="w-5 h-5 rounded-full border border-neutral-300 shadow-sm" style={{ backgroundColor: content.theme?.background }} title="Background" />
                <span className="w-5 h-5 rounded-full border border-neutral-300 shadow-sm" style={{ backgroundColor: content.theme?.foreground }} title="Text" />
              </div>
            </div>
            <Footer data={content.footer} />
          </div>
        );

      case "hero":
        return (
          <div className="flex flex-col min-h-full">
            <Navbar data={content.navbar} categories={content.heroAndShowcase?.categories} />
            <HeroAndShowcase data={content.heroAndShowcase} />
          </div>
        );

      case "about": {
        const aboutData = content.aboutPage || {};
        return (
          <div className="flex flex-col min-h-full bg-neutral-50/50 text-neutral-900">
            <Navbar data={content.navbar} categories={content.heroAndShowcase?.categories} />
            
            {/* HERO SECTION */}
            <section className="px-4 pt-12 pb-6 flex flex-col items-center gap-4 text-center">
              <div className="bg-orange-50 border border-orange-main/30 px-3 py-1 rounded-full flex items-center shrink-0">
                <span className="text-[10px] font-extrabold text-orange-main uppercase tracking-wider">
                  {aboutData.hero?.pill}
                </span>
              </div>
              <h2 className="text-xl font-black leading-tight text-neutral-950">
                {parseTitle(aboutData.hero?.title || "")}
              </h2>
              <p className="text-xs text-neutral-500 font-semibold leading-relaxed">
                {aboutData.hero?.subtitle}
              </p>
              <div className="flex flex-col gap-2 w-full mt-2">
                <div className="py-2.5 flex items-center justify-center font-bold text-xs rounded-lg bg-neutral-200 text-neutral-900">
                  {aboutData.hero?.worksLabel}
                </div>
                <div className="py-2.5 flex items-center justify-center gap-1.5 font-bold text-xs rounded-lg bg-orange-main text-white shadow-lg shadow-orange-main/20">
                  <MessageCircle className="w-4 h-4 text-white" />
                  {aboutData.hero?.contactLabel}
                </div>
              </div>
            </section>

            {/* STATS SECTION */}
            <Stats stats={aboutData.stats || []} />

            {/* HISTORIA Y VALORES SECTION */}
            <section className="px-4 py-8 flex flex-col gap-6">
              <div className="bg-orange-50 border border-orange-main/30 px-3 py-1 rounded-full flex items-center self-start">
                <span className="text-[10px] font-extrabold text-orange-main uppercase tracking-wider">
                  {aboutData.history?.pill}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-black text-neutral-950">
                  {aboutData.history?.title}
                </h3>
                <p className="text-xs text-neutral-600 font-medium leading-relaxed">
                  {aboutData.history?.description}
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <h4 className="text-sm font-extrabold text-orange-main">
                  {aboutData.history?.valuesTitle}
                </h4>
                <div className="flex flex-col gap-2 text-xs text-neutral-700 font-bold leading-relaxed">
                  {aboutData.history?.values?.map((val: string, idx: number) => (
                    <p key={idx}>{val}</p>
                  ))}
                </div>
              </div>
              <div className="w-full h-48 bg-orange-50/50 border border-orange-200/50 rounded-xl overflow-hidden flex items-center justify-center p-2 relative shadow-md">
                {aboutData.history?.image ? (
                  <img src={aboutData.history.image} alt="" className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <span className="text-xs font-bold text-neutral-400">Sin foto de historia</span>
                )}
              </div>
            </section>

            {/* PROCESO SECTION */}
            <section className="bg-neutral-100/50 py-8 px-4 flex flex-col gap-6">
              <div className="bg-orange-50 border border-orange-main/30 px-3 py-1 rounded-full flex items-center self-start">
                <span className="text-[10px] font-extrabold text-orange-main uppercase tracking-wider">
                  {aboutData.process?.pill}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-black text-neutral-950">
                  {aboutData.process?.title}
                </h3>
                <p className="text-xs text-neutral-500 font-semibold">
                  {aboutData.process?.description}
                </p>
              </div>
              <div className="bg-white border border-neutral-200 p-4 rounded-xl flex flex-col gap-1.5 shadow-sm">
                <span className="text-[10px] text-neutral-500 font-bold uppercase">
                  {aboutData.process?.avgTimeTitle}
                </span>
                <p className="text-lg font-black text-neutral-950">
                  {aboutData.process?.avgTimeValue}
                </p>
                <span className="text-[10px] text-neutral-400 font-semibold">
                  {aboutData.process?.avgTimeSub}
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {aboutData.process?.steps?.map((step: any, idx: number) => (
                  <div key={idx} className="bg-neutral-900 border border-white/5 p-4 rounded-xl flex flex-col gap-2">
                    <span className="bg-orange-main text-white font-black text-xs rounded px-2 py-0.5 w-fit">
                      {step.number}
                    </span>
                    <h5 className="text-sm font-black text-white">{step.title}</h5>
                    <p className="text-[10px] text-neutral-400 font-semibold">{step.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* CALIDAD SECTION */}
            <section className="py-8 px-4 flex flex-col gap-6 bg-white">
              <div className="bg-orange-50 border border-orange-main/30 px-3 py-1 rounded-full flex items-center self-start">
                <span className="text-[10px] font-extrabold text-orange-main uppercase tracking-wider">
                  {aboutData.quality?.pill}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-black text-neutral-950">
                  {aboutData.quality?.title}
                </h3>
                <p className="text-xs text-neutral-500 font-semibold">
                  {aboutData.quality?.description}
                </p>
              </div>
              <div className="flex flex-col gap-3">
                {aboutData.quality?.cards?.map((card: any, idx: number) => (
                  <div key={idx} className="bg-neutral-50 border border-neutral-200 p-4 rounded-xl flex flex-col gap-2">
                    <span className="text-lg">{card.icon}</span>
                    <h5 className="text-sm font-black text-neutral-950">{card.title}</h5>
                    <p className="text-[10px] text-neutral-500 font-semibold">{card.description}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-2 w-full">
                {aboutData.quality?.floatingImages?.map((img: string, idx: number) => (
                  <div key={idx} className="h-16 rounded-lg overflow-hidden border border-neutral-200">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div className="bg-orange-50/50 border border-orange-200/50 rounded-xl p-4 flex flex-col gap-3 mt-2">
                <p className="text-xs text-neutral-700 font-bold leading-relaxed">{aboutData.quality?.ctaText}</p>
                <div className="px-4 py-2 rounded-lg bg-orange-main text-white font-extrabold text-xs text-center">
                  {aboutData.quality?.ctaBtnText}
                </div>
              </div>
            </section>
            
            <Footer data={content.footer} />
          </div>
        );
      }

      case "works":
        return <WorksClient content={content} />;

      case "products":
        return (
          <div className="flex flex-col min-h-full bg-neutral-50 p-4 select-none">
            <Navbar data={content.navbar} categories={content.heroAndShowcase?.categories} />
            <div className="flex flex-col gap-4 mt-12">
              <div className="bg-orange-50 border border-orange-main/30 px-3 py-1 rounded-full flex items-center w-fit">
                <span className="text-[10px] font-extrabold text-orange-main uppercase tracking-wider">Categorías</span>
              </div>
              <h3 className="text-lg font-black text-neutral-950">Nuestros Productos</h3>
              <div className="grid grid-cols-1 gap-3">
                {content.heroAndShowcase?.categories?.map((cat: any, idx: number) => (
                  <div key={idx} className="bg-white border border-neutral-200 rounded-xl p-3.5 flex items-center gap-3.5 shadow-sm">
                    <div className="w-14 h-14 bg-neutral-100 rounded-lg flex items-center justify-center p-1.5 shrink-0 overflow-hidden">
                      {cat.thumbnail ? (
                        <img src={cat.thumbnail} alt="" className="max-h-full max-w-full object-contain" />
                      ) : (
                        <ImageIcon className="w-5 h-5 text-neutral-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${cat.isHeroFeatured ? "bg-orange-main/10 text-orange-main border border-orange-main/20" : "bg-neutral-100 text-neutral-500"}`}>
                        {cat.isHeroFeatured ? "Destacada" : "Normal"}
                      </span>
                      <h4 className="text-sm font-black text-neutral-900 mt-1 truncate">{cat.label}</h4>
                      <p className="text-[10px] text-neutral-400 font-semibold truncate mt-0.5">{cat.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "stories":
        return (
          <div className="flex flex-col min-h-full bg-neutral-50 p-2">
            <Navbar data={content.navbar} categories={content.heroAndShowcase?.categories} />
            <div className="mt-10 flex flex-col gap-6">
              <ClientLogos data={content.clientLogos} />
              <SuccessStories data={content.successStories} />
            </div>
          </div>
        );

      case "services":
        return (
          <div className="flex flex-col min-h-full bg-neutral-50">
            <Navbar data={content.navbar} categories={content.heroAndShowcase?.categories} />
            <div className="mt-12 flex flex-col gap-6">
              <Services data={content.services} />
              <FactoryTour data={content.factoryTour} />
            </div>
          </div>
        );

      case "cta":
        return (
          <div className="flex flex-col min-h-full bg-neutral-50">
            <Navbar data={content.navbar} categories={content.heroAndShowcase?.categories} />
            <div className="my-auto py-8">
              <CTASection data={{ ...content.ctaSection, logoTypo: content.navbar?.logoWhite }} />
            </div>
            <Footer data={content.footer} />
          </div>
        );

      case "faqs":
        return (
          <div className="flex flex-col min-h-full bg-neutral-50">
            <Navbar data={content.navbar} categories={content.heroAndShowcase?.categories} />
            <div className="mt-12">
              <FAQSection data={content.faqSection} />
            </div>
            <Footer data={content.footer} />
          </div>
        );

      case "contact":
        return <ContactClient content={content} />;

      default:
        return null;
    }
  };

  return (
    <div ref={containerRef} className="w-full h-screen overflow-y-auto relative flex flex-col scrollbar-none preview-device-screen">
      {/* Dynamic local scoped CSS variables */}
      <style dangerouslySetInnerHTML={{ __html: `
        .preview-device-screen {
          --background: ${content.theme?.background || "#faf9fa"};
          --foreground: ${content.theme?.foreground || "#19191a"};
          --color-neutral-50: ${content.theme?.neutral50 || "#faf9fa"};
          --color-neutral-900: ${content.theme?.neutral900 || "#19191a"};
          --color-orange-main: ${content.theme?.orangeMain || "#f68322"};
          --color-orange-50: #fff8ed;
          --color-orange-200: #fddbab;
          --color-orange-600: ${content.theme?.orange600 || "#e7630f"};
          --color-orange-700: ${content.theme?.orange700 || "#bf4b0f"};
          --color-orange-950: #421708;
          --color-red-main: ${content.theme?.redMain || "#f53722"};
          background-color: var(--background) !important;
          color: var(--foreground) !important;
        }
      `}} />
      
      {renderPreviewContent()}
    </div>
  );
}
