"use client";

import { useState } from "react";
import { Play, MapPin, X } from "lucide-react";

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
  video?: string;
  thumbnail?: string;
};

interface FactoryTourProps {
  data?: {
    subtitle?: string;
    title?: string;
    description?: string;
    video?: string;
    thumbnail?: string;
    departments?: Department[];
  };
}

const DEFAULT_VIDEOS: Record<string, string> = {
  full: "https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c054ba208d1c683b544b6796c4dcc1d7&profile_id=139&oauth2_token_id=57447761",
  diseno: "https://player.vimeo.com/external/340475355.sd.mp4?s=d00e57207dd43c7b39a3ad92a6c0b3952cc914f6&profile_id=139&oauth2_token_id=57447761",
  iluminacion: "https://player.vimeo.com/external/498424248.sd.mp4?s=3407df74e477636e2f46cf3eb9f8745dfaf53d5a&profile_id=139&oauth2_token_id=57447761",
  carpinteria: "https://player.vimeo.com/external/517616140.sd.mp4?s=82c7d9bc37f597920703f80c6c4c9e47db5d966f&profile_id=139&oauth2_token_id=57447761",
  herreria: "https://player.vimeo.com/external/538571028.sd.mp4?s=ea5c707567e7c4f4b26715f5e27a750af0e927fa&profile_id=139&oauth2_token_id=57447761",
  transporte: "https://player.vimeo.com/external/435674703.sd.mp4?s=6fdfa8cfd2979247656606f05781a7a08b5329c2&profile_id=139&oauth2_token_id=57447761",
};

