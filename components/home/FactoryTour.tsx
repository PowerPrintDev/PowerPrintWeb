"use client";

import { useState } from "react";
import { Play, MapPin } from "lucide-react";

type Department = {
  id: string;
  name: string;
  title: string;
  desc: string;
  img: string;
  // Hotspot coordinates on the 867x511 layout (relative to parents)
  top: string;
  left: string;
  // Coordinates for mobile scale
  mobileTop: string;
  mobileLeft: string;
};

interface FactoryTourProps {
  data?: {
    subtitle?: string;
    title?: string;
    description?: string;
    departments?: Department[];
  };
}

export default function FactoryTour({ data }: FactoryTourProps) {
  const departments: Department[] = data?.departments || [
    {
      id: "diseno",
      name: "Diseño",
      title: "Área de Diseño Conceptual",
      desc: "Nuestros creativos adaptan los bocetos de tu marca a formatos digitales de alta fidelidad, asegurando una traslación perfecta y profesional al tamaño real.",
      img: "/assets/186f19f99da670a0c87377b2f1b1c17233cb7e79.png", // Capa 7
      top: "174px",
      left: "206px",
      mobileTop: "84px",
      mobileLeft: "100px"
    },
    {
      id: "impresion",
      name: "Impresión",
      title: "Área de Impresión de Gran Formato",
      desc: "Maquinaria de última generación estampa tintas de alta duración y resistencia UV sobre lonas, vinilos, acrílicos y soportes rígidos.",
      img: "/assets/ec1fd429d5a47b9f45735f34b25eff014d835a8b.png", // Capa 8
      top: "62px",
      left: "492px",
      mobileTop: "30px",
      mobileLeft: "238px"
    },
    {
      id: "carpinteria",
      name: "Carpintería",
      title: "Taller de Carpintería Publicitaria",
      desc: "Fabricamos estructuras rígidas, bastidores de madera y stands a medida para exposiciones interiores y colocación de marquesinas.",
      img: "/assets/39e974e38ca5ad5a392cb39e57ca0e1605a1929e.png", // Capa 9
      top: "278px",
      left: "407px",
      mobileTop: "134px",
      mobileLeft: "197px"
    },
    {
      id: "herreria",
      name: "Herrería",
      title: "Herrería y Estructuras de Soporte",
      desc: "Forjamos y soldamos chasis metálicos reforzados, perfiles de hierro y soportes estructurales de alta resistencia para cartelería exterior.",
      img: "/assets/875428c385668a49d9dd8ba3cf81580739e3d7b7.png", // Capa 10
      top: "236px",
      left: "625px",
      mobileTop: "114px",
      mobileLeft: "302px"
    },
    {
      id: "transporte",
      name: "Transporte",
      title: "Logística y Montaje Final",
      desc: "Contamos con flota propia equipada y técnicos altamente calificados para realizar el traslado seguro e instalación en tu local comercial.",
      img: "/assets/91fe9e72102bf97f7a0b2c6a1250358c294103ae.png", // Capa 11
      top: "324px",
      left: "24px",
      mobileTop: "156px",
      mobileLeft: "12px"
    }
  ];

  const subtitle = data?.subtitle || "Conoce nuestra fábrica";
  const title = data?.title || "Producción propia de punta a punta";
  const description = data?.description || "Contamos con producción propia, lo que nos permite garantizar el control total de calidad y los mejores precios del mercado.";

  const [activeId, setActiveId] = useState(departments[4]?.id || "transporte");

  const current = departments.find((d) => d.id === activeId) || departments[0] || departments[4];

  return (
    <section className="w-full py-16 px-4 md:px-24 bg-white/20 backdrop-blur-md relative overflow-clip border-b border-orange-200/20">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        
        {/* Title */}
        <div className="flex flex-col gap-2">
          <span className="text-sm font-extrabold uppercase tracking-widest text-orange-main select-none">
            {subtitle}
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-neutral-900 leading-tight">
            {title}
          </h2>
          <p className="text-base md:text-lg text-neutral-500 max-w-2xl leading-relaxed">
            {description}
          </p>
        </div>

        {/* Interactive Layout Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Side Panel: Interactive Detail Card */}
          <div className="lg:col-span-4 flex flex-col bg-orange-50/90 border border-orange-200/50 p-6 md:p-8 rounded-2xl shadow-xl justify-between min-h-[400px]">
            
            {/* Tabs for mobile select or quick click */}
            <div className="flex flex-wrap gap-2 pb-4 border-b border-orange-200/30">
              {departments.map((dept) => (
                <button
                  key={dept.id}
                  onClick={() => setActiveId(dept.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-bold cursor-pointer transition-all duration-200 ${
                    activeId === dept.id
                      ? "bg-orange-main text-white shadow-md shadow-orange-main/15"
                      : "bg-orange-200/30 text-orange-950 hover:bg-orange-200/50"
                  }`}
                >
                  {dept.name}
                </button>
              ))}
            </div>

            {/* Department Details */}
            <div className="flex-1 flex flex-col justify-center py-6 gap-3">
              <h3 className="text-xl md:text-2xl font-black text-neutral-950 leading-tight transition-all duration-300">
                {current.title}
              </h3>
              <p className="text-sm md:text-base text-orange-950 leading-relaxed transition-all duration-300 font-medium">
                {current.desc}
              </p>
            </div>

            {/* Mini active mockup display */}
            <div className="w-full h-[180px] overflow-hidden rounded-xl bg-orange-100 relative group border border-orange-200/40">
              <img
                src={current.img}
                alt={current.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                <div className="p-3 bg-white/70 backdrop-blur-sm rounded-full shadow-lg transform group-hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 text-neutral-900 fill-neutral-900" />
                </div>
              </div>
            </div>

          </div>

          {/* Right Side: Factory Blueprint with Hotspots */}
          <div className="lg:col-span-8 bg-neutral-900/5 rounded-2xl border border-neutral-200/40 overflow-hidden flex items-center justify-center p-4 min-h-[300px] md:min-h-[511px] relative select-none">
            
            {/* Aspect container keeping figma proportions */}
            <div className="relative w-full max-w-[868px] aspect-[868/511] overflow-hidden rounded-xl border border-neutral-200/60 shadow-inner">
              
              {/* Base Layout Images (Factory Floor) */}
              <img
                src="/assets/a2ab3bb8a0f5466bbe2bcab46a69f45a3aa32be7.png"
                alt="Factory Map"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <img
                src="/assets/218df5a64ac50bbf60f7e96746b6928d9dd8e8c9.png"
                alt="Factory Grid Overlay"
                className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60"
              />

              {/* Glowing active layer highlight (Optional based on which is active) */}
              <div className="absolute inset-0 pointer-events-none transition-opacity duration-300">
                {departments.map((dept) => (
                  <img
                    key={dept.id}
                    src={dept.img}
                    alt=""
                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-in-out ${
                      activeId === dept.id ? "opacity-100 scale-100" : "opacity-0 scale-95"
                    }`}
                  />
                ))}
              </div>

              {/* Hotspot Markers (Desktop Coord) */}
              {departments.map((dept) => (
                <button
                  key={dept.id}
                  onClick={() => setActiveId(dept.id)}
                  style={{
                    top: dept.top,
                    left: dept.left,
                  }}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                  aria-label={`Select ${dept.name}`}
                >
                  {/* Hotspot pulse rings */}
                  <span className={`absolute inline-flex h-9 w-9 rounded-full bg-orange-main/30 animate-ping duration-1500 ${
                    activeId === dept.id ? "opacity-100" : "opacity-30 group-hover:opacity-100"
                  }`} />
                  <span className={`relative inline-flex rounded-full h-9 w-9 bg-orange-main hover:bg-orange-600 border-2 border-white shadow-lg items-center justify-center transition-all ${
                    activeId === dept.id ? "scale-110 shadow-orange-main/50" : "scale-100"
                  }`}>
                    {/* Hotspot Inner Symbol */}
                    <MapPin className="w-4 h-4 text-white fill-white" />
                  </span>
                  
                  {/* Tooltip */}
                  <span className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-neutral-900 text-white text-xs px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap shadow-md z-30">
                    {dept.name}
                  </span>
                </button>
              ))}

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
