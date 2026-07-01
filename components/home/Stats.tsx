"use client";

interface StatItem {
  value: string;
  description: string;
}

interface StatsProps {
  stats?: StatItem[];
}

export default function Stats({ stats }: StatsProps) {
  // Default values matching Figma design if not provided
  const items = stats || [
    { value: "+27 años", description: "de experiencia en el mercado" },
    { value: "+2.000", description: "proyectos completados" },
    { value: "100%", description: "fabricación propia" },
    { value: "Todo el país", description: "envíos a toda Argentina" },
  ];

  return (
    <section className="w-full bg-neutral-950 border-y border-white/5 py-12 md:py-16 select-none relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 bg-orange-main/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-64 h-64 bg-red-main/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6 lg:gap-8 items-start">
          {items.map((stat, idx) => (
            <div
              key={idx}
              className="flex flex-col gap-2 items-start px-4 md:px-6 py-4 rounded-2xl bg-white/[0.01] border border-white/[0.03] hover:bg-white/[0.03] hover:border-white/[0.07] transition-all duration-300 group"
            >
              {/* Stat value with hover scale/color animation */}
              <span className="text-3xl md:text-4xl font-black bg-gradient-to-r from-orange-main to-orange-600 bg-clip-text text-transparent group-hover:from-orange-main group-hover:to-red-main transition-all duration-300">
                {stat.value}
              </span>
              
              {/* Description */}
              <p className="text-xs md:text-sm text-neutral-400 font-medium leading-relaxed max-w-[200px]">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
