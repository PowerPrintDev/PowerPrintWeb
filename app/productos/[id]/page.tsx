import fs from "fs/promises";
import path from "path";
import Link from "next/link";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

export const dynamic = "force-dynamic";

type Category = {
  id: string;
  slug?: string;
  label: string;
  title: string;
  description: string;
  thumbnail?: string;
  heroImageTransparent?: string;
  heroImageSupport?: string;
  coverImage?: string;
  contentMarkdown?: string;
};

async function getContent() {
  try {
    const filePath = path.join(process.cwd(), "data", "content.json");
    const fileContent = await fs.readFile(filePath, "utf8");
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Error loading content.json in Productos detail page.", error);
    return null;
  }
}

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
                <p className="text-center text-xs text-neutral-500 py-2.5 border-t border-neutral-100 bg-neutral-50 font-bold font-sans">
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

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const content = await getContent();
  const decodedId = decodeURIComponent(id);

  const categories: Category[] = content?.heroAndShowcase?.categories || [];
  const category = categories.find((c) => {
    const slug = c.slug || c.id
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-");
    
    return slug === id || c.id === decodedId || c.id === id;
  });

  if (!category) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-neutral-50 text-neutral-500">
        Producto no encontrado: {decodedId}
      </div>
    );
  }

  // Generate demo markdown content if none exists to showcase editing instantly
  const demoMarkdown = `# Características Principales\n\nNuestras fabricaciones de **${category.label}** se realizan con materiales de primerísima calidad, asegurando resistencia al exterior y durabilidad.\n\n## Materiales Recomendados\n\nRecomendamos espesores de acrílico o chapa plegada según las dimensiones del cartel. La retroiluminación se realiza mediante módulos LED estancos con protección IP67.\n\n![Vista de taller](/assets/b1c41062b620e92fe7726e0274f898671941126c.png)`;
  const markdownToRender = category.contentMarkdown || demoMarkdown;

  return (
    <div className="min-h-screen w-full flex flex-col font-sans antialiased bg-gradient-to-t from-neutral-50 via-neutral-50 to-orange-100/30 overflow-x-clip selection:bg-orange-200/80 selection:text-orange-950">
      
      {/* Navigation Header */}
      <Navbar data={content?.navbar} categories={content?.heroAndShowcase?.categories} />

      {/* Full width cover image (Hero banner) */}
      <div className="w-full h-[40vh] md:h-[55vh] relative overflow-hidden bg-neutral-900 shadow-xl">
        {category.coverImage ? (
          <img 
            src={category.coverImage} 
            alt={category.label} 
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-tr from-neutral-900 to-orange-950 flex items-center justify-center">
            {category.thumbnail && (
              <img 
                src={category.thumbnail} 
                alt={category.label} 
                className="w-full h-full object-cover opacity-30 absolute inset-0 filter blur-sm" 
              />
            )}
            <div className="absolute inset-0 bg-black/40" />
          </div>
        )}
        
        {/* Dark overlay with text */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent flex flex-col justify-end p-6 md:p-16">
          <div className="w-full max-w-4xl mx-auto flex flex-col gap-3">
            <span className="w-fit px-3 py-1 bg-orange-main text-white rounded-full text-xs font-black uppercase tracking-wider shadow-lg shadow-orange-main/15 select-none">
              Línea de producción
            </span>
            <h1 className="text-3xl md:text-6xl font-black text-white leading-tight tracking-tight drop-shadow-sm select-none">
              {category.label}
            </h1>
          </div>
        </div>
      </div>

      <main className="flex-1 w-full flex flex-col items-center px-4 md:px-10 py-12 md:py-16">
        <div className="w-full max-w-3xl flex flex-col gap-8">
          
          {/* Top Breadcrumb and action row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-4">
            <Link 
              href="/productos" 
              className="inline-flex items-center gap-2 text-xs font-black uppercase text-orange-main hover:text-orange-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver a Productos</span>
            </Link>
            
            <Link
              href={`/trabajos?filter=${category.id}`}
              className="inline-flex items-center gap-1.5 text-xs font-black uppercase text-neutral-500 hover:text-orange-main transition-colors"
            >
              <span>Ver trabajos de esta categoría</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Description Paragraph */}
          <div className="prose prose-lg prose-neutral max-w-none">
            <p className="text-base md:text-xl text-neutral-700 leading-relaxed font-semibold">
              {category.description}
            </p>
          </div>

          {/* Stacked Images / Gallery (Transparent and Support) */}
          <div className="flex flex-col gap-6 w-full mt-2">
            {[category.heroImageSupport, category.heroImageTransparent].filter(Boolean).map((img, idx) => (
              <div 
                key={idx} 
                className="w-full rounded-[24px] overflow-hidden border border-neutral-200/60 shadow-lg bg-white p-4"
              >
                <img 
                  src={img} 
                  alt={`${category.label} - Vista ${idx + 1}`} 
                  className="max-h-[70vh] mx-auto object-contain" 
                />
              </div>
            ))}
          </div>

          {/* Extended Markdown Content */}
          {markdownToRender && renderMarkdown(markdownToRender)}

          {/* CTA Footer */}
          <div className="flex items-center justify-between border-t border-neutral-200/60 pt-8 mt-4">
            <Link
              href="/contacto"
              className="w-full md:w-auto bg-orange-main hover:bg-orange-600 px-6 py-4 rounded-xl text-white font-extrabold text-sm md:text-base flex items-center justify-center gap-2 transition-all duration-200 shadow-md shadow-orange-main/15 cursor-pointer"
            >
              <span>Solicitar presupuesto para {category.label}</span>
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
