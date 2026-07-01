"use client";

import Link from "next/link";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import CTASection from "@/components/home/CTASection";
import Testimonials from "@/components/home/Testimonials";
import { ArrowUpRight, MessageCircle } from "lucide-react";

interface Category {
  id: string;
  label: string;
  title: string;
  description: string;
  thumbnail?: string;
  heroImageTransparent?: string;
  heroImageSupport?: string;
  isHeroFeatured?: boolean;
}

interface ProductsClientProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any;
}

export default function ProductsClient({ content }: ProductsClientProps) {
  const categories: Category[] = content?.heroAndShowcase?.categories || [];

  // Find the featured category, fallback to first if none is flagged
  const featuredCategory = categories.find(c => c.isHeroFeatured) || categories[0];
  
  // Filter out the featured category for the grid
  const bentoCategories = categories.filter(c => c.id !== featuredCategory?.id);

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

  const getGridClass = (index: number) => {
    const classes = [
      "md:col-span-7 h-[380px]",
      "md:col-span-5 h-[380px]",
      "md:col-span-5 h-[380px]",
      "md:col-span-7 h-[380px]"
    ];
    return classes[index % classes.length];
  };

  const getCategorySlug = (cat: any) => {
    if (cat.slug) return cat.slug;
    return cat.id
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-");
  };

  return (
    <div className="min-h-screen w-full flex flex-col font-sans antialiased bg-gradient-to-t from-neutral-50 via-neutral-50 to-orange-100/30 overflow-x-clip selection:bg-orange-200/80 selection:text-orange-950">
      
      {/* Navigation Header */}
      <Navbar data={content?.navbar} categories={content?.heroAndShowcase?.categories} />

      <main className="flex-1 w-full flex flex-col items-center">
        
        {/* HERO SECTION - FEATURED PRODUCT */}
        {featuredCategory && (
          <section className="w-full max-w-7xl mx-auto px-6 pt-16 pb-20 md:pt-24 md:pb-28 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Slogan, title and description */}
            <div className="lg:col-span-7 flex flex-col items-start gap-6 text-left select-none order-2 lg:order-1">
              <div className="bg-orange-50 border border-orange-main/30 px-4 py-1.5 rounded-full flex items-center shrink-0">
                <span className="text-xs font-extrabold text-orange-main uppercase tracking-wider">
                  Producto Destacado
                </span>
              </div>

              <h1 className="max-w-[650px] font-black leading-[1.1] text-4xl md:text-[64px] lg:text-[76px] text-neutral-900 tracking-tight">
                {parseTitle(featuredCategory.title || featuredCategory.label)}
              </h1>

              <p className="max-w-[580px] text-sm md:text-lg text-neutral-500 font-semibold leading-relaxed mt-2">
                {featuredCategory.description}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mt-6">
                <Link
                  href={`/productos/${getCategorySlug(featuredCategory)}`}
                  className="w-full sm:w-[220px] py-4 flex items-center justify-center font-bold text-lg rounded-xl bg-neutral-200 text-neutral-900 hover:bg-neutral-300 transition-all duration-200 shadow-md text-center active:scale-95 cursor-pointer"
                >
                  Ver detalles
                </Link>
                <Link
                  href="/contacto"
                  className="w-full sm:w-[220px] py-4 flex items-center justify-center gap-2 font-bold text-lg rounded-xl bg-orange-main text-white hover:opacity-95 shadow-lg shadow-orange-main/20 transition-all duration-200 text-center active:scale-95 cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5 text-white" />
                  Presupuesto
                </Link>
              </div>
            </div>

            {/* Right Column: Layered composition of transparent and support images */}
            <div className="lg:col-span-5 flex justify-center items-center relative h-[350px] md:h-[450px] w-full order-1 lg:order-2">
              
              {/* Background Glow */}
              <div className="absolute w-[250px] h-[250px] md:w-[350px] md:h-[350px] bg-orange-main/15 rounded-full filter blur-[80px] -z-10 animate-pulse" />

              {/* Layer 1: Support Image (Rotated background card) */}
              {featuredCategory.heroImageSupport && (
                <div className="absolute w-[240px] h-[240px] md:w-[320px] md:h-[320px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white transform rotate-6 translate-x-8 -translate-y-4 hover:rotate-2 hover:scale-[1.01] transition-all duration-500 ease-out z-10">
                  <img
                    src={featuredCategory.heroImageSupport}
                    alt={`${featuredCategory.label} support`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-neutral-950/10" />
                </div>
              )}

              {/* Layer 2: Transparent foreground image */}
              {featuredCategory.heroImageTransparent && (
                <div className="absolute w-[220px] h-[220px] md:w-[300px] md:h-[300px] rounded-3xl overflow-hidden transform -rotate-6 -translate-x-12 translate-y-6 hover:rotate-0 hover:scale-105 transition-all duration-500 ease-out z-20 flex justify-center items-center drop-shadow-[0_20px_35px_rgba(246,131,34,0.3)]">
                  <img
                    src={featuredCategory.heroImageTransparent}
                    alt={`${featuredCategory.label} transparent`}
                    className="w-full h-full object-contain filter select-none pointer-events-none"
                  />
                </div>
              )}

            </div>
          </section>
        )}

        {/* BENTO GRID SECTION - ALL PRODUCTS */}
        <section className="w-full max-w-7xl mx-auto px-6 pb-28 flex flex-col gap-10">
          <div className="flex flex-col gap-2">
            <div className="bg-orange-50 border border-orange-main/20 px-3 py-1 rounded-full flex items-center shrink-0 w-fit">
              <span className="text-[10px] font-extrabold text-orange-main uppercase tracking-wider">
                Nuestras Líneas
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-neutral-900 tracking-tight leading-none">
              Explora todos nuestros productos
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full">
            {bentoCategories.map((category, idx) => (
              <div
                key={category.id}
                className={`${getGridClass(idx)} rounded-3xl border border-neutral-200/50 shadow-lg overflow-hidden relative group`}
              >
                
                {/* Background Image */}
                {category.thumbnail && (
                  <div className="absolute inset-0 z-0 overflow-hidden">
                    <img
                      src={category.thumbnail}
                      alt={category.label}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    {/* Shadow overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-neutral-950/20 group-hover:from-neutral-950 group-hover:via-neutral-950/70 transition-all duration-300" />
                  </div>
                )}

                {/* Content Overlay */}
                <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 md:p-8 text-white select-none gap-3">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-orange-main">
                    Línea de producción
                  </span>
                  
                  <h3 className="text-2xl md:text-3xl font-black tracking-tight leading-tight group-hover:text-orange-main transition-colors duration-200">
                    {category.label}
                  </h3>

                  <p className="text-sm text-neutral-300 font-semibold leading-relaxed max-w-md transform translate-y-2 opacity-90 group-hover:translate-y-0 transition-all duration-300">
                    {category.description}
                  </p>

                  <div className="mt-2 flex items-center">
                    <Link
                      href={`/productos/${getCategorySlug(category)}`}
                      className="flex items-center gap-1.5 text-sm font-extrabold text-white group-hover:text-orange-main transition-all cursor-pointer"
                    >
                      <span>Ver detalles</span>
                      <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </section>

        {/* Testimonials Section */}
        <Testimonials testimonials={content?.worksPage?.testimonials} header={content?.worksPage?.testimonialHeader} />

        {/* CTA Section */}
        <CTASection data={{ ...content?.ctaSection, logoTypo: content?.navbar?.logoWhite }} />

      </main>

      {/* Footer */}
      <Footer data={content?.footer} />

    </div>
  );
}
