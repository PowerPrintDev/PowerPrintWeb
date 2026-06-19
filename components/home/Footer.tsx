"use client";

interface FooterProps {
  data?: {
    tagline?: string;
    social?: { name: string; href: string }[];
  };
}

export default function Footer({ data }: FooterProps) {
  const tagline = data?.tagline || "Power Print & Graphic Solutions";

  return (
    <footer className="w-full bg-neutral-950 text-white py-12 px-6 md:px-24 border-t border-white/5 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">

        {/* Branding & Logo */}
        <div className="flex items-center gap-3 select-none">
          <img
            alt="Power Print Logo"
            className="h-10 md:h-12 w-auto object-contain"
            src="/assets/logo.svg"
          />
        </div>

        {/* Quick Links */}
        <nav className="flex flex-wrap justify-center gap-6 text-sm text-neutral-400 font-semibold">
          <a href="#inicio" className="hover:text-white transition-colors duration-200">Inicio</a>
          <a href="#nosotros" className="hover:text-white transition-colors duration-200">Nosotros</a>
          <a href="#trabajos" className="hover:text-white transition-colors duration-200">Trabajos</a>
          <a href="#productos" className="hover:text-white transition-colors duration-200">Productos</a>
        </nav>

        {/* Contact/Social Details */}
        <div id="contacto" className="flex flex-col items-center md:items-end gap-2 text-xs md:text-sm text-neutral-400">
          <p className="font-semibold text-neutral-200">¿Tienes un proyecto en mente?</p>
          <a href="mailto:info@powerprint.com" className="hover:text-white text-orange-main font-bold transition-colors duration-200">
            contacto@powerprint.com
          </a>
          <p className="text-[11px] text-neutral-500">© {new Date().getFullYear()} {tagline}. Todos los derechos reservados.</p>
        </div>

      </div>
    </footer>
  );
}
