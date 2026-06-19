"use client";

interface ServiceItem {
  img: string;
  title: string;
  desc: string;
}

interface ServicesProps {
  data?: {
    subtitle?: string;
    title?: string;
    description?: string;
    servicesList?: ServiceItem[];
  };
}

export default function Services({ data }: ServicesProps) {
  const servicesList = data?.servicesList || [
    {
      img: "/assets/23ea9f77ca4de1459981e27a1c4bcd34d84057d0.png",
      title: "Impresión de alta calidad",
      desc: "Utilizamos tecnología de vanguardia para garantizar la máxima fidelidad en la impresión de tus carteles, logrando resultados profesionales de alta durabilidad."
    },
    {
      img: "/assets/386700c0b6c1b042c85c64c0001eb60dd9c2b512.png",
      title: "Diseños personalizados",
      desc: "Creamos piezas publicitarias únicas que se adaptan a las necesidades específicas de tu local o campaña y reflejan con precisión la identidad de tu marca."
    },
    {
      img: "/assets/42ffb1fd2303f89c19988e63d839950ff4417deb.png",
      title: "Envíos a todo el país",
      desc: "Llegamos a cualquier punto del territorio nacional, garantizando que tus carteles lleguen en perfectas condiciones y conservando la mejor calidad del mercado."
    }
  ];

  const subtitle = data?.subtitle || "Nuestros servicios";
  const title = data?.title || "Todo lo que necesitas para destacar tu negocio";
  const description = data?.description || "Descubre nuestra amplia gama de productos y los diferentes tipos de soluciones que ofrecemos para potenciar tu marca.";

  return (
    <section id="productos" className="w-full py-16 md:py-24 px-4 md:px-24 bg-white/30 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        
        {/* Header Text */}
        <div className="max-w-2xl flex flex-col gap-3">
          <span className="text-sm font-extrabold uppercase tracking-widest text-orange-main select-none">
            {subtitle}
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-neutral-900 leading-tight">
            {title}
          </h2>
          <p className="text-base md:text-lg text-neutral-500 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {servicesList.map((service, index) => (
            <div
              key={index}
              className="flex flex-col gap-5 bg-white/50 border border-neutral-200/40 p-5 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              {/* Service Mockup Image Container */}
              <div className="w-full h-[220px] md:h-[277px] overflow-hidden rounded-xl bg-neutral-100 relative shadow-inner">
                <img
                  src={service.img}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Description Panel */}
              <div className="flex flex-col gap-2">
                <h3 className="text-xl md:text-2xl font-bold text-orange-600 transition-colors duration-200">
                  {service.title}
                </h3>
                <p className="text-sm md:text-base text-neutral-500 leading-relaxed font-medium">
                  {service.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
