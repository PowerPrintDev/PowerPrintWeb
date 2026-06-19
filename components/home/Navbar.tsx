"use client";

import { useState } from "react";
import { House, PersonStanding, Briefcase, Captions, Menu, X } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iconMap: { [key: string]: any } = {
  "Inicio": House,
  "Nosotros": PersonStanding,
  "Trabajos": Briefcase,
  "Productos": Captions,
};

interface NavbarProps {
  data?: {
    links: { label: string; href: string }[];
    logo: string;
    contactHref: string;
    contactLabel: string;
  };
}

export default function Navbar({ data }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const links = data?.links || [
    { label: "Inicio", href: "#inicio" },
    { label: "Nosotros", href: "#nosotros" },
    { label: "Trabajos", href: "#trabajos" },
    { label: "Productos", href: "#productos" },
  ];

  const logo = data?.logo || "/assets/logo.svg";
  const contactHref = data?.contactHref || "#contacto";
  const contactLabel = data?.contactLabel || "Pedir presupuesto";

  return (
    <header className="sticky top-0 z-50 w-full px-4 md:px-10 py-6 flex justify-center bg-transparent backdrop-blur-[10px]">
      <div className="w-full max-w-7xl bg-neutral-950/95 text-white flex items-center justify-between px-6 py-3 rounded-full shadow-lg border border-white/5 transition-all duration-300">

        {/* Logo Section */}
        <a href="#" className="flex items-center gap-3 select-none">
          <div className="h-10 md:h-14 flex items-center">
            <img
              alt="Power Print Logo"
              className="h-10 md:h-12 object-contain"
              src={logo}
            />
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          {links.map((link) => {
            const Icon = iconMap[link.label] || Briefcase;
            return (
              <a
                key={link.label}
                href={link.href}
                className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-50 hover:bg-white/10 rounded-lg transition-colors duration-200"
              >
                <Icon className="w-5 h-5 opacity-90 text-neutral-50" />
                <span>{link.label}</span>
              </a>
            );
          })}
          <a
            href={contactHref}
            className="ml-2 px-5 py-2.5 text-sm font-semibold rounded-lg text-neutral-50 bg-gradient-to-r from-orange-main to-red-main hover:opacity-95 shadow-md shadow-orange-main/15 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            {contactLabel}
          </a>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden flex items-center justify-center p-2 text-neutral-50 hover:bg-white/10 rounded-full focus:outline-none transition-colors duration-200"
          aria-label="Toggle Menu"
        >
          {isOpen ? (
            <X className="w-6 h-6 text-neutral-50" />
          ) : (
            <Menu className="w-6 h-6 text-neutral-50" />
          )}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden" onClick={() => setIsOpen(false)}>
          {/* Mobile Drawer Content */}
          <div
            className="absolute top-24 right-4 left-4 p-6 bg-neutral-950/95 border border-white/10 rounded-2xl flex flex-col gap-4 shadow-2xl transition-all transform duration-300 ease-out"
            onClick={(e) => e.stopPropagation()}
          >
            {links.map((link) => {
              const Icon = iconMap[link.label] || Briefcase;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-neutral-50 hover:bg-white/10 transition-colors duration-200 text-lg"
                >
                  <Icon className="w-6 h-6 text-neutral-50" />
                  <span>{link.label}</span>
                </a>
              );
            })}
            <a
              href={contactHref}
              onClick={() => setIsOpen(false)}
              className="mt-2 w-full text-center py-3 text-lg font-bold rounded-xl text-neutral-50 bg-gradient-to-r from-orange-main to-red-main hover:opacity-95 transition-all duration-200 block"
            >
              {contactLabel}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

