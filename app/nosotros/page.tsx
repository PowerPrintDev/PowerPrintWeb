import fs from "fs/promises";
import path from "path";
import Navbar from "@/components/home/Navbar";
import Stats from "@/components/home/Stats";
import CTASection from "@/components/home/CTASection";
import Footer from "@/components/home/Footer";
import { MessageCircle, ArrowUpRight } from "lucide-react";

export const dynamic = "force-dynamic";

async function getContent() {
  try {
    const filePath = path.join(process.cwd(), "data", "content.json");
    const fileContent = await fs.readFile(filePath, "utf8");
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Error loading content.json in Nosotros page, using defaults.", error);
    return null;
  }
}

export default async function Nosotros() {
  const content = await getContent();
  const aboutData = content?.aboutPage || {
    hero: {
      pill: "Quiénes somos",
      title: "Fabricamos la identidad\nvisual de *tu marca*",
      subtitle: "Somos fabricantes directos de carteles luminosos, letras de acrílico, metal y madera. Más de 15 años garantizando calidad y el mejor precio porque somos el origen.",
      worksLabel: "Trabajos",
      worksHref: "#trabajos",
      contactLabel: "Contactar",
      contactHref: "/contacto"
    },
    stats: [
      { value: "+27 años", description: "de experiencia en el mercado" },
      { value: "+2.000", description: "proyectos completados" },
      { value: "100%", description: "fabricación propia" },
      { value: "Todo el país", description: "envíos a toda Argentina" }
    ],
    history: {
      pill: "Historia y Valores",
      title: "Nuestra historia",
      description: "Power Print nació de la pasión por transformar ideas en piezas que cobran vida en cualquier espacio. Desde el primer día somos fabricantes directos: controlamos el diseño, la producción y los materiales.",
      valuesTitle: "Nuestros valores",
      values: [
        "⚡  Fabricación 100% propia, sin intermediarios",
        "🎯  Precisión y control de calidad en cada pieza",
        "🤝  Compromiso con los plazos y con el cliente",
        "💡  Innovación constante en materiales y técnicas"
      ],
      image: "/assets/39e974e38ca5ad5a392cb39e57ca0e1605a1929e.png",
      imageLabel: "Historia de Power Print"
    },
    process: {
      pill: "Proceso de Fabricación",
      title: "De tu idea al producto terminado",
      description: "Un proceso claro y transparente para que tu proyecto llegue en tiempo y forma con la calidad que nos define.",
      avgTimeTitle: "Tiempo promedio de producción",
      avgTimeValue: "5 a 10 días hábiles",
      avgTimeSub: "según el tipo y escala del proyecto",
      steps: [
        { number: "01", title: "Consulta y presupuesto", description: "Analizamos tu necesidad y enviamos presupuesto detallado sin costo." },
        { number: "02", title: "Diseño y aprobación", description: "Creamos el arte final y esperamos tu confirmación antes de producir." },
        { number: "03", title: "Fabricación", description: "Producimos en nuestra planta con materiales de primera calidad." },
        { number: "04", title: "Control de calidad", description: "Cada pieza es inspeccionada antes de ser embalada para el despacho." },
        { number: "05", title: "Envío e instalación", description: "Despachamos en todo el país e instalamos en el área metropolitana." }
      ]
    },
    quality: {
      pill: "Calidad y Certificaciones",
      title: "Calidad que se ve, se siente y dura",
      description: "Cada producto que sale de nuestra fábrica pasa por un riguroso control. No hay atajos.",
      cards: [
        { icon: "🔬", title: "Materiales certificados", description: "Solo trabajamos con proveedores que cumplen estándares internacionales de resistencia y durabilidad." },
        { icon: "🛡️", title: "Garantía en todos nuestros productos", description: "Todos nuestros carteles y letras tienen garantía de fabricación. Respondemos ante cualquier defecto." },
        { icon: "⚙️", title: "Maquinaria de última generación", description: "Cortadoras láser, impresoras UV y equipos CNC que garantizan precisión milimétrica en cada pieza." },
        { icon: "✅", title: "Revisión antes del despacho", description: "Cada pedido es fotografiado y revisado. El cliente recibe exactamente lo que aprobó." }
      ],
      floatingImages: [
        "/assets/47b1327b704ce6f68873f4bfd6d23ff098806982.png",
        "/assets/b1c41062b620e92fe7726e0274f898671941126c.png",
        "/assets/67f0e9cafad48b51ae943ed51f2c03b933ee477a.png"
      ],
      ctaText: "¿Querés conocer más sobre nuestro proceso de calidad? Visitá nuestra fábrica o contactanos para una asesoría sin cargo.",
      ctaBtnText: "Solicitar visita",
      ctaBtnHref: "/contacto"
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

  return (
    <div className="min-h-screen w-full flex flex-col font-sans antialiased bg-gradient-to-t from-neutral-50 via-neutral-50 to-orange-100/30 overflow-x-clip selection:bg-orange-200/80 selection:text-orange-950">
      
      {/* Navigation Header */}
      <Navbar data={content?.navbar} categories={content?.heroAndShowcase?.categories} />

      <main className="flex-1 w-full flex flex-col items-center">
        
        {/* HERO SECTION */}
        <section className="w-full max-w-7xl mx-auto px-6 pt-24 pb-16 md:pt-32 md:pb-24 flex flex-col items-center gap-8 text-center select-none">
          <div className="bg-orange-50 border border-orange-main/30 px-4 py-1.5 rounded-full flex items-center shrink-0">
            <span className="text-xs font-extrabold text-orange-main uppercase tracking-wider">
              {aboutData.hero.pill}
            </span>
          </div>
          
          <h1 className="max-w-[1100px] text-center font-black leading-[1.1] text-4xl md:text-[80px] lg:text-[90px] text-neutral-900 tracking-tight">
            {parseTitle(aboutData.hero.title)}
          </h1>

          <p className="max-w-[780px] text-sm md:text-lg text-neutral-500 font-semibold leading-relaxed mt-2">
            {aboutData.hero.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md mt-4">
            <a
              href={aboutData.hero.worksHref}
              className="w-full sm:w-[200px] py-3.5 flex items-center justify-center font-bold text-base rounded-xl bg-neutral-200 text-neutral-900 hover:bg-neutral-300 transition-colors duration-200"
            >
              {aboutData.hero.worksLabel}
            </a>
            <a
              href={aboutData.hero.contactHref}
              className="w-full sm:w-[200px] py-3.5 flex items-center justify-center gap-2 font-bold text-base rounded-xl bg-orange-main text-white hover:opacity-95 shadow-lg shadow-orange-main/20 transition-all duration-200"
            >
              <MessageCircle className="w-5 h-5 text-white" />
              {aboutData.hero.contactLabel}
            </a>
          </div>
        </section>

        {/* REUSABLE STATS COMPONENT */}
        <Stats stats={aboutData.stats} />

        {/* HISTORIA Y VALORES SECTION */}
        <section className="w-full max-w-7xl mx-auto px-6 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Text Content */}
          <div className="lg:col-span-7 flex flex-col gap-6 items-start">
            <div className="bg-orange-50 border border-orange-main/30 px-4 py-1.5 rounded-full flex items-center">
              <span className="text-xs font-extrabold text-orange-main uppercase tracking-wider">
                {aboutData.history.pill}
              </span>
            </div>

            <div className="flex flex-col gap-3">
              <h2 className="text-2xl md:text-3xl font-black text-neutral-950">
                {aboutData.history.title}
              </h2>
              <p className="text-sm md:text-base text-neutral-600 font-medium leading-relaxed max-w-[620px]">
                {aboutData.history.description}
              </p>
            </div>

            <div className="w-full h-px bg-neutral-200 my-2" />

            <div className="flex flex-col gap-4">
              <h3 className="text-xl font-extrabold text-orange-main">
                {aboutData.history.valuesTitle}
              </h3>
              <div className="flex flex-col gap-3 text-sm md:text-base text-neutral-700 font-bold leading-relaxed">
                {aboutData.history.values.map((val: string, idx: number) => (
                  <p key={idx} className="flex items-center gap-2">
                    {val}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Image Card */}
          <div className="lg:col-span-5 w-full flex flex-col items-center">
            <div className="w-full h-[400px] md:h-[460px] bg-orange-50/50 border border-orange-200/50 rounded-[24px] overflow-hidden flex items-center justify-center p-3 relative shadow-xl shadow-orange-950/5 group">
              {aboutData.history.image ? (
                <img
                  src={aboutData.history.image}
                  alt={aboutData.history.imageLabel}
                  className="w-full h-full object-cover rounded-[16px] transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="text-center p-6">
                  <span className="text-4xl block mb-2">📸</span>
                  <p className="text-sm font-bold text-neutral-400">Foto de Fábrica / Equipo</p>
                </div>
              )}
            </div>
            {aboutData.history.imageLabel && (
              <span className="text-xs text-neutral-400 font-bold mt-3 block tracking-wide uppercase">
                {aboutData.history.imageLabel}
              </span>
            )}
          </div>
        </section>

        {/* PROCESO DE FABRICACIÓN SECTION */}
        <section className="w-full bg-neutral-100/50 border-y border-neutral-200/50 py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-6 flex flex-col gap-12">
            
            {/* Section Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="flex flex-col gap-4 items-start max-w-[660px]">
                <div className="bg-orange-50 border border-orange-main/30 px-4 py-1.5 rounded-full flex items-center">
                  <span className="text-xs font-extrabold text-orange-main uppercase tracking-wider">
                    {aboutData.process.pill}
                  </span>
                </div>
                <h2 className="text-3xl font-black text-neutral-950">
                  {aboutData.process.title}
                </h2>
                <p className="text-sm md:text-base text-neutral-500 font-semibold leading-relaxed">
                  {aboutData.process.description}
                </p>
              </div>

              {/* Time card */}
              <div className="bg-white border border-neutral-200 p-6 rounded-[16px] shadow-sm flex flex-col gap-2 w-full lg:w-[310px] shrink-0">
                <span className="text-xs text-neutral-500 font-bold uppercase tracking-wider">
                  {aboutData.process.avgTimeTitle}
                </span>
                <p className="text-xl md:text-2xl font-black text-neutral-950">
                  {aboutData.process.avgTimeValue}
                </p>
                <span className="text-xs text-neutral-400 font-semibold">
                  {aboutData.process.avgTimeSub}
                </span>
              </div>
            </div>

            {/* Steps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {aboutData.process.steps.map((step: any, idx: number) => (
                <div
                  key={idx}
                  className="bg-neutral-900 border border-white/5 p-6 rounded-2xl flex flex-col gap-4 hover:border-orange-main/30 hover:bg-neutral-900/95 transition-all duration-300 group"
                >
                  <div className="bg-orange-main text-white font-black text-sm rounded-lg flex items-center justify-center shrink-0 w-9 h-9 shadow-lg shadow-orange-main/15">
                    {step.number}
                  </div>
                  <h4 className="text-lg font-black text-white group-hover:text-orange-main transition-colors duration-300">
                    {step.title}
                  </h4>
                  <p className="text-xs text-neutral-400 font-semibold leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CALIDAD Y CERTIFICACIONES SECTION */}
        <section className="w-full bg-white py-16 md:py-24 relative overflow-hidden">
          {/* Symmetrical stacked rotated photos on the far right (desktop only) */}
          <div className="hidden xl:block absolute right-0 top-1/2 -translate-y-1/2 w-[400px] h-[500px] pointer-events-none z-0">
            {/* Muestra 04 */}
            {aboutData.quality.floatingImages?.[2] && (
              <div 
                className="absolute top-[50px] right-[100px] w-[220px] h-[250px] rounded-2xl shadow-2xl border border-white/80 overflow-hidden transform rotate-[1.02deg] transition-transform duration-500 hover:scale-105"
                style={{ zIndex: 12 }}
              >
                <img src={aboutData.quality.floatingImages[2]} alt="" className="w-full h-full object-cover" />
              </div>
            )}
            
            {/* Muestra 02 */}
            {aboutData.quality.floatingImages?.[0] && (
              <div 
                className="absolute top-[160px] right-[40px] w-[220px] h-[250px] rounded-2xl shadow-2xl border border-white/80 overflow-hidden transform rotate-[14.95deg] transition-transform duration-500 hover:scale-105"
                style={{ zIndex: 13 }}
              >
                <img src={aboutData.quality.floatingImages[0]} alt="" className="w-full h-full object-cover" />
              </div>
            )}

            {/* Muestra 03 */}
            {aboutData.quality.floatingImages?.[1] && (
              <div 
                className="absolute top-[280px] right-[120px] w-[220px] h-[250px] rounded-2xl shadow-2xl border border-white/80 overflow-hidden transform rotate-[-16.11deg] transition-transform duration-500 hover:scale-105"
                style={{ zIndex: 14 }}
              >
                <img src={aboutData.quality.floatingImages[1]} alt="" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col gap-12">
            
            {/* Section Header */}
            <div className="flex flex-col gap-4 items-start max-w-[820px]">
              <div className="bg-orange-50 border border-orange-main/30 px-4 py-1.5 rounded-full flex items-center">
                <span className="text-xs font-extrabold text-orange-main uppercase tracking-wider">
                  {aboutData.quality.pill}
                </span>
              </div>
              <h2 className="text-3xl font-black text-neutral-950">
                {aboutData.quality.title}
              </h2>
              <p className="text-sm md:text-base text-neutral-500 font-semibold leading-relaxed">
                {aboutData.quality.description}
              </p>
            </div>

            {/* Quality Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 xl:pr-[280px]">
              {aboutData.quality.cards.map((card: any, idx: number) => (
                <div
                  key={idx}
                  className="bg-neutral-50 border border-neutral-200 p-6 rounded-2xl flex flex-col gap-4 hover:shadow-md hover:bg-neutral-50/80 transition-all duration-300 group"
                >
                  <div className="bg-orange-100/50 text-orange-main text-xl rounded-full flex items-center justify-center shrink-0 w-12 h-12">
                    {card.icon}
                  </div>
                  <h4 className="text-lg font-black text-neutral-950 group-hover:text-orange-main transition-colors duration-300">
                    {card.title}
                  </h4>
                  <p className="text-xs md:text-sm text-neutral-500 font-semibold leading-relaxed">
                    {card.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Mobile/Tablet image grid (hidden on large desktop) */}
            <div className="xl:hidden grid grid-cols-3 gap-4 w-full mt-4">
              {aboutData.quality.floatingImages?.map((img: string, idx: number) => (
                <div key={idx} className="h-40 rounded-xl overflow-hidden shadow border border-white">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>

            {/* Bottom Quality CTA Banner */}
            <div className="bg-orange-50/50 border border-orange-200/50 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6 mt-4 shadow-sm">
              <p className="text-sm md:text-base text-neutral-700 font-bold text-center md:text-left leading-relaxed">
                {aboutData.quality.ctaText}
              </p>
              <a
                href={aboutData.quality.ctaBtnHref}
                className="px-6 py-3 rounded-full bg-orange-main text-white font-extrabold text-sm md:text-base hover:opacity-95 shadow-lg shadow-orange-main/10 flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap active:scale-95"
              >
                <span>{aboutData.quality.ctaBtnText}</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>

          </div>
        </section>

        {/* CALL TO ACTION SECTION */}
        <CTASection data={{ ...content?.ctaSection, logoTypo: content?.navbar?.logoWhite }} />

      </main>

      {/* FOOTER SECTION */}
      <Footer data={content?.footer} />
      
    </div>
  );
}
