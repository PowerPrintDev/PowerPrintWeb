"use client";

interface Testimonial {
  stars?: number;
  text: string;
  author: string;
  company: string;
}

interface TestimonialHeader {
  pill?: string;
  title?: string;
}

interface TestimonialsProps {
  testimonials: Testimonial[];
  header?: TestimonialHeader;
}

export default function Testimonials({ testimonials, header }: TestimonialsProps) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="w-full bg-neutral-950 border-b border-white/5 py-16 md:py-24 text-white">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-12 text-center">
        
        <div className="flex flex-col gap-4 items-center">
          <div className="bg-white/10 border border-white/20 px-4 py-1.5 text-center rounded-full flex items-center justify-center shrink-0">
            <span className="text-xs font-extrabold text-orange-main uppercase tracking-wider px-2 py-0.5">
              {header?.pill || "Lo que dicen nuestros clientes"}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white">
            {header?.title || "Resultados que se ven en cada local"}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-2">
          {testimonials.map((test, idx) => (
            <div
              key={idx}
              className="bg-white/[0.02] border border-white/5 p-8 rounded-[24px] flex flex-col items-start text-left justify-between gap-6 hover:border-white/10 hover:bg-white/[0.04] transition-all duration-300"
            >
              <div className="flex flex-col gap-4 w-full">
                {/* Stars */}
                <div className="flex items-center gap-1 text-orange-main text-sm">
                  {Array.from({ length: test.stars || 5 }).map((_, sIdx) => (
                    <span key={sIdx}>★</span>
                  ))}
                </div>
                
                {/* Quote */}
                <p className="text-sm text-neutral-300 font-bold leading-relaxed">
                  {test.text}
                </p>
              </div>

              <div className="flex flex-col gap-1 border-t border-white/5 pt-4 w-full mt-2">
                <span className="text-sm font-black text-white">
                  {test.author}
                </span>
                <span className="text-xs text-neutral-500 font-semibold">
                  {test.company}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
