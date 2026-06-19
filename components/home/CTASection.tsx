"use client";

import { MessageSquare } from "lucide-react";

interface CTASectionProps {
  data?: {
    backgroundImage?: string;
    logoTypo?: string;
    title?: string;
    titlePrefix?: string;
    highlight?: string;
    titleSuffix?: string;
    worksHref?: string;
    contactHref?: string;
  };
}

export default function CTASection({ data }: CTASectionProps) {
  const backgroundImage = data?.backgroundImage || "/assets/926c7d07507269c9930e0831d14e40814dfd4624.png";
  const logoTypo = data?.logoTypo || "/assets/6364e84f25bbf1aef51f6487142d70da01db4533.svg";
  const worksHref = data?.worksHref || "#trabajos";
  const contactHref = data?.contactHref || "#contacto";

  let title = data?.title;
  if (!title) {
    const prefix = data?.titlePrefix || "Potencia";
    const highlight = data?.highlight || "tu marca";
    const suffix = data?.titleSuffix || "con nosotros";
    title = `${prefix} *${highlight}*\n${suffix}`;
  }

  const parseTitle = (text: string) => {
    const parts = text.split(/(\*[^*]+\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith("*") && part.endsWith("*")) {
        const clean = part.slice(1, -1);
        return (
          <span key={idx} className="bg-gradient-to-r from-orange-main to-red-main bg-clip-text text-transparent inline-block font-black">
            {clean}
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
    <section className="relative w-full h-[400px] md:h-[483px] overflow-hidden flex flex-col justify-center items-center select-none text-center bg-orange-700">

      {/* Background Image Layer with Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={backgroundImage}
          alt="CTA Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-neutral-950/20 " />
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center max-w-5xl px-6 gap-6">

        {/* Brand Logo Symbol */}
        {logoTypo && (
          <div className="mb-2">
            <img
              src={logoTypo}
              alt="Logo Typo"
              className="h-14 md:h-16 w-auto object-contain filter drop-shadow-md"
            />
          </div>
        )}

        {/* Big Heading Slogan */}
        <h2 className="text-4xl md:text-6xl lg:text-[76px] font-black text-neutral-50 tracking-tight leading-[1.05] drop-shadow-md">
          {parseTitle(title)}
        </h2>

        {/* Buttons Action Group */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md mt-4">
          <a
            href={worksHref}
            className="w-full sm:w-[200px] py-3.5 flex items-center justify-center font-bold text-base rounded-xl bg-neutral-200 text-neutral-900 hover:bg-neutral-300 transition-colors duration-200"
          >
            Trabajos
          </a>
          <a
            href={contactHref}
            className="w-full sm:w-[200px] py-3.5 flex items-center justify-center gap-2 font-bold text-base rounded-xl bg-orange-main text-white hover:opacity-95 shadow-lg shadow-orange-main/20 transition-all duration-200"
          >
            <MessageSquare className="w-5 h-5 text-white" />
            Contactar
          </a>
        </div>

      </div>
    </section>
  );
}