export default function FactoryTour({ data }: FactoryTourProps) {
  const departments: Department[] = data?.departments || [
    {
      id: "diseno",
      name: "Diseño",
      title: "Área de Diseño Conceptual",
      desc: "Nuestros creativos adaptan los bocetos de tu marca a formatos digitales de alta fidelidad, asegurando una traslación perfecta y profesional al tamaño real.",
      img: "/assets/Fabric/Diseño.png",
      top: "278px",
      left: "407px",
      mobileTop: "134px",
      mobileLeft: "197px"
    },
    {
      id: "iluminacion",
      name: "Iluminación",
      title: "Área de Iluminación y Armado",
      desc: "Instalamos sistemas de retroiluminación LED premium de alta eficiencia para que tu marca destaque tanto de día como de noche.",
      img: "/assets/Fabric/Iluminacion.png",
      top: "236px",
      left: "625px",
      mobileTop: "114px",
      mobileLeft: "302px"
    },
    {
      id: "carpinteria",
      name: "Carpintería",
      title: "Taller de Carpintería Publicitaria",
      desc: "Fabricamos estructuras rígidas, bastidores de madera y stands a medida para exposiciones interiores y colocación de marquesinas.",
      img: "/assets/Fabric/carpinteria.png",
      top: "174px",
      left: "206px",
      mobileTop: "84px",
      mobileLeft: "100px"
    },
    {
      id: "herreria",
      name: "Herrería",
      title: "Herrería y Estructuras de Soporte",
      desc: "Forjamos y soldamos chasis metálicos reforzados, perfiles de hierro y soportes estructurales de alta resistencia para cartelería exterior.",
      img: "/assets/Fabric/herreria.png",
      top: "62px",
      left: "492px",
      mobileTop: "30px",
      mobileLeft: "238px"
    },
    {
      id: "transporte",
      name: "Transporte",
      title: "Logística y Montaje Final",
      desc: "Contamos con flota propia equipada y técnicos altamente calificados para realizar el traslado seguro e instalación en tu local comercial.",
      img: "/assets/Fabric/Transporte.png",
      top: "324px",
      left: "24px",
      mobileTop: "156px",
      mobileLeft: "12px"
    }
  ];

  const subtitle = data?.subtitle || "Conoce nuestra fábrica";
  const title = data?.title || "Producción propia de punta a punta";
  const description = data?.description || "Contamos con producción propia, lo que nos permite garantizar el control total de calidad y los mejores precios del mercado.";

  const [activeId, setActiveId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentDept = departments.find((d) => d.id === (hoveredId || activeId));
  const activeImgId = hoveredId || activeId;

  const activeVideoUrl = currentDept 
    ? (currentDept.video || DEFAULT_VIDEOS[currentDept.id])
    : (data?.video || DEFAULT_VIDEOS.full);

  const currentThumbnail = currentDept
    ? (currentDept.thumbnail || currentDept.img)
    : (data?.thumbnail || "/assets/Fabric/full.png");

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
              <button
                onClick={() => setActiveId(null)}
                onMouseEnter={() => setHoveredId(null)}
                className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-bold cursor-pointer transition-all duration-200 ${activeId === null
                  ? "bg-orange-main text-white shadow-md shadow-orange-main/15"
                  : "bg-orange-200/30 text-orange-950 hover:bg-orange-200/50"
                  }`}
              >
                Planta Completa
              </button>
              {departments.map((dept) => (
                <button
                  key={dept.id}
                  onClick={() => setActiveId(activeId === dept.id ? null : dept.id)}
                  onMouseEnter={() => setHoveredId(dept.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-bold cursor-pointer transition-all duration-200 ${activeId === dept.id
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
                {currentDept ? currentDept.title : title}
              </h3>
              <p className="text-sm md:text-base text-orange-950 leading-relaxed transition-all duration-300 font-medium font-medium">
                {currentDept ? currentDept.desc : description}
              </p>
            </div>

            {/* Mini active mockup display */}
            <div 
              onClick={() => setIsPlaying(true)}
              className="w-full h-[180px] overflow-hidden rounded-xl bg-orange-100 relative group border border-orange-200/40 cursor-pointer"
            >
              <img
                src={currentThumbnail}
                alt={currentDept ? currentDept.name : "Fábrica Completa"}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/10 flex items-center justify-center transition-colors group-hover:bg-black/25">
                <div className="p-3 bg-white/70 backdrop-blur-sm rounded-full shadow-lg transform transition-all group-hover:scale-110">
                  <Play className="w-6 h-6 text-neutral-900 fill-neutral-900" />
                </div>
              </div>
            </div>

          </div>

          {/* Right Side: Factory Blueprint with Hotspots */}
          <div className="lg:col-span-8 bg-neutral-900/5 rounded-2xl border border-neutral-200/40 overflow-hidden flex items-center justify-center p-4 min-h-[300px] md:min-h-[511px] relative select-none">

            {/* Aspect container keeping figma proportions */}
            <div className="relative w-full max-w-[868px] aspect-[868/511] overflow-hidden rounded-xl border border-neutral-200/60 shadow-inner">

              {/* Base Layout Image */}
              <img
                src="/assets/Fabric/full.png"
                alt="Factory Map"
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Glowing active layer highlight (Optional based on which is active) */}
              <div className="absolute inset-0 pointer-events-none transition-opacity duration-300">
                {departments.map((dept) => {
                  const isVisible = activeImgId === dept.id;
                  return (
                    <img
                      key={dept.id}
                      src={dept.img}
                      alt={dept.name}
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out ${isVisible ? "opacity-100" : "opacity-0"
                        }`}
                    />
                  );
                })}
              </div>

              {/* Hotspot Markers (Desktop Coord) */}
              {departments.map((dept) => {
                const isHighlighted = activeImgId === dept.id;
                return (
                  <button
                    key={dept.id}
                    onClick={() => setActiveId(activeId === dept.id ? null : dept.id)}
                    onMouseEnter={() => setHoveredId(dept.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    style={{
                      top: dept.top,
                      left: dept.left,
                    }}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                    aria-label={`Select ${dept.name}`}
                  >
                    {/* Hotspot pulse rings */}
                    <span className={`absolute inline-flex h-9 w-9 rounded-full bg-orange-main/30 animate-ping duration-1500 ${isHighlighted ? "opacity-100" : "opacity-30 group-hover:opacity-100"
                      }`} />
                    <span className={`relative inline-flex rounded-full h-9 w-9 bg-orange-main hover:bg-orange-600 border-2 border-white shadow-lg items-center justify-center transition-all ${isHighlighted ? "shadow-orange-main/50" : ""
                      }`}>
                      {/* Hotspot Inner Symbol */}
                      <MapPin className="w-4 h-4 text-white fill-white" />
                    </span>

                    {/* Tooltip */}
                    <span className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-neutral-900 text-white text-xs px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap shadow-md z-30">
                      {dept.name}
                    </span>
                  </button>
                );
              })}

            </div>

          </div>

        </div>

      </div>

      {/* Video Lightbox Modal */}
      {isPlaying && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-all duration-300"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop Click */}
          <div 
            className="absolute inset-0 cursor-pointer" 
            onClick={() => setIsPlaying(false)}
          />
          
          {/* Content container */}
          <div className="relative w-full max-w-[380px] aspect-[9/16] max-h-[85vh] bg-neutral-950 rounded-3xl overflow-hidden shadow-2xl border border-white/10 z-10 transform scale-100 transition-all">
            {/* Close button */}
            <button
              onClick={() => setIsPlaying(false)}
              className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-neutral-900/80 text-white hover:text-orange-main rounded-full backdrop-blur-md transition-all z-20 cursor-pointer border border-white/10"
              aria-label="Cerrar video"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Video Player */}
            {activeVideoUrl ? (
              <video
                src={activeVideoUrl}
                className="w-full h-full object-cover"
                controls
                autoPlay
                loop
                playsInline
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-400">
                No hay video disponible para esta sección.
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
