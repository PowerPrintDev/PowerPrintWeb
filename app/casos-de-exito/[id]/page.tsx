import { getContent } from "@/app/lib/content";
import Link from "next/link";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

export const dynamic = "force-dynamic";

type SuccessStory = {
  logo: string;
  title: string;
  description: string;
  badge: string;
  mockups: string[];
  contentMarkdown?: string;
};



// Custom simple parser to alternate headings, paragraphs, images and video embeds
function renderMarkdown(md: string) {
  if (!md) return null;

  // Split by double newlines to separate blocks (headings, paragraphs, images, videos)
  const blocks = md.split(/\n\s*\n/);

  return (
    <div className="flex flex-col gap-6 w-full mt-6 border-t border-neutral-200/60 pt-8">
      {blocks.map((block, idx) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // 1. Headings (like # Title or ## Title)
        if (trimmed.startsWith("#")) {
          const level = (trimmed.match(/^#+/) || ["#"])[0].length;
          const text = trimmed.replace(/^#+\s*/, "");
          if (level === 1) {
            return (
              <h2 key={idx} className="text-2xl md:text-3xl font-black text-neutral-900 mt-6 border-b border-neutral-200 pb-2">
                {text}
              </h2>
            );
          } else if (level === 2) {
            return (
              <h3 key={idx} className="text-xl md:text-2xl font-extrabold text-neutral-900 mt-4">
                {text}
              </h3>
            );
          } else {
            return (
              <h4 key={idx} className="text-lg md:text-xl font-bold text-neutral-900 mt-2">
                {text}
              </h4>
            );
          }
        }

        // 2. Images: ![Alt text](url)
        const imgMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
        if (imgMatch) {
          const alt = imgMatch[1];
          const src = imgMatch[2];
          return (
            <div key={idx} className="w-full rounded-[24px] overflow-hidden border border-neutral-200/60 shadow-md bg-white my-2">
              <img
                src={src}
                alt={alt}
                className="w-full h-auto object-contain max-h-[80vh] mx-auto"
              />
              {alt && (
                <p className="text-center text-xs text-neutral-500 py-2.5 border-t border-neutral-100 bg-neutral-50 font-bold">
                  {alt}
                </p>
              )}
            </div>
          );
        }

        // 3. Videos: @[Video Title](url)
        const videoMatch = trimmed.match(/^@\[(.*?)\]\((.*?)\)$/);
        if (videoMatch) {
          const title = videoMatch[1];
          const src = videoMatch[2];
          const isVimeo = src.includes("vimeo.com") || src.includes("player.vimeo.com");
          const isYoutube = src.includes("youtube.com") || src.includes("youtu.be") || src.includes("youtube-nocookie.com");
          
          if (isVimeo || isYoutube) {
            let embedUrl = src;
            if (isVimeo) {
              const idMatch = src.match(/(?:vimeo\.com\/|video\/)(\d+)/);
              if (idMatch) embedUrl = `https://player.vimeo.com/video/${idMatch[1]}?autoplay=0&muted=0`;
            } else if (isYoutube) {
              const idMatch = src.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|embed\/)([^&?]+)/);
              if (idMatch) embedUrl = `https://www.youtube.com/embed/${idMatch[1]}`;
            }
            return (
              <div key={idx} className="w-full aspect-video rounded-[24px] overflow-hidden border border-neutral-200 shadow-md bg-neutral-950 my-2">
                <iframe
                  src={embedUrl}
                  title={title || "Video promocional"}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            );
          }

          // Fallback to HTML5 video tag
          return (
            <div key={idx} className="w-full rounded-[24px] overflow-hidden border border-neutral-200 shadow-md bg-neutral-950 my-2">
              <video
                src={src}
                controls
                className="w-full max-h-[80vh]"
              />
            </div>
          );
        }

        // 4. Default: Paragraph (with bold **bold** and [link](url) parsing)
        const htmlContent = trimmed
          .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
          .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-orange-main hover:underline font-extrabold">$1</a>');

        return (
          <p 
            key={idx} 
            className="text-base md:text-lg text-neutral-700 leading-relaxed font-medium"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        );
      })}
    </div>
  );
}

