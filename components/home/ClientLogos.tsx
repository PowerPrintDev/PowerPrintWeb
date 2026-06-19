"use client";

interface ClientLogosProps {
  data?: {
    title?: string;
    description?: string;
    logos?: { src: string; alt: string; width: number }[];
  };
}

export default function ClientLogos({ data }: ClientLogosProps) {
  const logos = data?.logos || [
    { src: "/assets/251feb82890955089f33f0444a853122d80c9e0d.png", alt: "Client Logo 1", width: 96 },
    { src: "/assets/0105aecbaaa703ae13644d8e3c7ac75390f947a9.png", alt: "Client Logo 2", width: 111 },
    { src: "/assets/da03228ad1d2d05e464fe00db4b9fcdb842ee773.png", alt: "Client Logo 3", width: 189 },
    { src: "/assets/d5ba096747838f29ae11487293a638d3704d43c6.png", alt: "Client Logo 4", width: 127 },
    { src: "/assets/628d0b757003e98f9427c645354850f34e309611.png", alt: "Client Logo 5", width: 120 },
    { src: "/assets/e2ab0b2b4fd4ec86e24ad6de94258101e4cc801c.png", alt: "Client Logo 6", width: 105 },
    { src: "/assets/bc9f4d73718cbe673df90ed2e6bb1dd26e32b15c.png", alt: "Client Logo 7", width: 175 },
    { src: "/assets/8bc9b95e8a1f1f4abae3f46cbcc40c6dba4b967d.png", alt: "Client Logo 8", width: 105 },
    { src: "/assets/12513b5b3d234486e92be05984e1492f3fa635f2.png", alt: "Client Logo 9", width: 187 },
    { src: "/assets/4e3542ad173e1c36958ace8998bf51f347470c4e.png", alt: "Client Logo 10", width: 125 },
  ];

  const title = data?.title || "La confianza de nuestros clientes nos respalda";
  const description = data?.description || "Organizaciones líderes transforman sus operaciones y obtienen resultados medibles mediante nuestras plataformas y servicios.";

  // Double the list to support seamless infinite loop
  const marqueeLogos = [...logos, ...logos];

  return (
    <section className="w-full py-16 bg-transparent flex flex-col items-center">
      {/* Title */}
      <div className="max-w-4xl text-center px-6 mb-12">
        <h2 className="text-2xl md:text-3xl font-black text-neutral-900 leading-tight">
          {title}
        </h2>
        <p className="mt-3 text-sm md:text-base text-neutral-500 max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>
      </div>

      {/* Infinite Scroll Marquee Wrapper */}
      <div className="w-full overflow-hidden relative py-4 border-y border-neutral-200/50 bg-white/10 select-none">
        
        {/* Left/Right shadows for glass fade effect */}
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-[#faf9fa] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-[#faf9fa] to-transparent z-10 pointer-events-none" />

        {/* Marquee Inner */}
        <div className="flex w-max items-center gap-16 md:gap-24 animate-marquee">
          {marqueeLogos.map((logo, index) => (
            <div 
              key={index} 
              className="flex-shrink-0 h-16 md:h-20 flex items-center justify-center grayscale opacity-60 hover:grayscale-0 hover:opacity-95 transition-all duration-300"
              style={{ width: `${logo.width}px` }}
            >
              <img
                src={logo.src}
                alt={logo.alt}
                className="max-h-full max-w-full object-contain pointer-events-none"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Styled animation tag inside component to avoid external setup issues */}
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 35s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
