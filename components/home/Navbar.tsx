"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { House, PersonStanding, Briefcase, Captions, Menu, X, ChevronDown } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iconMap: { [key: string]: any } = {
  "Inicio": House,
  "Nosotros": PersonStanding,
  "Trabajos": Briefcase,
  "Productos": Captions,
};

interface CategoryItem {
  id: string;
  slug?: string;
  label: string;
  title: string;
  description: string;
}

interface NavbarProps {
  data?: {
    links: { label: string; href: string }[];
    logo: string;
    contactHref: string;
    contactLabel: string;
  };
  categories?: CategoryItem[];
}

export default function Navbar({ data, categories: propCategories }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const getCategorySlug = (cat: CategoryItem) => {
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

  const links = data?.links || [
    { label: "Inicio", href: "/" },
    { label: "Nosotros", href: "/nosotros" },
    { label: "Trabajos", href: "/trabajos" },
    { label: "Productos", href: "/productos" },
  ];

  const categories = propCategories || [
    {
      id: "Marquesina",
      label: "Marquesina",
      title: "Marquesinas y Fachadas",
      description: "Estructuras corpóreas de soporte e iluminación LED para marquesinas frontales."
    },
    {
      id: "Letras corpóreas",
      label: "Letras corpóreas",
      title: "Letras Corpóreas 3D",
      description: "Letreros tridimensionales en acrílico, metal o madera con retroiluminación."
    },
    {
      id: "Salientes peatonales",
      label: "Salientes peatonales",
      title: "Salientes Peatonales",
      description: "Soportes de doble faz metálicos y acrílicos para visualización peatonal."
    },
    {
      id: "Atriles de vereda",
      label: "Atriles de vereda",
      title: "Atriles y Caballetes",
      description: "Estructuras estables y portátiles para cartelería efímera de menús o promociones."
    },
    {
      id: "Foodtrucks",
      label: "Foodtrucks",
      title: "Rotulación de Foodtrucks",
      description: "Diseños integrales con vinilos de alta calidad y marquesinas modulares."
    }
  ];

  const logo = data?.logo || "/assets/logo.svg";
  const contactHref = data?.contactHref || "/contacto";
  const contactLabel = data?.contactLabel || "Pedir presupuesto";

  const resolveHref = (href: string) => {
    if (pathname !== "/" && href.startsWith("#")) {
      return `/${href}`;
    }
    return href;
  };

  return (
    <header className="sticky top-0 z-50 w-full px-4 md:px-10 py-6 flex justify-center bg-transparent backdrop-blur-[10px]">
      <div className="w-full max-w-7xl bg-neutral-950/95 text-white flex items-center justify-between px-6 py-3 rounded-full shadow-lg border border-white/5 transition-all duration-300">

        {/* Logo Section */}
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-3 select-none">
          <div className="h-10 md:h-14 flex items-center">
            <img
              alt="Power Print Logo"
              className="h-10 md:h-12 object-contain"
              src={logo}
            />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          {links.map((link) => {
            const Icon = iconMap[link.label] || Briefcase;
            const isProducts = link.label === "Productos";

            if (isProducts) {
              return (
                <div key={link.label} className="relative group">
                  <a
                    href={resolveHref(link.href)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-50 hover:bg-white/10 rounded-lg transition-colors duration-200 cursor-pointer"
                  >
                    <Icon className="w-5 h-5 opacity-90 text-neutral-50" />
                    <span>{link.label}</span>
                    <ChevronDown className="w-4 h-4 opacity-75 group-hover:rotate-180 transition-transform duration-300" />
                  </a>

                  {/* Desktop Dropdown Panel */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[320px] bg-neutral-950/98 border border-white/10 rounded-xl py-3 shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 delay-150 group-hover:delay-0 z-50 backdrop-blur-md before:absolute before:-top-4 before:left-0 before:right-0 before:h-4">
                    <div className="px-4 pb-2 border-b border-white/5 mb-1 select-none">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-orange-main">
                        Nuestras Líneas
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5 max-h-[350px] overflow-y-auto px-2">
                      {categories.map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/productos/${getCategorySlug(cat)}`}
                          className="flex flex-col gap-0.5 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors duration-150 group/item"
                        >
                          <span className="text-sm font-bold text-neutral-200 group-hover/item:text-orange-main transition-colors">
                            {cat.title || cat.label}
                          </span>
                          <span className="text-[11px] text-neutral-400 font-medium line-clamp-1">
                            {cat.description}
                          </span>
                        </Link>
                      ))}
                    </div>
                    <div className="mt-2 pt-2 border-t border-white/5 px-4 flex justify-between items-center">
                      <a
                        href="/productos"
                        className="text-xs font-bold text-orange-main hover:text-orange-400 transition-colors flex items-center gap-1"
                      >
                        <span>Ver todas las líneas</span>
                        <span>→</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <a
                key={link.label}
                href={resolveHref(link.href)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-50 hover:bg-white/10 rounded-lg transition-colors duration-200"
              >
                <Icon className="w-5 h-5 opacity-90 text-neutral-50" />
                <span>{link.label}</span>
              </a>
            );
          })}
          <a
            href={resolveHref(contactHref)}
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
              const isProducts = link.label === "Productos";

              if (isProducts) {
                return (
                  <div key={link.label} className="flex flex-col gap-1 w-full">
                    <a
                      href={resolveHref(link.href)}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-neutral-50 hover:bg-white/10 transition-colors duration-200 text-lg font-bold"
                    >
                      <Icon className="w-6 h-6 text-neutral-50" />
                      <span>{link.label}</span>
                    </a>
                    {/* Mobile indented subcategories list */}
                    <div className="flex flex-col gap-1 pl-12 border-l border-white/10 ml-7 mb-2">
                      {categories.map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/productos/${getCategorySlug(cat)}`}
                          onClick={() => setIsOpen(false)}
                          className="py-2 text-sm text-neutral-400 hover:text-orange-main transition-colors"
                        >
                          {cat.title || cat.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <a
                  key={link.label}
                  href={resolveHref(link.href)}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-neutral-50 hover:bg-white/10 transition-colors duration-200 text-lg"
                >
                  <Icon className="w-6 h-6 text-neutral-50" />
                  <span>{link.label}</span>
                </a>
              );
            })}
            <a
              href={resolveHref(contactHref)}
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