export default async function CasoDeExitoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const content = await getContent();
  
  const stories: SuccessStory[] = content?.successStories?.stories || [
    {
      logo: "/assets/83ee8974bc0726865bf381144c9e3d2e353d8317.png",
      title: "Un reto increíble",
      description: "Trabajamos junto a grandes marcas para rediseñar su presencia en puntos de venta físicos, instalando cartelería corpórea y marquesinas de alta gama que redefinen la experiencia visual del cliente.",
      badge: "Marquesina Premium",
      mockups: [
        "/assets/9e26891257a92e1efedb953ccda1b6d003f0894b.png",
        "/assets/4d7146a3b6b4351a4ed6555a37ea662e6640e4f0.png",
        "/assets/0e95ea7680b1be37bf01a1c8bf22a56029fa21a7.png",
      ],
      contentMarkdown: `# Detalle del Proceso de Diseño\n\nComenzamos el proyecto analizando la identidad de marca de la franquicia y diseñando bocetos digitales tridimensionales. El principal desafío técnico fue garantizar la distribución de la iluminación LED interna para que sea homogénea en toda la superficie.\n\n## Estructura Metálica y Acabados\n\nPara el montaje, empleamos herrería reforzada con tratamiento anticorrosivo de exterior y terminación de pintura poliuretánica. El frente fue fabricado en acrílico termoformado con vinilo translúcido de alta durabilidad.\n\n![Nuestra herrería de alta precisión](/assets/34b6c149f3c5ab0ba816977fa7356cb327d3c695.png)\n\n## Video del Cartel Terminado\n\nAquí puedes ver cómo funciona la iluminación LED por la noche:\n\n@[Iluminación LED de cartel](https://player.vimeo.com/video/826887823)`
    },
    {
      logo: "/assets/628d0b757003e98f9427c645354850f34e309611.png",
      title: "Identidad Visual Total",
      description: "Creamos un ecosistema publicitario completo desde carpintería metálica hasta impresión gigantográfica, permitiendo que la marca logre un impacto visual coherente y masivo en todo el país.",
      badge: "Herrería & Cartelería",
      mockups: [
        "/assets/34b6c149f3c5ab0ba816977fa7356cb327d3c695.png",
        "/assets/41283939bd74a3453a06d1331bd20247bf8e8fcd.png",
        "/assets/10dc229eeb96a4cabe5c251d305ef92ef93729fb.png",
      ],
      contentMarkdown: `# Innovación y Presencia Masiva\n\nEste proyecto consistió en equipar múltiples sucursales con letreros corpóreos retroiluminados, marquesinas metálicas y vinilos de vidriera en tiempo récord.\n\n## Logística y Producción\n\nNuestra planta trabajó coordinadamente en tres turnos de herrería y carpintería para entregar más de 40 carteles en menos de 15 días hábiles.\n\n![Producción en serie de carteles](/assets/41283939bd74a3453a06d1331bd20247bf8e8fcd.png)`
    }
  ];

  const storyIdx = parseInt(id, 10);
  const story = stories[storyIdx] || stories[0];

  return (
    <div className="min-h-screen w-full flex flex-col font-sans antialiased bg-gradient-to-t from-neutral-50 via-neutral-50 to-orange-100/30 overflow-x-clip selection:bg-orange-200/80 selection:text-orange-950">
      
      {/* Navigation Header */}
      <Navbar data={content?.navbar} categories={content?.heroAndShowcase?.categories} />

      <main className="flex-1 w-full flex flex-col items-center px-4 md:px-10 py-24 md:py-32">
        <div className="w-full max-w-3xl flex flex-col gap-8">
          
          {/* Back button */}
          <div>
            <Link 
              href="/#casos-de-exito" 
              className="inline-flex items-center gap-2 text-xs font-black uppercase text-orange-main hover:text-orange-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver a Casos de éxito</span>
            </Link>
          </div>

          {/* Page Header (Blog style) */}
          <div className="flex flex-col gap-4 border-b border-neutral-200 pb-6">
            <div className="flex items-center justify-between gap-4">
              <span className="px-3 py-1 bg-orange-100 text-orange-main border border-orange-200 rounded-full text-xs font-extrabold uppercase tracking-wider">
                {story.badge}
              </span>
              {story.logo && (
                <div className="h-10 max-w-[120px] flex items-center">
                  <img 
                    src={story.logo} 
                    alt="Logo cliente" 
                    className="max-h-full max-w-full object-contain filter drop-shadow-sm opacity-90"
                  />
                </div>
              )}
            </div>
            
            <h1 className="text-3xl md:text-5xl font-black text-neutral-900 leading-tight tracking-tight">
              {story.title}
            </h1>
          </div>

          {/* Description Paragraph */}
          <div className="prose prose-lg prose-neutral max-w-none">
            <p className="text-base md:text-xl text-neutral-700 leading-relaxed font-semibold">
              {story.description}
            </p>
          </div>

          {/* Vertical Stack of Images ("Sábana" - No columns) */}
          <div className="flex flex-col gap-6 w-full mt-2">
            {story.mockups?.filter(Boolean).map((mockup, idx) => (
              <div 
                key={idx} 
                className="w-full rounded-[24px] overflow-hidden border border-neutral-200/60 shadow-lg bg-white"
              >
                <img 
                  src={mockup} 
                  alt={`${story.title} - Imagen ${idx + 1}`} 
                  className="w-full h-auto object-contain max-h-[80vh] mx-auto" 
                />
              </div>
            ))}
          </div>

          {/* Extended Markdown Content */}
          {story.contentMarkdown && renderMarkdown(story.contentMarkdown)}

          {/* CTA Footer */}
          <div className="flex items-center justify-between border-t border-neutral-200/60 pt-8 mt-4">
            <Link
              href="/contacto"
              className="w-full md:w-auto bg-orange-main hover:bg-orange-600 px-6 py-4 rounded-xl text-white font-extrabold text-sm md:text-base flex items-center justify-center gap-2 transition-all duration-200 shadow-md shadow-orange-main/15 cursor-pointer"
            >
              <span>Me interesa un proyecto similar</span>
              <ArrowUpRight className="w-5 h-5 text-white" />
            </Link>
          </div>

        </div>
      </main>

      {/* Footer Branding Navigation */}
      <Footer data={content?.footer} />
      
    </div>
  );
}
