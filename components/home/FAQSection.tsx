"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

type FAQItem = {
  question: string;
  answer: string;
};

interface FAQSectionProps {
  data?: {
    subtitle?: string;
    title?: string;
    description?: string;
    faqs?: FAQItem[];
  };
}

export default function FAQSection({ data }: FAQSectionProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate progress of section entering the viewport
      const startTrigger = windowHeight;
      const endTrigger = windowHeight * 0.2;
      const totalDist = startTrigger - endTrigger;
      const currentDist = windowHeight - rect.top;

      const progress = Math.min(Math.max(currentDist / totalDist, 0), 1);
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    handleScroll(); // Run initially

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const faqs: FAQItem[] = data?.faqs || [
    {
      question: "¿Hacen envíos?",
      answer: "Sí, realizamos envíos embalados y asegurados a todo el territorio nacional para asegurar que tus carteles y estructuras lleguen en óptimas condiciones."
    },
    {
      question: "¿Cómo es el proceso de contratación?",
      answer: "El proceso es simple: solicitas una cotización, nuestro equipo de diseño te presenta una propuesta visual en base a tus requisitos, y tras tu aprobación, procedemos con la fabricación e instalación final."
    },
    {
      question: "¿Las medidas del local vienen de su parte?",
      answer: "Sí, contamos con un equipo técnico especializado que puede acercarse a tu local para realizar el relevamiento de medidas y comprobar las condiciones estructurales de la fachada."
    },
    {
      question: "¿Cuáles son los métodos de pago aceptados?",
      answer: "Aceptamos transferencias bancarias directas, pagos con tarjetas de débito/crédito, cheques comerciales y planes de financiación especiales para franquicias o compras corporativas."
    },
    {
      question: "¿Ofrecen descuentos por compras al por mayor?",
      answer: "Sí, disponemos de tarifas escalonadas con bonificaciones especiales para cartelería corporativa masiva, cadenas de tiendas y compras al por mayor."
    },
    {
      question: "¿Puedo personalizar los productos según mis necesidades?",
      answer: "Totalmente. Todo nuestro trabajo se realiza bajo pedido y a medida, adaptando las dimensiones, iluminación LED, materiales y herrajes según lo solicite tu marca."
    },
    {
      question: "¿Cuál es el tiempo estimado de entrega?",
      answer: "El tiempo estimado de entrega suele ser de 7 a 15 días hábiles, variando según las dimensiones, la complejidad estructural y la demanda de producción."
    },
    {
      question: "¿Tienen servicio postventa o garantía?",
      answer: "Sí, todas nuestras fabricaciones e instalaciones cuentan con garantía escrita que respalda la calidad del material y el montaje contra cualquier defecto de mano de obra."
    }
  ];

  const subtitle = data?.subtitle || "Preguntas frecuentes";
  const title = data?.title || "¿Tienes dudas? Nosotros te las resolvemos";
  const description = data?.description || "Encuentre respuestas a las consultas más comunes sobre nuestras soluciones, servicios y el soporte técnico postventa.";

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section ref={sectionRef} className="w-full py-16 md:py-24 px-4 md:px-24 bg-neutral-200/50 relative overflow-clip">

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10 items-start">

        {/* Left Side Info Title */}
        <div className="lg:col-span-5 flex flex-col gap-3 relative xl:min-h-[580px]">
          <span className="text-sm font-extrabold uppercase tracking-widest text-orange-main select-none">
            {subtitle}
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-neutral-900 leading-tight">
            {title}
          </h2>
          <p className="text-base md:text-lg text-neutral-500 leading-relaxed font-medium">
            {description}
          </p>

          {/* Decorative mockups at desktop layer */}
          <div className="hidden xl:block absolute left-0 bottom-0 w-full h-[360px] pointer-events-none select-none z-0">
            {/* Card 1 (pink outline) */}
            <div
              style={{
                position: "absolute",
                width: "240px",
                height: "270px",
                left: "10px",
                bottom: "40px",
                transform: `translate3d(${-130 * (1 - scrollProgress)}px, ${190 * (1 - scrollProgress)}px, 0) rotate(${-25 + (-6 - (-25)) * scrollProgress}deg)`,
                opacity: scrollProgress,
                transition: "transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease-out"
              }}
              className="rounded-2xl shadow-xl overflow-hidden bg-white border border-neutral-200/50"
            >
              <img src="/assets/67f0e9cafad48b51ae943ed51f2c03b933ee477a.png" alt="" className="w-full h-full object-cover" />
            </div>

            {/* Card 2 (purple outline) */}
            <div
              style={{
                position: "absolute",
                width: "240px",
                height: "270px",
                left: "150px",
                bottom: "70px",
                transform: `translate3d(${-230 * (1 - scrollProgress)}px, ${270 * (1 - scrollProgress)}px, 0) rotate(${-15 + (8 - (-15)) * scrollProgress}deg)`,
                opacity: scrollProgress * 0.9,
                transition: "transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease-out",
                zIndex: 5
              }}
              className="rounded-2xl shadow-xl overflow-hidden bg-white border border-neutral-200/50"
            >
              <img src="/assets/b1c41062b620e92fe7726e0274f898671941126c.png" alt="" className="w-full h-full object-cover" />
            </div>

            {/* Card 3 (red outline) */}
            <div
              style={{
                position: "absolute",
                width: "240px",
                height: "270px",
                left: "70px",
                bottom: "-30px",
                transform: `translate3d(${-110 * (1 - scrollProgress)}px, ${220 * (1 - scrollProgress)}px, 0) rotate(${0 + (14 - 0) * scrollProgress}deg)`,
                opacity: scrollProgress * 0.95,
                transition: "transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease-out",
                zIndex: 10
              }}
              className="rounded-2xl shadow-xl overflow-hidden bg-white border border-neutral-200/50"
            >
              <img src="/assets/9e26891257a92e1efedb953ccda1b6d003f0894b.png" alt="" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        {/* Right Side Accordion Lists */}
        <div className="lg:col-span-7 flex flex-col gap-4 w-full">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white border border-neutral-200/40 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
              >
                {/* Accordion header button */}
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full text-left px-5 py-4 md:py-5 flex items-center justify-between gap-4 font-bold text-neutral-800 text-base md:text-lg hover:text-orange-main transition-colors focus:outline-none cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <span className={`transform transition-transform duration-300 flex-shrink-0 ${isOpen ? "rotate-180" : ""
                    }`}>
                    <ChevronDown className="w-5 h-5 opacity-70" />
                  </span>
                </button>

                {/* Accordion content body */}
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? "max-h-[200px] border-t border-neutral-100" : "max-h-0"
                    }`}
                >
                  <p className="px-5 py-4 text-sm md:text-base text-neutral-600 leading-relaxed font-medium bg-neutral-50/50">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
