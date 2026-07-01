"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  LogOut, 
  Save, 
  Upload, 
  Plus, 
  Trash2, 
  ChevronRight, 
  Image as ImageIcon, 
  CheckCircle, 
  AlertCircle, 
  HelpCircle,
  Briefcase,
  Layers,
  Settings,
  Megaphone,
  Users,
  FolderOpen,
  Mail,
  Loader2,
  Tag,
  ArrowUpRight,
  MessageCircle,
  Heading1,
  Heading2,
  Bold,
  Link as LinkIcon,
  Eye,
  Edit3,
  Video
} from "lucide-react";


function renderAdminPreview(md: string) {
  if (!md) return null;
  const blocks = md.split(/\n\s*\n/);
  return (
    <div className="flex flex-col gap-4 w-full text-left">
      {blocks.map((block, idx) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        if (trimmed.startsWith("#")) {
          const level = (trimmed.match(/^#+/) || ["#"])[0].length;
          const text = trimmed.replace(/^#+\s*/, "");
          if (level === 1) return <h4 key={idx} className="text-base font-black text-white border-b border-white/5 pb-1 mt-2">{text}</h4>;
          return <h5 key={idx} className="text-sm font-extrabold text-neutral-200 mt-2">{text}</h5>;
        }

        const imgMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
        if (imgMatch) {
          return (
            <div key={idx} className="border border-white/5 rounded-lg overflow-hidden bg-neutral-900 my-1 p-1 max-w-[240px]">
              <img src={imgMatch[2]} alt="" className="max-h-24 mx-auto object-contain" />
              <p className="text-[10px] text-neutral-500 text-center mt-1">{imgMatch[1]}</p>
            </div>
          );
        }

        const videoMatch = trimmed.match(/^@\[(.*?)\]\((.*?)\)$/);
        if (videoMatch) {
          return (
            <div key={idx} className="border border-white/5 rounded-lg bg-neutral-900 p-2 flex items-center gap-2 max-w-[240px] text-neutral-400">
              <Video className="w-4 h-4 text-orange-main" />
              <span className="text-[10px] font-bold line-clamp-1">{videoMatch[1] || "Video"}</span>
            </div>
          );
        }

        const htmlContent = trimmed
          .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
          .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-orange-main hover:underline">$1</a>');

        return <p key={idx} className="text-xs text-neutral-300 leading-relaxed font-medium" dangerouslySetInnerHTML={{ __html: htmlContent }} />;
      })}
    </div>
  );
}

interface MarkdownEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  inputId: string;
}

function MarkdownEditor({ value, onChange, placeholder, inputId }: MarkdownEditorProps) {
  const [activeMode, setActiveMode] = useState<"edit" | "preview">("edit");

  // Helper to insert markdown tags at cursor or end
  const insertTag = (prefix: string, suffix: string = "") => {
    const textarea = document.getElementById(inputId) as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      const selected = text.substring(start, end);
      const replacement = prefix + selected + suffix;
      onChange(text.substring(0, start) + replacement + text.substring(end));
      // Reset cursor position
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
      }, 0);
    } else {
      onChange(value + "\n" + prefix + suffix);
    }
  };

  return (
    <div className="flex flex-col border border-white/5 rounded-xl bg-neutral-900 overflow-hidden">
      {/* Editor Header / Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 bg-neutral-950 border-b border-white/5 select-none">
        {/* Formatting Toolbar */}
        <div className="flex items-center gap-1">
          {activeMode === "edit" ? (
            <>
              <button
                type="button"
                onClick={() => insertTag("# ", "")}
                title="Título Principal"
                className="p-1.5 text-neutral-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
              >
                <Heading1 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => insertTag("## ", "")}
                title="Subtítulo"
                className="p-1.5 text-neutral-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
              >
                <Heading2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => insertTag("**", "**")}
                title="Negrita"
                className="p-1.5 text-neutral-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
              >
                <Bold className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => insertTag("[", "](https://)")}
                title="Enlace"
                className="p-1.5 text-neutral-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
              >
                <LinkIcon className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => insertTag("! [Descripción Alt](", ")")}
                title="Imagen"
                className="p-1.5 text-neutral-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
              >
                <ImageIcon className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => insertTag("@ [Título Video](", ")")}
                title="Video (YouTube/Vimeo)"
                className="p-1.5 text-neutral-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
              >
                <Video className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest pl-2">Vista Previa de Maquetación</span>
          )}
        </div>

        {/* Mode Switch (Edit vs Preview Toggle) */}
        <div className="flex p-0.5 bg-neutral-900 rounded-lg border border-white/5">
          <button
            type="button"
            onClick={() => setActiveMode("edit")}
            className={`px-2.5 py-1 text-xs font-bold rounded-md flex items-center gap-1.5 transition-all cursor-pointer ${
              activeMode === "edit" ? "bg-white/10 text-white" : "text-neutral-500 hover:text-neutral-300"
            }`}
          >
            <Edit3 className="w-3 h-3" />
            <span>Editar</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMode("preview")}
            className={`px-2.5 py-1 text-xs font-bold rounded-md flex items-center gap-1.5 transition-all cursor-pointer ${
              activeMode === "preview" ? "bg-white/10 text-white" : "text-neutral-500 hover:text-neutral-300"
            }`}
          >
            <Eye className="w-3 h-3" />
            <span>Ver</span>
          </button>
        </div>
      </div>

      {/* Editor Content Area */}
      <div className="relative min-h-[180px]">
        {activeMode === "edit" ? (
          <textarea
            id={inputId}
            rows={8}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-transparent p-3 text-sm text-neutral-100 font-mono focus:outline-none placeholder:text-neutral-600 h-full min-h-[180px] resize-y"
          />
        ) : (
          <div className="p-4 bg-neutral-950/40 text-neutral-200 text-sm overflow-y-auto max-h-[300px] prose prose-invert max-w-none">
            {value ? (
              renderAdminPreview(value)
            ) : (
              <p className="text-xs text-neutral-600 italic select-none">Nada que previsualizar. Escribe algo de contenido detallado.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


interface AdminPanelProps {
  initialContent: any;
}

export default function AdminPanel({ initialContent }: AdminPanelProps) {
  const router = useRouter();
  const [content, setContent] = useState<any>(initialContent);
  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ type: "success" | "error" | null; message: string }>({
    type: null,
    message: ""
  });
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);
  const [inquiries, setInquiries] = useState<any[]>([]);

  // States for Image Cropping Modal
  const [isCropOpen, setIsCropOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState("");
  const [cropSlideIdx, setCropSlideIdx] = useState(-1);
  const [cropZoom, setCropZoom] = useState(1);
  const [cropX, setCropX] = useState(0);
  const [cropY, setCropY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isCroppingSave, setIsCroppingSave] = useState(false);
  const [imgDimensions, setImgDimensions] = useState({ width: 0, height: 0 });
  
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // Send content state to iframe
  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe && iframe.contentWindow && content) {
      iframe.contentWindow.postMessage({
        type: "PREVIEW_UPDATE",
        content,
        activeTab
      }, "*");
    }
  }, [content, activeTab]);

  // Listen to message from iframe to sync initial content when iframe is loaded
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data && e.data.type === "PREVIEW_READY") {
        const iframe = iframeRef.current;
        if (iframe && iframe.contentWindow && content) {
          iframe.contentWindow.postMessage({
            type: "PREVIEW_UPDATE",
            content,
            activeTab
          }, "*");
        }
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [content, activeTab]);
  const [isLoadingInquiries, setIsLoadingInquiries] = useState(false);

  const fetchInquiries = async () => {
    setIsLoadingInquiries(true);
    try {
      const res = await fetch("/api/admin/inquiries");
      if (res.ok) {
        const data = await res.json();
        setInquiries(data.inquiries || []);
      }
    } catch (err) {
      console.error("Error loading inquiries:", err);
    } finally {
      setIsLoadingInquiries(false);
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!confirm("¿Estás seguro de que deseas borrar esta consulta?")) return;
    try {
      const res = await fetch("/api/admin/delete-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setInquiries(prev => prev.filter(item => item.id !== id));
      } else {
        alert("Error al borrar la consulta");
      }
    } catch (err) {
      console.error("Error deleting inquiry:", err);
      alert("Error de red al borrar la consulta");
    }
  };

  useEffect(() => {
    if (activeTab === "contact") {
      const timer = setTimeout(() => {
        fetchInquiries();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [activeTab]);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus({ type: null, message: "" });
    try {
      const res = await fetch("/api/admin/save-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content)
      });
      if (res.ok) {
        setSaveStatus({ type: "success", message: "¡Cambios guardados correctamente!" });
        router.refresh();
      } else {
        const err = await res.json();
        setSaveStatus({ type: "error", message: err.error || "Error al guardar cambios" });
      }
    } catch (e) {
      setSaveStatus({ type: "error", message: "Error de red al guardar los cambios" });
    } finally {
      setIsSaving(false);
    }
  };

  // Listen to cropImageSrc updates to fetch natural dimensions
  useEffect(() => {
    if (!cropImageSrc) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = cropImageSrc;
    img.onload = () => {
      setImgDimensions({ width: img.naturalWidth, height: img.naturalHeight });
    };
  }, [cropImageSrc]);

  // Calculate drag boundaries to ensure container is fully covered by image (no black bars)
  const getDragLimits = (zoom: number) => {
    const container = previewRef.current;
    if (!container || imgDimensions.width === 0 || imgDimensions.height === 0) {
      return { limitX: 0, limitY: 0 };
    }

    const W_c = container.getBoundingClientRect().width;
    const H_c = container.getBoundingClientRect().height;

    const w_n = imgDimensions.width;
    const h_n = imgDimensions.height;

    // Scale factor to cover container (object-cover)
    const s_fit = Math.max(W_c / w_n, H_c / h_n);
    const W_r = w_n * s_fit;
    const H_r = h_n * s_fit;

    // Dimensions after custom user zoom
    const W_s = W_r * zoom;
    const H_s = H_r * zoom;

    // Max translation allowed in screen pixels
    const limitX = Math.max(0, (W_s - W_c) / 2);
    const limitY = Math.max(0, (H_s - H_c) / 2);

    return { limitX, limitY };
  };

  const handleZoomChange = (newZoom: number) => {
    setCropZoom(newZoom);
    
    // Clamp coordinates dynamically as user adjusts zoom
    const { limitX, limitY } = getDragLimits(newZoom);
    setCropX((prev) => Math.min(Math.max(prev, -limitX), limitX));
    setCropY((prev) => Math.min(Math.max(prev, -limitY), limitY));
  };

  // Drag-to-position crop handlers
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if ('clientX' in e) {
      e.preventDefault();
    }
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setDragStart({ x: clientX - cropX, y: clientY - cropY });
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const rawX = clientX - dragStart.x;
    const rawY = clientY - dragStart.y;

    const { limitX, limitY } = getDragLimits(cropZoom);

    // Apply clamped positioning to prevent black areas
    setCropX(Math.min(Math.max(rawX, -limitX), limitX));
    setCropY(Math.min(Math.max(rawY, -limitY), limitY));
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Image Crop logic
  const handleStartCrop = (src: string, idx: number) => {
    setCropImageSrc(src);
    setCropSlideIdx(idx);
    setCropZoom(1);
    setCropX(0);
    setCropY(0);
    setImgDimensions({ width: 0, height: 0 });
    setIsDragging(false);
    setIsCropOpen(true);
  };

  const handleApplyCrop = async () => {
    if (!cropImageSrc) return;
    setIsCroppingSave(true);

    try {
      const canvas = document.createElement("canvas");
      // Desired output width & height for the banner slider
      canvas.width = 1600;
      canvas.height = 800;

      // Measure the actual rendered preview width to convert positions perfectly
      const previewWidth = previewRef.current?.getBoundingClientRect().width || 500; 
      const scaleFactor = canvas.width / previewWidth;

      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not get canvas context");

      const img = new Image();
      img.crossOrigin = "anonymous";
      
      // Wait for image loading
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = (err) => reject(err);
        img.src = cropImageSrc;
      });

      // Calculate cover drawing dimensions (object-cover)
      const canvasRatio = canvas.width / canvas.height;
      const imgRatio = img.naturalWidth / img.naturalHeight;

      let drawWidth = canvas.width;
      let drawHeight = canvas.height;

      if (imgRatio > canvasRatio) {
        drawWidth = canvas.height * imgRatio;
      } else {
        drawHeight = canvas.width / imgRatio;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      
      // Center origin in canvas
      ctx.translate(canvas.width / 2, canvas.height / 2);
      
      // Apply scale (zoom)
      ctx.scale(cropZoom, cropZoom);
      
      // Apply offset (converting preview space to canvas space)
      ctx.translate((cropX * scaleFactor) / cropZoom, (cropY * scaleFactor) / cropZoom);

      // Draw image centered
      ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
      ctx.restore();

      // Convert to blob
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((b) => resolve(b), "image/jpeg", 0.92);
      });

      if (!blob) throw new Error("Failed to generate blob from canvas");

      const file = new File([blob], `cropped_slider_${cropSlideIdx}_${Date.now()}.jpg`, { type: "image/jpeg" });
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload-image", {
        method: "POST",
        body: formData
      });

      const data = await res.json();
      if (res.ok && data.url) {
        // Update list of slide media
        const list = [...(content.sliderFabrica?.media || [])];
        list[cropSlideIdx] = data.url;
        updateField("sliderFabrica", "media", list);
        setIsCropOpen(false);
      } else {
        alert(data.error || "Error al subir la imagen recortada");
      }
    } catch (error) {
      console.error("Error cropping image:", error);
      alert("Ocurrió un error al recortar la imagen. Verifica que la imagen sea accesible.");
    } finally {
      setIsCroppingSave(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, pathSelector: (url: string) => void, uploadKey: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(uploadKey);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload-image", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.url) {
        pathSelector(data.url);
      } else {
        alert(data.error || "Error al subir la imagen");
      }
    } catch (err) {
      alert("Error de red al subir la imagen");
    } finally {
      setUploadingImage(null);
    }
  };

  const updateField = (section: string, field: string, value: any) => {
    setContent((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const updateNestedField = (section: string, subsection: string, field: string, value: any) => {
    setContent((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...prev[section][subsection],
          [field]: value
        }
      }
    }));
  };

  const updateListItem = (section: string, listKey: string, index: number, field: string, value: any) => {
    setContent((prev: any) => {
      const list = [...prev[section][listKey]];
      list[index] = { ...list[index], [field]: value };
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [listKey]: list
        }
      };
    });
  };

  const addListItem = (section: string, listKey: string, newItem: any) => {
    setContent((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [listKey]: [...prev[section][listKey], newItem]
      }
    }));
  };

  const removeListItem = (section: string, listKey: string, index: number) => {
    setContent((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [listKey]: prev[section][listKey].filter((_: any, i: number) => i !== index)
      }
    }));
  };

  const setFeaturedCategory = (index: number) => {
    setContent((prev: any) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const categories = prev.heroAndShowcase.categories.map((cat: any, idx: number) => ({
        ...cat,
        isHeroFeatured: idx === index
      }));
      return {
        ...prev,
        heroAndShowcase: {
          ...prev.heroAndShowcase,
          categories
        }
      };
    });
  };

  const handleCategoryImageUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number, imageKey: string) => {
    handleImageUpload(
      e,
      (url) => updateListItem("heroAndShowcase", "categories", index, imageKey, url),
      `category-${index}-${imageKey}`
    );
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-orange-main/20 selection:text-orange-200">
      
      {/* Top sticky bar */}
      <header className="sticky top-0 z-30 bg-neutral-900/80 backdrop-blur-md border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/assets/logo.svg" alt="Logo" className="h-9 w-auto" />
          <div className="h-6 w-px bg-white/10 hidden sm:block" />
          <span className="text-sm font-black text-orange-main uppercase tracking-widest hidden sm:block">Panel de Edición</span>
        </div>

        <div className="flex items-center gap-4">
          {saveStatus.type && (
            <div className={`text-sm px-4 py-2 rounded-xl flex items-center gap-2 font-bold ${
              saveStatus.type === "success" 
                ? "bg-green-500/10 border border-green-500/20 text-green-400" 
                : "bg-red-main/10 border border-red-main/20 text-red-400"
            }`}>
              {saveStatus.type === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              <span>{saveStatus.message}</span>
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl bg-orange-main hover:bg-orange-600 font-bold text-sm text-white shadow-lg shadow-orange-main/15 flex items-center gap-2 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? "Guardando..." : "Guardar Cambios"}</span>
          </button>

          <button
            onClick={handleLogout}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            title="Cerrar Sesión"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main workspace */}
      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 bg-neutral-900/40 border-r border-white/5 p-4 flex flex-col gap-2">
          <button
            onClick={() => setActiveTab("general")}
            className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-bold transition-all text-left cursor-pointer ${
              activeTab === "general" ? "bg-white/10 text-white" : "text-neutral-400 hover:bg-white/5 hover:text-neutral-200"
            }`}
          >
            <Settings className="w-5 h-5 text-orange-main" />
            <span>Configuración General</span>
          </button>

          <button
            onClick={() => setActiveTab("hero")}
            className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-bold transition-all text-left cursor-pointer ${
              activeTab === "hero" ? "bg-white/10 text-white" : "text-neutral-400 hover:bg-white/5 hover:text-neutral-200"
            }`}
          >
            <Layers className="w-5 h-5 text-orange-main" />
            <span>Hero & Showcase</span>
          </button>

          <button
            onClick={() => setActiveTab("about")}
            className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-bold transition-all text-left cursor-pointer ${
              activeTab === "about" ? "bg-white/10 text-white" : "text-neutral-400 hover:bg-white/5 hover:text-neutral-200"
            }`}
          >
            <Users className="w-5 h-5 text-orange-main" />
            <span>Página Nosotros</span>
          </button>

          <button
            onClick={() => setActiveTab("works")}
            className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-bold transition-all text-left cursor-pointer ${
              activeTab === "works" ? "bg-white/10 text-white" : "text-neutral-400 hover:bg-white/5 hover:text-neutral-200"
            }`}
          >
            <FolderOpen className="w-5 h-5 text-orange-main" />
            <span>Página Trabajos</span>
          </button>

          <button
            onClick={() => setActiveTab("products")}
            className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-bold transition-all text-left cursor-pointer ${
              activeTab === "products" ? "bg-white/10 text-white" : "text-neutral-400 hover:bg-white/5 hover:text-neutral-200"
            }`}
          >
            <Tag className="w-5 h-5 text-orange-main" />
            <span>Productos & Categorías</span>
          </button>

          <button
            onClick={() => setActiveTab("stories")}
            className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-bold transition-all text-left cursor-pointer ${
              activeTab === "stories" ? "bg-white/10 text-white" : "text-neutral-400 hover:bg-white/5 hover:text-neutral-200"
            }`}
          >
            <Briefcase className="w-5 h-5 text-orange-main" />
            <span>Clientes & Casos</span>
          </button>

          <button
            onClick={() => setActiveTab("services")}
            className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-bold transition-all text-left cursor-pointer ${
              activeTab === "services" ? "bg-white/10 text-white" : "text-neutral-400 hover:bg-white/5 hover:text-neutral-200"
            }`}
          >
            <Layers className="w-5 h-5 text-orange-main" />
            <span>Servicios & Fábrica</span>
          </button>

          <button
            onClick={() => setActiveTab("cta")}
            className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-bold transition-all text-left cursor-pointer ${
              activeTab === "cta" ? "bg-white/10 text-white" : "text-neutral-400 hover:bg-white/5 hover:text-neutral-200"
            }`}
          >
            <Megaphone className="w-5 h-5 text-orange-main" />
            <span>Sección CTA</span>
          </button>

          <button
            onClick={() => setActiveTab("faqs")}
            className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-bold transition-all text-left cursor-pointer ${
              activeTab === "faqs" ? "bg-white/10 text-white" : "text-neutral-400 hover:bg-white/5 hover:text-neutral-200"
            }`}
          >
            <HelpCircle className="w-5 h-5 text-orange-main" />
            <span>Preguntas Frecuentes</span>
          </button>

          <button
            onClick={() => setActiveTab("contact")}
            className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-bold transition-all text-left cursor-pointer ${
              activeTab === "contact" ? "bg-white/10 text-white" : "text-neutral-400 hover:bg-white/5 hover:text-neutral-200"
            }`}
          >
            <Mail className="w-5 h-5 text-orange-main" />
            <span>Contacto & Mensajes</span>
          </button>
        </aside>

        {/* Content editor block */}
        <main className="flex-1 p-6 md:p-10 max-w-5xl overflow-y-auto">
          
          {/* TAB 1: GENERAL & LOGOS */}
          {activeTab === "general" && (
            <div className="flex flex-col gap-8">
              <div>
                <h2 className="text-xl font-black text-neutral-100">Configuración General</h2>
                <p className="text-sm text-neutral-500 mt-1">Configura detalles globales de identidad del sitio.</p>
              </div>

              {/* Logo section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Normal Logo */}
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 flex gap-6 items-center">
                  <div className="w-24 h-24 bg-neutral-900 border border-white/10 rounded-xl flex items-center justify-center p-3 relative shrink-0">
                    {content.navbar?.logo ? (
                      <img src={content.navbar.logo} alt="Navbar Logo" className="max-h-full object-contain" />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-neutral-600" />
                    )}
                  </div>
                  <div className="flex-1 flex flex-col gap-3 w-full">
                    <label className="text-sm font-bold text-neutral-300">Logo de Cabecera</label>
                    <p className="text-xs text-neutral-500">Se sugiere un formato SVG o PNG transparente.</p>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, (url) => updateField("navbar", "logo", url), "navbar-logo")}
                        className="hidden"
                        id="upload-navbar-logo"
                      />
                      <label
                        htmlFor="upload-navbar-logo"
                        className="px-4 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-sm font-bold text-neutral-200 cursor-pointer inline-flex items-center gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        <span>{uploadingImage === "navbar-logo" ? "Subiendo..." : "Subir Logo"}</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* White Logo */}
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 flex gap-6 items-center">
                  <div className="w-24 h-24 bg-neutral-900 border border-white/10 rounded-xl flex items-center justify-center p-3 relative shrink-0">
                    {content.navbar?.logoWhite ? (
                      <img src={content.navbar.logoWhite} alt="Navbar White Logo" className="max-h-full object-contain" />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-neutral-600" />
                    )}
                  </div>
                  <div className="flex-1 flex flex-col gap-3 w-full">
                    <label className="text-sm font-bold text-neutral-300">Logo Blanco / Monocromático</label>
                    <p className="text-xs text-neutral-500">Para fondos oscuros (e.g. sección CTA).</p>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, (url) => updateField("navbar", "logoWhite", url), "navbar-logo-white")}
                        className="hidden"
                        id="upload-navbar-logo-white"
                      />
                      <label
                        htmlFor="upload-navbar-logo-white"
                        className="px-4 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-sm font-bold text-neutral-200 cursor-pointer inline-flex items-center gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        <span>{uploadingImage === "navbar-logo-white" ? "Subiendo..." : "Subir Logo Blanco"}</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* General inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Footer Tagline</label>
                  <input
                    type="text"
                    value={content.footer?.tagline || ""}
                    onChange={(e) => updateField("footer", "tagline", e.target.value)}
                    className="w-full bg-neutral-900 border border-white/5 focus:border-orange-main rounded-xl py-3 px-4 text-sm font-semibold text-neutral-100 focus:outline-none transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Texto Botón de Cabecera</label>
                  <input
                    type="text"
                    value={content.navbar?.contactLabel || ""}
                    onChange={(e) => updateField("navbar", "contactLabel", e.target.value)}
                    className="w-full bg-neutral-900 border border-white/5 focus:border-orange-main rounded-xl py-3 px-4 text-sm font-semibold text-neutral-100 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Color Customization Section */}
              <div className="border-t border-white/5 pt-6 flex flex-col gap-6">
                <div>
                  <h3 className="text-lg font-black text-neutral-200">Colores de la Web</h3>
                  <p className="text-xs text-neutral-500 mt-1">Modifica la paleta de colores corporativos aplicados en toda la landing page.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {/* Background Color */}
                  <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl flex items-center justify-between gap-4">
                    <div className="flex flex-col gap-1.5 flex-1">
                      <label className="text-[10px] font-bold text-neutral-400 uppercase">Fondo de Página</label>
                      <input
                        type="text"
                        value={content.theme?.background || "#faf9fa"}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateField("theme", "background", val);
                          updateField("theme", "neutral50", val); // sync neutral-50
                        }}
                        className="bg-neutral-900 border border-white/5 rounded-lg py-1.5 px-3 text-xs text-neutral-200 focus:outline-none"
                      />
                    </div>
                    <input
                      type="color"
                      value={content.theme?.background || "#faf9fa"}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateField("theme", "background", val);
                        updateField("theme", "neutral50", val);
                      }}
                      className="w-10 h-10 rounded-lg border border-white/10 cursor-pointer overflow-hidden bg-transparent shrink-0"
                    />
                  </div>

                  {/* Foreground/Text Color */}
                  <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl flex items-center justify-between gap-4">
                    <div className="flex flex-col gap-1.5 flex-1">
                      <label className="text-[10px] font-bold text-neutral-400 uppercase">Texto Principal</label>
                      <input
                        type="text"
                        value={content.theme?.foreground || "#19191a"}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateField("theme", "foreground", val);
                          updateField("theme", "neutral900", val); // sync neutral-900
                        }}
                        className="bg-neutral-900 border border-white/5 rounded-lg py-1.5 px-3 text-xs text-neutral-200 focus:outline-none"
                      />
                    </div>
                    <input
                      type="color"
                      value={content.theme?.foreground || "#19191a"}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateField("theme", "foreground", val);
                        updateField("theme", "neutral900", val);
                      }}
                      className="w-10 h-10 rounded-lg border border-white/10 cursor-pointer overflow-hidden bg-transparent shrink-0"
                    />
                  </div>

                  {/* Primary Orange */}
                  <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl flex items-center justify-between gap-4">
                    <div className="flex flex-col gap-1.5 flex-1">
                      <label className="text-[10px] font-bold text-neutral-400 uppercase">Naranja Principal</label>
                      <input
                        type="text"
                        value={content.theme?.orangeMain || "#f68322"}
                        onChange={(e) => updateField("theme", "orangeMain", e.target.value)}
                        className="bg-neutral-900 border border-white/5 rounded-lg py-1.5 px-3 text-xs text-neutral-200 focus:outline-none"
                      />
                    </div>
                    <input
                      type="color"
                      value={content.theme?.orangeMain || "#f68322"}
                      onChange={(e) => updateField("theme", "orangeMain", e.target.value)}
                      className="w-10 h-10 rounded-lg border border-white/10 cursor-pointer overflow-hidden bg-transparent shrink-0"
                    />
                  </div>

                  {/* Primary Orange Hover */}
                  <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl flex items-center justify-between gap-4">
                    <div className="flex flex-col gap-1.5 flex-1">
                      <label className="text-[10px] font-bold text-neutral-400 uppercase">Naranja Hover (Intermedio)</label>
                      <input
                        type="text"
                        value={content.theme?.orange600 || "#e7630f"}
                        onChange={(e) => updateField("theme", "orange600", e.target.value)}
                        className="bg-neutral-900 border border-white/5 rounded-lg py-1.5 px-3 text-xs text-neutral-200 focus:outline-none"
                      />
                    </div>
                    <input
                      type="color"
                      value={content.theme?.orange600 || "#e7630f"}
                      onChange={(e) => updateField("theme", "orange600", e.target.value)}
                      className="w-10 h-10 rounded-lg border border-white/10 cursor-pointer overflow-hidden bg-transparent shrink-0"
                    />
                  </div>

                  {/* Primary Orange Dark */}
                  <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl flex items-center justify-between gap-4">
                    <div className="flex flex-col gap-1.5 flex-1">
                      <label className="text-[10px] font-bold text-neutral-400 uppercase">Naranja Oscuro (Borde/Fondo)</label>
                      <input
                        type="text"
                        value={content.theme?.orange700 || "#bf4b0f"}
                        onChange={(e) => updateField("theme", "orange700", e.target.value)}
                        className="bg-neutral-900 border border-white/5 rounded-lg py-1.5 px-3 text-xs text-neutral-200 focus:outline-none"
                      />
                    </div>
                    <input
                      type="color"
                      value={content.theme?.orange700 || "#bf4b0f"}
                      onChange={(e) => updateField("theme", "orange700", e.target.value)}
                      className="w-10 h-10 rounded-lg border border-white/10 cursor-pointer overflow-hidden bg-transparent shrink-0"
                    />
                  </div>

                  {/* Red Main */}
                  <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl flex items-center justify-between gap-4">
                    <div className="flex flex-col gap-1.5 flex-1">
                      <label className="text-[10px] font-bold text-neutral-400 uppercase">Rojo Primario (Detalles)</label>
                      <input
                        type="text"
                        value={content.theme?.redMain || "#f53722"}
                        onChange={(e) => updateField("theme", "redMain", e.target.value)}
                        className="bg-neutral-900 border border-white/5 rounded-lg py-1.5 px-3 text-xs text-neutral-200 focus:outline-none"
                      />
                    </div>
                    <input
                      type="color"
                      value={content.theme?.redMain || "#f53722"}
                      onChange={(e) => updateField("theme", "redMain", e.target.value)}
                      className="w-10 h-10 rounded-lg border border-white/10 cursor-pointer overflow-hidden bg-transparent shrink-0"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: HERO & SHOWCASE */}
          {activeTab === "hero" && (
            <div className="flex flex-col gap-8">
              <div>
                <h2 className="text-xl font-black text-neutral-100">Hero & Showcase</h2>
                <p className="text-sm text-neutral-500 mt-1">Modifica el texto principal de bienvenida y las tarjetas animadas.</p>
              </div>

              {/* Text Fields */}
              <div className="grid grid-cols-1 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Título Principal (Pre-destacado)</label>
                  <input
                    type="text"
                    value={content.heroAndShowcase?.title || ""}
                    onChange={(e) => updateField("heroAndShowcase", "title", e.target.value)}
                    className="w-full bg-neutral-900 border border-white/5 focus:border-orange-main rounded-xl py-3 px-4 text-sm font-semibold text-neutral-100 focus:outline-none transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Título Principal (Texto Resaltado)</label>
                  <input
                    type="text"
                    value={content.heroAndShowcase?.highlight || ""}
                    onChange={(e) => updateField("heroAndShowcase", "highlight", e.target.value)}
                    className="w-full bg-neutral-900 border border-white/5 focus:border-orange-main rounded-xl py-3 px-4 text-sm font-semibold text-neutral-100 focus:outline-none transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Tagline de Marca</label>
                  <input
                    type="text"
                    value={content.heroAndShowcase?.tagline || ""}
                    onChange={(e) => updateField("heroAndShowcase", "tagline", e.target.value)}
                    className="w-full bg-neutral-900 border border-white/5 focus:border-orange-main rounded-xl py-3 px-4 text-sm font-semibold text-neutral-100 focus:outline-none transition-colors"
                  />
              </div>
            </div>

              {/* Showcase Cards Section */}
              <div className="flex flex-col gap-4 border-t border-white/5 pt-6">
                <div>
                  <h3 className="text-lg font-black text-neutral-200">Tarjetas de la Galería Animada (Showcase)</h3>
                  <p className="text-xs text-neutral-500 mt-1">Reemplaza las 7 fotos principales que flotan y se animan en el Hero y el Showcase.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {content.heroAndShowcase?.cards?.map((card: any, idx: number) => (
                    <div key={idx} className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl flex flex-col gap-4">
                      <div className="flex items-center justify-between border-b border-white/5 pb-2">
                        <span className="text-sm font-black text-orange-main">Tarjeta #{idx + 1}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-900 border border-white/10 text-neutral-400 font-semibold">{card.tag}</span>
                      </div>

                      {/* Card Image Preview */}
                      <div className="w-full h-44 bg-neutral-900 border border-white/10 rounded-xl flex items-center justify-center relative overflow-hidden group">
                        {card.src ? (
                          <img src={card.src} alt="" className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105" />
                        ) : (
                          <ImageIcon className="w-8 h-8 text-neutral-700" />
                        )}
                        {uploadingImage === `card-${idx}` && (
                          <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center text-xs font-bold text-orange-main">
                            Subiendo...
                          </div>
                        )}
                      </div>

                      {/* Image Upload Controls */}
                      <div className="flex flex-col gap-3">
                        <div className="flex gap-3 items-center">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, (url) => updateListItem("heroAndShowcase", "cards", idx, "src", url), `card-${idx}`)}
                            className="hidden"
                            id={`upload-card-${idx}`}
                          />
                          <label
                            htmlFor={`upload-card-${idx}`}
                            className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-xs font-bold text-neutral-200 cursor-pointer inline-flex items-center justify-center gap-2 transition-colors"
                          >
                            <Upload className="w-3.5 h-3.5 text-neutral-400" />
                            <span>{uploadingImage === `card-${idx}` ? "Subiendo..." : "Cambiar Foto"}</span>
                          </label>
                        </div>

                        {/* Category tag select */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Categoría Asoc.</label>
                          <select
                            value={card.tag}
                            onChange={(e) => updateListItem("heroAndShowcase", "cards", idx, "tag", e.target.value)}
                            className="w-full bg-neutral-900 border border-white/5 focus:border-orange-main rounded-lg py-2 px-3 text-sm text-neutral-200 focus:outline-none cursor-pointer transition-colors"
                          >
                            {content.heroAndShowcase?.categories?.map((cat: any) => (
                              <option key={cat.id} value={cat.id}>
                                {cat.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Collapsible advanced position adjustments */}
                      <details className="group border-t border-white/5 pt-3">
                        <summary className="flex items-center justify-between text-xs font-bold text-neutral-400 hover:text-neutral-200 cursor-pointer list-none select-none">
                          <span>Ajustes de Posición (Avanzado)</span>
                          <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90 text-neutral-500" />
                        </summary>
                        
                        <div className="flex flex-col gap-4 mt-4 text-left">
                          <div>
                            <span className="text-[10px] font-black text-orange-main uppercase tracking-widest block mb-2 border-b border-white/5 pb-1">
                              Pantalla de Inicio (Hero View)
                            </span>
                            <div className="grid grid-cols-3 gap-2">
                              <div className="flex flex-col gap-1">
                                <label className="text-[9px] text-neutral-500 font-bold">Desk X (px)</label>
                                <input
                                  type="number"
                                  value={card.heroDesktopX}
                                  onChange={(e) => updateListItem("heroAndShowcase", "cards", idx, "heroDesktopX", Number(e.target.value))}
                                  className="bg-neutral-900 border border-white/5 rounded-md py-1 px-2 text-xs text-neutral-200 focus:outline-none"
                                />
                              </div>
                              <div className="flex flex-col gap-1">
                                <label className="text-[9px] text-neutral-500 font-bold">Desk Y (px)</label>
                                <input
                                  type="number"
                                  value={card.heroDesktopY}
                                  onChange={(e) => updateListItem("heroAndShowcase", "cards", idx, "heroDesktopY", Number(e.target.value))}
                                  className="bg-neutral-900 border border-white/5 rounded-md py-1 px-2 text-xs text-neutral-200 focus:outline-none"
                                />
                              </div>
                              <div className="flex flex-col gap-1">
                                <label className="text-[9px] text-neutral-500 font-bold">Rotación (°)</label>
                                <input
                                  type="number"
                                  step="any"
                                  value={card.heroRotate}
                                  onChange={(e) => updateListItem("heroAndShowcase", "cards", idx, "heroRotate", Number(e.target.value))}
                                  className="bg-neutral-900 border border-white/5 rounded-md py-1 px-2 text-xs text-neutral-200 focus:outline-none"
                                />
                              </div>
                              <div className="flex flex-col gap-1">
                                <label className="text-[9px] text-neutral-500 font-bold">Mob X (px)</label>
                                <input
                                  type="number"
                                  value={card.heroMobileX}
                                  onChange={(e) => updateListItem("heroAndShowcase", "cards", idx, "heroMobileX", Number(e.target.value))}
                                  className="bg-neutral-900 border border-white/5 rounded-md py-1 px-2 text-xs text-neutral-200 focus:outline-none"
                                />
                              </div>
                              <div className="flex flex-col gap-1">
                                <label className="text-[9px] text-neutral-500 font-bold">Mob Y (px)</label>
                                <input
                                  type="number"
                                  value={card.heroMobileY}
                                  onChange={(e) => updateListItem("heroAndShowcase", "cards", idx, "heroMobileY", Number(e.target.value))}
                                  className="bg-neutral-900 border border-white/5 rounded-md py-1 px-2 text-xs text-neutral-200 focus:outline-none"
                                />
                              </div>
                            </div>
                          </div>

                          <div>
                            <span className="text-[10px] font-black text-orange-main uppercase tracking-widest block mb-2 border-b border-white/5 pb-1">
                              Pantalla Showcase (Showcase View)
                            </span>
                            <div className="grid grid-cols-3 gap-2">
                              <div className="flex flex-col gap-1">
                                <label className="text-[9px] text-neutral-500 font-bold">Desk X (px)</label>
                                <input
                                  type="number"
                                  value={card.showcaseDesktopX}
                                  onChange={(e) => updateListItem("heroAndShowcase", "cards", idx, "showcaseDesktopX", Number(e.target.value))}
                                  className="bg-neutral-900 border border-white/5 rounded-md py-1 px-2 text-xs text-neutral-200 focus:outline-none"
                                />
                              </div>
                              <div className="flex flex-col gap-1">
                                <label className="text-[9px] text-neutral-500 font-bold">Desk Y (px)</label>
                                <input
                                  type="number"
                                  value={card.showcaseDesktopY}
                                  onChange={(e) => updateListItem("heroAndShowcase", "cards", idx, "showcaseDesktopY", Number(e.target.value))}
                                  className="bg-neutral-900 border border-white/5 rounded-md py-1 px-2 text-xs text-neutral-200 focus:outline-none"
                                />
                              </div>
                              <div className="flex flex-col gap-1">
                                <label className="text-[9px] text-neutral-500 font-bold">Rotación (°)</label>
                                <input
                                  type="number"
                                  step="any"
                                  value={card.showcaseRotate}
                                  onChange={(e) => updateListItem("heroAndShowcase", "cards", idx, "showcaseRotate", Number(e.target.value))}
                                  className="bg-neutral-900 border border-white/5 rounded-md py-1 px-2 text-xs text-neutral-200 focus:outline-none"
                                />
                              </div>
                              <div className="flex flex-col gap-1">
                                <label className="text-[9px] text-neutral-500 font-bold">Mob X (px)</label>
                                <input
                                  type="number"
                                  value={card.showcaseMobileX}
                                  onChange={(e) => updateListItem("heroAndShowcase", "cards", idx, "showcaseMobileX", Number(e.target.value))}
                                  className="bg-neutral-900 border border-white/5 rounded-md py-1 px-2 text-xs text-neutral-200 focus:outline-none"
                                />
                              </div>
                              <div className="flex flex-col gap-1">
                                <label className="text-[9px] text-neutral-500 font-bold">Mob Y (px)</label>
                                <input
                                  type="number"
                                  value={card.showcaseMobileY}
                                  onChange={(e) => updateListItem("heroAndShowcase", "cards", idx, "showcaseMobileY", Number(e.target.value))}
                                  className="bg-neutral-900 border border-white/5 rounded-md py-1 px-2 text-xs text-neutral-200 focus:outline-none"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </details>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CLIENTS & CASES */}
          {activeTab === "stories" && (
            <div className="flex flex-col gap-8">
              <div>
                <h2 className="text-xl font-black text-neutral-100">Clientes & Casos de éxito</h2>
                <p className="text-sm text-neutral-500 mt-1">Administra los logotipos de clientes de la marquesina e historias destacadas.</p>
              </div>

              {/* Client logos marquee */}
              <div className="flex flex-col gap-4 border-b border-white/5 pb-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-neutral-200">Logos Marquee</h3>
                  <button
                    type="button"
                    onClick={() => addListItem("clientLogos", "logos", { src: "", alt: "Nuevo Cliente", width: 120 })}
                    className="px-3 py-1.5 rounded-lg bg-orange-main text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Agregar Logo</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {content.clientLogos?.logos?.map((logo: any, idx: number) => (
                    <div key={idx} className="bg-white/[0.02] border border-white/5 p-4 rounded-xl flex items-center gap-4">
                      <div className="w-16 h-16 bg-neutral-950 border border-white/10 rounded-lg flex items-center justify-center p-2 relative">
                        {logo.src ? (
                          <img src={logo.src} alt="" className="max-h-full object-contain" />
                        ) : (
                          <ImageIcon className="w-6 h-6 text-neutral-600" />
                        )}
                      </div>
                      
                      <div className="flex-1 flex flex-col gap-2">
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, (url) => updateListItem("clientLogos", "logos", idx, "src", url), `client-logo-${idx}`)}
                            className="hidden"
                            id={`upload-logo-${idx}`}
                          />
                          <label
                            htmlFor={`upload-logo-${idx}`}
                            className="px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 text-xs font-bold text-neutral-300 cursor-pointer inline-flex items-center gap-1.5"
                          >
                            <Upload className="w-3 h-3" />
                            <span>{uploadingImage === `client-logo-${idx}` ? "Subiendo..." : "Subir"}</span>
                          </label>
                        </div>
                        <input
                          type="text"
                          placeholder="Alt text"
                          value={logo.alt}
                          onChange={(e) => updateListItem("clientLogos", "logos", idx, "alt", e.target.value)}
                          className="bg-neutral-900 border border-white/5 rounded-lg py-1 px-2.5 text-xs text-neutral-200 focus:outline-none"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => removeListItem("clientLogos", "logos", idx)}
                        className="p-2 text-red-400 hover:bg-red-main/10 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Success stories */}
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-neutral-200">Casos de Éxito</h3>
                  <button
                    type="button"
                    onClick={() => addListItem("successStories", "stories", { logo: "", title: "Nuevo caso", description: "Descripción", badge: "Categoría", mockups: ["", "", ""] })}
                    className="px-3 py-1.5 rounded-lg bg-orange-main text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Agregar Caso</span>
                  </button>
                </div>

                <div className="flex flex-col gap-6">
                  {content.successStories?.stories?.map((story: any, idx: number) => (
                    <div key={idx} className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl flex flex-col gap-4">
                      <div className="flex items-center justify-between border-b border-white/5 pb-3">
                        <span className="text-sm font-black text-orange-main">Caso #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeListItem("successStories", "stories", idx)}
                          className="p-1.5 text-red-400 hover:bg-red-main/10 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-neutral-400">Badge/Categoría</label>
                          <input
                            type="text"
                            value={story.badge}
                            onChange={(e) => updateListItem("successStories", "stories", idx, "badge", e.target.value)}
                            className="bg-neutral-900 border border-white/5 rounded-lg py-2 px-3 text-sm text-neutral-100 focus:outline-none"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5 md:col-span-2">
                          <label className="text-xs font-bold text-neutral-400">Título</label>
                          <input
                            type="text"
                            value={story.title}
                            onChange={(e) => updateListItem("successStories", "stories", idx, "title", e.target.value)}
                            className="bg-neutral-900 border border-white/5 rounded-lg py-2 px-3 text-sm text-neutral-100 focus:outline-none"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5 md:col-span-3">
                          <label className="text-xs font-bold text-neutral-400">Descripción</label>
                          <textarea
                            rows={3}
                            value={story.description}
                            onChange={(e) => updateListItem("successStories", "stories", idx, "description", e.target.value)}
                            className="bg-neutral-900 border border-white/5 rounded-lg py-2 px-3 text-sm text-neutral-100 focus:outline-none resize-none"
                          />
                        </div>
                      </div>

                      {/* Mockups list */}
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-neutral-400">Imágenes Mockups (3 Requeridas)</label>
                        <div className="grid grid-cols-3 gap-4">
                          {[0, 1, 2].map((mIdx) => (
                            <div key={mIdx} className="bg-neutral-950 border border-white/5 rounded-xl p-3 flex flex-col items-center gap-3">
                              <div className="w-full h-24 bg-neutral-900 border border-white/10 rounded-lg flex items-center justify-center p-1 relative overflow-hidden">
                                {story.mockups?.[mIdx] ? (
                                  <img src={story.mockups[mIdx]} alt="" className="max-h-full max-w-full object-cover" />
                                ) : (
                                  <ImageIcon className="w-6 h-6 text-neutral-700" />
                                )}
                              </div>
                              <div className="relative w-full text-center">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleImageUpload(e, (url) => {
                                    const mockups = [...(story.mockups || ["", "", ""])];
                                    mockups[mIdx] = url;
                                    updateListItem("successStories", "stories", idx, "mockups", mockups);
                                  }, `story-${idx}-mockup-${mIdx}`)}
                                  className="hidden"
                                  id={`upload-story-${idx}-mockup-${mIdx}`}
                                />
                                <label
                                  htmlFor={`upload-story-${idx}-mockup-${mIdx}`}
                                  className="px-2.5 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 text-[10px] font-bold text-neutral-300 cursor-pointer inline-flex items-center gap-1.5"
                                >
                                  <Upload className="w-3 h-3" />
                                  <span>{uploadingImage === `story-${idx}-mockup-${mIdx}` ? "Subiendo..." : "Subir"}</span>
                                </label>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Detailed Markdown Content */}
                      <div className="flex flex-col gap-1.5 mt-4">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-neutral-400">Contenido Detallado del Caso</label>
                        </div>
                        <MarkdownEditor
                          inputId={`story-md-editor-${idx}`}
                          placeholder="# Título de sección&#10;&#10;Este es un párrafo de texto...&#10;&#10;![Imagen](/assets/ejemplo.jpg)&#10;&#10;@[Video](https://vimeo.com/...)"
                          value={story.contentMarkdown || ""}
                          onChange={(val) => updateListItem("successStories", "stories", idx, "contentMarkdown", val)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SERVICES & TOUR */}
          {activeTab === "services" && (
            <div className="flex flex-col gap-8">
              <div>
                <h2 className="text-xl font-black text-neutral-100">Servicios & Fábrica</h2>
                <p className="text-sm text-neutral-500 mt-1">Edita los servicios de la grilla y los hotspots de la fábrica.</p>
              </div>

              {/* Services editing */}
              <div className="flex flex-col gap-4 border-b border-white/5 pb-8">
                <h3 className="text-lg font-black text-neutral-200">Nuestros Servicios</h3>
                <div className="flex flex-col gap-6">
                  {content.services?.servicesList?.map((service: any, idx: number) => (
                    <div key={idx} className="bg-white/[0.02] border border-white/5 p-4 rounded-xl flex flex-col md:flex-row gap-4 items-start">
                      <div className="w-28 h-28 bg-neutral-900 border border-white/10 rounded-lg flex items-center justify-center p-2 relative shrink-0">
                        {service.img ? (
                          <img src={service.img} alt="" className="max-h-full object-contain" />
                        ) : (
                          <ImageIcon className="w-8 h-8 text-neutral-600" />
                        )}
                      </div>
                      
                      <div className="flex-1 flex flex-col gap-3 w-full">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <input
                            type="text"
                            value={service.title}
                            onChange={(e) => updateListItem("services", "servicesList", idx, "title", e.target.value)}
                            placeholder="Nombre del servicio"
                            className="bg-neutral-900 border border-white/5 rounded-lg py-2 px-3 text-sm text-neutral-100 focus:outline-none"
                          />
                          <div className="relative">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, (url) => updateListItem("services", "servicesList", idx, "img", url), `service-${idx}`)}
                              className="hidden"
                              id={`upload-service-${idx}`}
                            />
                            <label
                              htmlFor={`upload-service-${idx}`}
                              className="px-3 py-2 rounded-lg border border-white/10 hover:bg-white/5 text-xs font-bold text-neutral-300 cursor-pointer inline-flex items-center gap-1.5"
                            >
                              <Upload className="w-3.5 h-3.5" />
                              <span>{uploadingImage === `service-${idx}` ? "Subiendo..." : "Cambiar Imagen"}</span>
                            </label>
                          </div>
                        </div>
                        <textarea
                          rows={2}
                          value={service.desc}
                          onChange={(e) => updateListItem("services", "servicesList", idx, "desc", e.target.value)}
                          placeholder="Descripción breve"
                          className="bg-neutral-900 border border-white/5 rounded-lg py-2 px-3 text-sm text-neutral-100 focus:outline-none resize-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Factory Tour (Hotspots) */}
              <div className="flex flex-col gap-4">
                <h3 className="text-lg font-black text-neutral-200">Fábrica (Hotspots)</h3>
                <div className="flex flex-col gap-6">
                  {/* General Factory Tour Settings */}
                  <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl flex flex-col gap-4">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <span className="text-sm font-bold text-neutral-200">Planta Completa (General)</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex flex-col gap-1.5 md:col-span-2">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase">Video URL (Planta Completa)</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={content.factoryTour?.video || ""}
                            placeholder="Ej. /uploads/video.mp4 o URL externa"
                            onChange={(e) => updateField("factoryTour", "video", e.target.value)}
                            className="flex-1 bg-neutral-900 border border-white/5 rounded-lg py-2 px-3 text-xs text-neutral-100 focus:outline-none"
                          />
                          <div className="relative shrink-0">
                            <input
                              type="file"
                              accept="video/*"
                              onChange={(e) => handleImageUpload(e, (url) => updateField("factoryTour", "video", url), "factory-tour-video")}
                              className="hidden"
                              id="upload-factory-tour-video"
                            />
                            <label
                              htmlFor="upload-factory-tour-video"
                              className="px-3 py-2 rounded-lg border border-white/10 hover:bg-white/5 text-xs font-bold text-neutral-300 cursor-pointer inline-flex items-center gap-1.5 h-full"
                            >
                              <Upload className="w-3.5 h-3.5" />
                              <span>{uploadingImage === "factory-tour-video" ? "Subiendo..." : "Subir Video"}</span>
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Thumbnail URL & Upload */}
                      <div className="flex flex-col gap-1.5 md:col-span-2">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase">Miniatura de Video (Planta Completa)</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={content.factoryTour?.thumbnail || ""}
                            placeholder="Ej. /uploads/miniatura.jpg o URL externa"
                            onChange={(e) => updateField("factoryTour", "thumbnail", e.target.value)}
                            className="flex-1 bg-neutral-900 border border-white/5 rounded-lg py-2 px-3 text-xs text-neutral-100 focus:outline-none"
                          />
                          <div className="relative shrink-0">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, (url) => updateField("factoryTour", "thumbnail", url), "factory-tour-thumbnail")}
                              className="hidden"
                              id="upload-factory-tour-thumbnail"
                            />
                            <label
                              htmlFor="upload-factory-tour-thumbnail"
                              className="px-3 py-2 rounded-lg border border-white/10 hover:bg-white/5 text-xs font-bold text-neutral-300 cursor-pointer inline-flex items-center gap-1.5 h-full"
                            >
                              <Upload className="w-3.5 h-3.5" />
                              <span>{uploadingImage === "factory-tour-thumbnail" ? "Subiendo..." : "Subir Imagen"}</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {content.factoryTour?.departments?.map((dept: any, idx: number) => (
                    <div key={idx} className="bg-white/[0.02] border border-white/5 p-4 rounded-xl flex flex-col gap-4">
                      <div className="flex items-center justify-between border-b border-white/5 pb-2">
                        <span className="text-sm font-bold text-neutral-200">{dept.name}</span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold text-neutral-400 uppercase">Título Área</label>
                          <input
                            type="text"
                            value={dept.title}
                            onChange={(e) => updateListItem("factoryTour", "departments", idx, "title", e.target.value)}
                            className="bg-neutral-900 border border-white/5 rounded-lg py-2 px-3 text-xs text-neutral-100 focus:outline-none"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5 md:col-span-2">
                          <label className="text-[10px] font-bold text-neutral-400 uppercase">Descripción</label>
                          <input
                            type="text"
                            value={dept.desc}
                            onChange={(e) => updateListItem("factoryTour", "departments", idx, "desc", e.target.value)}
                            className="bg-neutral-900 border border-white/5 rounded-lg py-2 px-3 text-xs text-neutral-100 focus:outline-none"
                          />
                        </div>

                        {/* Coordinates */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold text-neutral-400 uppercase">Coord X Desktop (e.g. 206px)</label>
                          <input
                            type="text"
                            value={dept.left}
                            onChange={(e) => updateListItem("factoryTour", "departments", idx, "left", e.target.value)}
                            className="bg-neutral-900 border border-white/5 rounded-lg py-2 px-3 text-xs text-neutral-100 focus:outline-none"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold text-neutral-400 uppercase">Coord Y Desktop (e.g. 174px)</label>
                          <input
                            type="text"
                            value={dept.top}
                            onChange={(e) => updateListItem("factoryTour", "departments", idx, "top", e.target.value)}
                            className="bg-neutral-900 border border-white/5 rounded-lg py-2 px-3 text-xs text-neutral-100 focus:outline-none"
                          />
                        </div>

                        <div className="flex flex-col justify-end">
                          <div className="relative">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, (url) => updateListItem("factoryTour", "departments", idx, "img", url), `dept-${idx}`)}
                              className="hidden"
                              id={`upload-dept-${idx}`}
                            />
                            <label
                              htmlFor={`upload-dept-${idx}`}
                              className="px-3 py-2 rounded-lg border border-white/10 hover:bg-white/5 text-xs font-bold text-neutral-300 cursor-pointer inline-flex items-center gap-1.5"
                            >
                              <Upload className="w-3.5 h-3.5" />
                              <span>{uploadingImage === `dept-${idx}` ? "Subiendo..." : "Subir Blueprint"}</span>
                            </label>
                          </div>
                        </div>

                        {/* Video URL & Upload */}
                        <div className="flex flex-col gap-1.5 md:col-span-3">
                          <label className="text-[10px] font-bold text-neutral-400 uppercase">Video URL (Opcional)</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={dept.video || ""}
                              placeholder="Ej. /uploads/video.mp4 o URL de Vimeo/YouTube"
                              onChange={(e) => updateListItem("factoryTour", "departments", idx, "video", e.target.value)}
                              className="flex-1 bg-neutral-900 border border-white/5 rounded-lg py-2 px-3 text-xs text-neutral-100 focus:outline-none"
                            />
                            <div className="relative shrink-0">
                              <input
                                type="file"
                                accept="video/*"
                                onChange={(e) => handleImageUpload(e, (url) => updateListItem("factoryTour", "departments", idx, "video", url), `dept-video-${idx}`)}
                                className="hidden"
                                id={`upload-dept-video-${idx}`}
                              />
                              <label
                                htmlFor={`upload-dept-video-${idx}`}
                                className="px-3 py-2 rounded-lg border border-white/10 hover:bg-white/5 text-xs font-bold text-neutral-300 cursor-pointer inline-flex items-center gap-1.5 h-full"
                              >
                                <Upload className="w-3.5 h-3.5" />
                                <span>{uploadingImage === `dept-video-${idx}` ? "Subiendo..." : "Subir Video"}</span>
                              </label>
                            </div>
                          </div>
                        </div>

                        {/* Thumbnail URL & Upload */}
                        <div className="flex flex-col gap-1.5 md:col-span-3">
                          <label className="text-[10px] font-bold text-neutral-400 uppercase">Miniatura de Video (Opcional)</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={dept.thumbnail || ""}
                              placeholder="Ej. /uploads/miniatura.jpg o URL externa"
                              onChange={(e) => updateListItem("factoryTour", "departments", idx, "thumbnail", e.target.value)}
                              className="flex-1 bg-neutral-900 border border-white/5 rounded-lg py-2 px-3 text-xs text-neutral-100 focus:outline-none"
                            />
                            <div className="relative shrink-0">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, (url) => updateListItem("factoryTour", "departments", idx, "thumbnail", url), `dept-thumbnail-${idx}`)}
                                className="hidden"
                                id={`upload-dept-thumbnail-${idx}`}
                              />
                              <label
                                htmlFor={`upload-dept-thumbnail-${idx}`}
                                className="px-3 py-2.5 rounded-lg border border-white/10 hover:bg-white/5 text-xs font-bold text-neutral-300 cursor-pointer inline-flex items-center gap-1.5 h-full"
                              >
                                <Upload className="w-3.5 h-3.5" />
                                <span>{uploadingImage === `dept-thumbnail-${idx}` ? "Subiendo..." : "Subir Imagen"}</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Slider de Fábrica (Sliderfabrica) */}
              <div className="flex flex-col gap-4 border-t border-white/5 pt-8">
                <h3 className="text-lg font-black text-neutral-200">Banner Slider de Fábrica</h3>
                <p className="text-sm text-neutral-500">Configura el título, intervalo de transición y las 4 fotos o videos de fondo del slider de fabricantes.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Título del Banner</label>
                    <input
                      type="text"
                      value={content.sliderFabrica?.title || ""}
                      onChange={(e) => updateField("sliderFabrica", "title", e.target.value)}
                      className="w-full bg-neutral-900 border border-white/5 focus:border-orange-main rounded-xl py-3 px-4 text-sm font-semibold text-neutral-100 focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Intervalo de Transición (ms)</label>
                    <input
                      type="number"
                      value={content.sliderFabrica?.intervalMs || 5000}
                      onChange={(e) => updateField("sliderFabrica", "intervalMs", Number(e.target.value))}
                      className="w-full bg-neutral-900 border border-white/5 focus:border-orange-main rounded-xl py-3 px-4 text-sm font-semibold text-neutral-100 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-4 mt-2">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Fotos / Videos de Fondo (Soporta archivos multimedia)</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {[0, 1, 2, 3].map((idx) => {
                      const mediaUrl = content.sliderFabrica?.media?.[idx] || "";
                      const isVideoFile = /\.(mp4|webm|ogg)($|\?)/i.test(mediaUrl);

                      return (
                        <div key={idx} className="bg-white/[0.02] border border-white/5 p-4 rounded-xl flex flex-col gap-3">
                          <span className="text-xs font-bold text-orange-main">Diapositiva #{idx + 1}</span>
                          <div className="w-full h-28 bg-neutral-950 border border-white/10 rounded-lg flex items-center justify-center relative overflow-hidden">
                            {mediaUrl ? (
                              isVideoFile ? (
                                <video src={mediaUrl} className="w-full h-full object-cover" muted />
                              ) : (
                                <img src={mediaUrl} alt="" className="max-h-full object-contain" />
                              )
                            ) : (
                              <ImageIcon className="w-6 h-6 text-neutral-700" />
                            )}
                            {uploadingImage === `slider-media-${idx}` && (
                              <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center text-xs font-bold text-orange-main">
                                Subiendo...
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col gap-2">
                            {/* Input to view/edit URL path directly */}
                            <input
                              type="text"
                              value={mediaUrl}
                              placeholder="/assets/ban/c.jpg"
                              onChange={(e) => {
                                const list = [...(content.sliderFabrica?.media || [])];
                                list[idx] = e.target.value;
                                updateField("sliderFabrica", "media", list);
                              }}
                              className="w-full bg-neutral-900 border border-white/5 rounded-lg py-1 px-2.5 text-[10px] font-mono text-neutral-200 focus:outline-none"
                            />

                            <div className="relative">
                              <input
                                type="file"
                                accept="image/*,video/*"
                                onChange={(e) => handleImageUpload(e, (url) => {
                                  const list = [...(content.sliderFabrica?.media || [])];
                                  list[idx] = url;
                                  updateField("sliderFabrica", "media", list);
                                }, `slider-media-${idx}`)}
                                className="hidden"
                                id={`upload-slider-media-${idx}`}
                              />
                              <label
                                htmlFor={`upload-slider-media-${idx}`}
                                className="w-full px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 text-[11px] font-bold text-neutral-300 cursor-pointer inline-flex items-center justify-center gap-1 transition-colors"
                              >
                                <Upload className="w-3 h-3" />
                                <span>Subir Archivo</span>
                              </label>
                            </div>

                            {mediaUrl && !isVideoFile && (
                              <button
                                type="button"
                                onClick={() => handleStartCrop(mediaUrl, idx)}
                                className="w-full px-3 py-1.5 rounded-lg border border-orange-500/20 hover:bg-orange-500/10 text-[11px] font-bold text-orange-main cursor-pointer inline-flex items-center justify-center gap-1 transition-colors mt-1"
                              >
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 3v14H19M7 5H19v14" />
                                </svg>
                                <span>Recortar Imagen</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4.2: PAGINA NOSOTROS */}
          {activeTab === "about" && (
            <div className="flex flex-col gap-8">
              <div>
                <h2 className="text-xl font-black text-neutral-100">Página Nosotros</h2>
                <p className="text-sm text-neutral-500 mt-1">Configura el contenido y las imágenes de la página institucional de Nosotros (/nosotros).</p>
              </div>

              {/* HERO SECTION */}
              <div className="border-t border-white/5 pt-6 flex flex-col gap-4">
                <h3 className="text-lg font-black text-neutral-200">Sección Bienvenida (Hero)</h3>
                
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Título de Bienvenida</label>
                  <textarea
                    rows={2}
                    value={content.aboutPage?.hero?.title || ""}
                    onChange={(e) => updateNestedField("aboutPage", "hero", "title", e.target.value)}
                    placeholder="Escribe el título de la página..."
                    className="w-full bg-neutral-900 border border-white/5 focus:border-orange-main rounded-xl py-3 px-4 text-sm font-semibold text-neutral-100 focus:outline-none resize-none transition-colors"
                  />
                  <p className="text-[11px] text-neutral-500 leading-relaxed">
                    Tip: El texto entre asteriscos se renderizará con el **degradado naranja/rojo** (ejemplo: `Fabricamos la identidad\nvisual de *tu marca*`). Puedes usar `\n` o saltos de línea tradicionales para separar líneas.
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Subtítulo Descriptivo</label>
                  <textarea
                    rows={3}
                    value={content.aboutPage?.hero?.subtitle || ""}
                    onChange={(e) => updateNestedField("aboutPage", "hero", "subtitle", e.target.value)}
                    placeholder="Escribe la descripción de bienvenida..."
                    className="w-full bg-neutral-900 border border-white/5 focus:border-orange-main rounded-xl py-3 px-4 text-sm font-semibold text-neutral-100 focus:outline-none resize-none transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Etiqueta Botón Principal</label>
                    <input
                      type="text"
                      value={content.aboutPage?.hero?.worksLabel || ""}
                      onChange={(e) => updateNestedField("aboutPage", "hero", "worksLabel", e.target.value)}
                      className="w-full bg-neutral-900 border border-white/5 focus:border-orange-main rounded-xl py-3 px-4 text-sm font-semibold text-neutral-100 focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Enlace Botón Principal</label>
                    <input
                      type="text"
                      value={content.aboutPage?.hero?.worksHref || ""}
                      onChange={(e) => updateNestedField("aboutPage", "hero", "worksHref", e.target.value)}
                      className="w-full bg-neutral-900 border border-white/5 focus:border-orange-main rounded-xl py-3 px-4 text-sm font-semibold text-neutral-100 focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Etiqueta Botón Secundario</label>
                    <input
                      type="text"
                      value={content.aboutPage?.hero?.contactLabel || ""}
                      onChange={(e) => updateNestedField("aboutPage", "hero", "contactLabel", e.target.value)}
                      className="w-full bg-neutral-900 border border-white/5 focus:border-orange-main rounded-xl py-3 px-4 text-sm font-semibold text-neutral-100 focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Enlace Botón Secundario</label>
                    <input
                      type="text"
                      value={content.aboutPage?.hero?.contactHref || ""}
                      onChange={(e) => updateNestedField("aboutPage", "hero", "contactHref", e.target.value)}
                      className="w-full bg-neutral-900 border border-white/5 focus:border-orange-main rounded-xl py-3 px-4 text-sm font-semibold text-neutral-100 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* STATS SECTION */}
              <div className="border-t border-white/5 pt-6 flex flex-col gap-4">
                <h3 className="text-lg font-black text-neutral-200">Componente de Estadísticas (Stats)</h3>
                <p className="text-xs text-neutral-500">Configura los 4 recuadros clave que resumen la experiencia y cobertura.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {content.aboutPage?.stats?.map((stat: any, idx: number) => (
                    <div key={idx} className="bg-white/[0.02] border border-white/5 p-4 rounded-xl flex flex-col gap-3">
                      <span className="text-xs font-bold text-orange-main">Métrica #{idx + 1}</span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="flex flex-col gap-1 sm:col-span-1">
                          <label className="text-[10px] font-bold text-neutral-400 uppercase">Valor (ej. +2.000)</label>
                          <input
                            type="text"
                            value={stat.value}
                            onChange={(e) => updateListItem("aboutPage", "stats", idx, "value", e.target.value)}
                            className="w-full bg-neutral-900 border border-white/5 rounded-lg py-2 px-3 text-sm font-semibold text-neutral-100 focus:outline-none"
                          />
                        </div>
                        <div className="flex flex-col gap-1 sm:col-span-2">
                          <label className="text-[10px] font-bold text-neutral-400 uppercase">Descripción</label>
                          <input
                            type="text"
                            value={stat.description}
                            onChange={(e) => updateListItem("aboutPage", "stats", idx, "description", e.target.value)}
                            className="w-full bg-neutral-900 border border-white/5 rounded-lg py-2 px-3 text-sm font-semibold text-neutral-100 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* HISTORIA Y VALORES */}
              <div className="border-t border-white/5 pt-6 flex flex-col gap-6">
                <h3 className="text-lg font-black text-neutral-200">Historia y Valores</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Título de Historia</label>
                      <input
                        type="text"
                        value={content.aboutPage?.history?.title || ""}
                        onChange={(e) => updateNestedField("aboutPage", "history", "title", e.target.value)}
                        className="w-full bg-neutral-900 border border-white/5 focus:border-orange-main rounded-xl py-3 px-4 text-sm font-semibold text-neutral-100 focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Descripción de Historia</label>
                      <textarea
                        rows={4}
                        value={content.aboutPage?.history?.description || ""}
                        onChange={(e) => updateNestedField("aboutPage", "history", "description", e.target.value)}
                        className="w-full bg-neutral-900 border border-white/5 focus:border-orange-main rounded-xl py-3 px-4 text-sm font-semibold text-neutral-100 focus:outline-none resize-none"
                      />
                    </div>
                  </div>

                  <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 flex flex-col gap-4">
                    <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider">Foto de la Historia (Fábrica / Equipo)</span>
                    <div className="w-full h-36 bg-neutral-900 border border-white/10 rounded-xl flex items-center justify-center relative overflow-hidden shrink-0">
                      {content.aboutPage?.history?.image ? (
                        <img src={content.aboutPage.history.image} alt="" className="max-h-full object-contain" />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-neutral-600" />
                      )}
                      {uploadingImage === "about-history-image" && (
                        <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center text-xs font-bold text-orange-main">
                          Subiendo...
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-3">
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, (url) => updateNestedField("aboutPage", "history", "image", url), "about-history-image")}
                          className="hidden"
                          id="upload-about-history-image"
                        />
                        <label
                          htmlFor="upload-about-history-image"
                          className="w-full px-4 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-xs font-bold text-neutral-200 cursor-pointer inline-flex items-center justify-center gap-2 transition-colors"
                        >
                          <Upload className="w-4 h-4" />
                          <span>{uploadingImage === "about-history-image" ? "Subiendo..." : "Cambiar Imagen"}</span>
                        </label>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase">Pie de Foto (Epígrafe)</label>
                        <input
                          type="text"
                          value={content.aboutPage?.history?.imageLabel || ""}
                          onChange={(e) => updateNestedField("aboutPage", "history", "imageLabel", e.target.value)}
                          className="w-full bg-neutral-900 border border-white/5 rounded-lg py-1.5 px-3 text-xs text-neutral-200 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4 border-t border-white/5 pt-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Título de Valores</label>
                    <input
                      type="text"
                      value={content.aboutPage?.history?.valuesTitle || ""}
                      onChange={(e) => updateNestedField("aboutPage", "history", "valuesTitle", e.target.value)}
                      className="w-full bg-neutral-900 border border-white/5 focus:border-orange-main rounded-xl py-3 px-4 text-sm font-semibold text-neutral-100 focus:outline-none"
                    />
                  </div>
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Valores de la Empresa (4 ítems)</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {content.aboutPage?.history?.values?.map((val: string, idx: number) => (
                      <div key={idx} className="flex gap-2 items-center bg-white/[0.01] border border-white/5 p-3 rounded-xl">
                        <span className="text-xs font-bold text-orange-main shrink-0">Item #{idx + 1}</span>
                        <input
                          type="text"
                          value={val}
                          onChange={(e) => {
                            const list = [...(content.aboutPage.history.values || [])];
                            list[idx] = e.target.value;
                            updateNestedField("aboutPage", "history", "values", list);
                          }}
                          className="flex-1 bg-neutral-900 border border-white/5 rounded-lg py-2 px-3 text-xs font-semibold text-neutral-100 focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* PROCESO DE FABRICACIÓN */}
              <div className="border-t border-white/5 pt-6 flex flex-col gap-6">
                <h3 className="text-lg font-black text-neutral-200">Proceso de Fabricación</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Título del Proceso</label>
                      <input
                        type="text"
                        value={content.aboutPage?.process?.title || ""}
                        onChange={(e) => updateNestedField("aboutPage", "process", "title", e.target.value)}
                        className="w-full bg-neutral-900 border border-white/5 focus:border-orange-main rounded-xl py-3 px-4 text-sm font-semibold text-neutral-100 focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Descripción del Proceso</label>
                      <textarea
                        rows={3}
                        value={content.aboutPage?.process?.description || ""}
                        onChange={(e) => updateNestedField("aboutPage", "process", "description", e.target.value)}
                        className="w-full bg-neutral-900 border border-white/5 focus:border-orange-main rounded-xl py-3 px-4 text-sm font-semibold text-neutral-100 focus:outline-none resize-none"
                      />
                    </div>
                  </div>

                  <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 flex flex-col gap-3">
                    <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider">Tiempo Promedio de Producción (Tarjeta)</span>
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase">Título de Tarjeta</label>
                        <input
                          type="text"
                          value={content.aboutPage?.process?.avgTimeTitle || ""}
                          onChange={(e) => updateNestedField("aboutPage", "process", "avgTimeTitle", e.target.value)}
                          className="w-full bg-neutral-900 border border-white/5 rounded-lg py-2 px-3 text-xs text-neutral-200 focus:outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase">Valor de Tiempo (ej. 5 a 10 días)</label>
                        <input
                          type="text"
                          value={content.aboutPage?.process?.avgTimeValue || ""}
                          onChange={(e) => updateNestedField("aboutPage", "process", "avgTimeValue", e.target.value)}
                          className="w-full bg-neutral-900 border border-white/5 rounded-lg py-2 px-3 text-xs text-neutral-200 focus:outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase">Leyenda aclaratoria</label>
                        <input
                          type="text"
                          value={content.aboutPage?.process?.avgTimeSub || ""}
                          onChange={(e) => updateNestedField("aboutPage", "process", "avgTimeSub", e.target.value)}
                          className="w-full bg-neutral-900 border border-white/5 rounded-lg py-2 px-3 text-xs text-neutral-200 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4 border-t border-white/5 pt-6">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Pasos del Proceso (5 pasos)</label>
                  <div className="flex flex-col gap-4">
                    {content.aboutPage?.process?.steps?.map((step: any, idx: number) => (
                      <div key={idx} className="bg-white/[0.01] border border-white/5 p-4 rounded-xl flex flex-col gap-3">
                        <div className="flex items-center justify-between border-b border-white/5 pb-1">
                          <span className="text-xs font-bold text-orange-main">Paso #{step.number}</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-neutral-400 uppercase">Título de Paso</label>
                            <input
                              type="text"
                              value={step.title}
                              onChange={(e) => updateListItem("aboutPage", "process", idx, "title", e.target.value)}
                              className="w-full bg-neutral-900 border border-white/5 rounded-lg py-2 px-3 text-xs font-semibold text-neutral-100 focus:outline-none"
                            />
                          </div>
                          <div className="flex flex-col gap-1 md:col-span-2">
                            <label className="text-[10px] font-bold text-neutral-400 uppercase">Descripción</label>
                            <input
                              type="text"
                              value={step.description}
                              onChange={(e) => updateListItem("aboutPage", "process", idx, "description", e.target.value)}
                              className="w-full bg-neutral-900 border border-white/5 rounded-lg py-2 px-3 text-xs font-semibold text-neutral-100 focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* CALIDAD Y CERTIFICACIONES */}
              <div className="border-t border-white/5 pt-6 flex flex-col gap-6">
                <h3 className="text-lg font-black text-neutral-200">Calidad y Certificaciones</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Título de Calidad</label>
                    <input
                      type="text"
                      value={content.aboutPage?.quality?.title || ""}
                      onChange={(e) => updateNestedField("aboutPage", "quality", "title", e.target.value)}
                      className="w-full bg-neutral-900 border border-white/5 focus:border-orange-main rounded-xl py-3 px-4 text-sm font-semibold text-neutral-100 focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Descripción de Calidad</label>
                    <textarea
                      rows={2}
                      value={content.aboutPage?.quality?.description || ""}
                      onChange={(e) => updateNestedField("aboutPage", "quality", "description", e.target.value)}
                      className="w-full bg-neutral-900 border border-white/5 focus:border-orange-main rounded-xl py-3 px-4 text-sm font-semibold text-neutral-100 focus:outline-none resize-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-4 border-t border-white/5 pt-6">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Tarjetas de Calidad (4 tarjetas)</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {content.aboutPage?.quality?.cards?.map((card: any, idx: number) => (
                      <div key={idx} className="bg-white/[0.01] border border-white/5 p-4 rounded-xl flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col gap-1 w-12 shrink-0">
                            <label className="text-[10px] font-bold text-neutral-400 uppercase">Icono</label>
                            <input
                              type="text"
                              value={card.icon}
                              onChange={(e) => updateListItem("aboutPage", "quality", idx, "icon", e.target.value)}
                              className="w-full text-center bg-neutral-900 border border-white/5 rounded-lg py-1.5 px-2 text-sm font-semibold text-neutral-100 focus:outline-none"
                            />
                          </div>
                          <div className="flex flex-col gap-1 flex-1">
                            <label className="text-[10px] font-bold text-neutral-400 uppercase">Título</label>
                            <input
                              type="text"
                              value={card.title}
                              onChange={(e) => updateListItem("aboutPage", "quality", idx, "title", e.target.value)}
                              className="w-full bg-neutral-900 border border-white/5 rounded-lg py-1.5 px-3 text-xs font-semibold text-neutral-100 focus:outline-none"
                            />
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-neutral-400 uppercase">Descripción</label>
                          <textarea
                            rows={2}
                            value={card.description}
                            onChange={(e) => updateListItem("aboutPage", "quality", idx, "description", e.target.value)}
                            className="w-full bg-neutral-900 border border-white/5 rounded-lg py-1.5 px-3 text-xs font-semibold text-neutral-100 focus:outline-none resize-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-4 border-t border-white/5 pt-6">
                  <div>
                    <h4 className="text-sm font-bold text-neutral-300 uppercase tracking-wider">Fotos de Calidad & Certificaciones</h4>
                    <p className="text-xs text-neutral-500 mt-1">Configura las 3 fotos en cascada que se muestran en el costado derecho de la sección.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[0, 1, 2].map((idx) => {
                      const imgUrl = content.aboutPage?.quality?.floatingImages?.[idx] || "";
                      return (
                        <div key={idx} className="bg-white/[0.02] border border-white/5 p-4 rounded-xl flex flex-col gap-3">
                          <span className="text-xs font-bold text-orange-main">Muestra #{idx + 2} (Foto {idx + 1})</span>
                          <div className="w-full h-32 bg-neutral-900 border border-white/10 rounded-xl flex items-center justify-center relative overflow-hidden">
                            {imgUrl ? (
                              <img src={imgUrl} alt="" className="max-h-full object-contain" />
                            ) : (
                              <ImageIcon className="w-8 h-8 text-neutral-700" />
                            )}
                            {uploadingImage === `about-quality-img-${idx}` && (
                              <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center text-xs font-bold text-orange-main">
                                Subiendo...
                              </div>
                            )}
                          </div>
                          <div className="relative">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, (url) => {
                                const list = [...(content.aboutPage.quality.floatingImages || [])];
                                list[idx] = url;
                                updateNestedField("aboutPage", "quality", "floatingImages", list);
                              }, `about-quality-img-${idx}`)}
                              className="hidden"
                              id={`upload-about-quality-img-${idx}`}
                            />
                            <label
                              htmlFor={`upload-about-quality-img-${idx}`}
                              className="w-full px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 text-xs font-bold text-neutral-200 cursor-pointer inline-flex items-center justify-center gap-1.5 transition-colors"
                            >
                              <Upload className="w-3.5 h-3.5" />
                              <span>{uploadingImage === `about-quality-img-${idx}` ? "Subiendo..." : "Cambiar Foto"}</span>
                            </label>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col gap-4 border-t border-white/5 pt-6">
                  <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider">Banner de Calidad CTA</span>
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-neutral-400 uppercase">Texto del Banner</label>
                      <input
                        type="text"
                        value={content.aboutPage?.quality?.ctaText || ""}
                        onChange={(e) => updateNestedField("aboutPage", "quality", "ctaText", e.target.value)}
                        className="w-full bg-neutral-900 border border-white/5 rounded-lg py-2 px-3 text-xs font-semibold text-neutral-100 focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase">Etiqueta del Botón</label>
                        <input
                          type="text"
                          value={content.aboutPage?.quality?.ctaBtnText || ""}
                          onChange={(e) => updateNestedField("aboutPage", "quality", "ctaBtnText", e.target.value)}
                          className="w-full bg-neutral-900 border border-white/5 rounded-lg py-2 px-3 text-xs font-semibold text-neutral-100 focus:outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase">Enlace del Botón</label>
                        <input
                          type="text"
                          value={content.aboutPage?.quality?.ctaBtnHref || ""}
                          onChange={(e) => updateNestedField("aboutPage", "quality", "ctaBtnHref", e.target.value)}
                          className="w-full bg-neutral-900 border border-white/5 rounded-lg py-2 px-3 text-xs font-semibold text-neutral-100 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4.3: PAGINA TRABAJOS */}
          {activeTab === "works" && (
            <div className="flex flex-col gap-8">
              <div>
                <h2 className="text-xl font-black text-neutral-100">Página Trabajos (Portafolio)</h2>
                <p className="text-sm text-neutral-500 mt-1">Administra la cabecera y el portafolio de proyectos en cuadrícula Bento de la página (/trabajos).</p>
              </div>

              {/* HERO SECTION */}
              <div className="border-t border-white/5 pt-6 flex flex-col gap-4">
                <h3 className="text-lg font-black text-neutral-200">Sección Cabecera (Hero)</h3>
                
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Título de Cabecera</label>
                  <textarea
                    rows={2}
                    value={content.worksPage?.hero?.title || ""}
                    onChange={(e) => updateNestedField("worksPage", "hero", "title", e.target.value)}
                    placeholder="Escribe el título..."
                    className="w-full bg-neutral-900 border border-white/5 focus:border-orange-main rounded-xl py-3 px-4 text-sm font-semibold text-neutral-100 focus:outline-none resize-none transition-colors"
                  />
                  <p className="text-[11px] text-neutral-500 leading-relaxed">
                    Tip: El texto entre asteriscos se renderizará con el **degradado naranja/rojo** (ejemplo: `Nuestros *trabajos destacados*`).
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Subtítulo Descriptivo</label>
                  <textarea
                    rows={2}
                    value={content.worksPage?.hero?.subtitle || ""}
                    onChange={(e) => updateNestedField("worksPage", "hero", "subtitle", e.target.value)}
                    placeholder="Escribe el subtítulo..."
                    className="w-full bg-neutral-900 border border-white/5 focus:border-orange-main rounded-xl py-3 px-4 text-sm font-semibold text-neutral-100 focus:outline-none resize-none transition-colors"
                  />
                </div>
              </div>

              {/* PROJECTS LIST SECTION */}
              <div className="flex flex-col gap-4 border-t border-white/5 pt-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-neutral-200">Proyectos en Bento Grid</h3>
                  <button
                    type="button"
                    onClick={() => {
                      addListItem("worksPage", "projects", {
                        id: Date.now().toString(),
                        title: "Nuevo Proyecto",
                        category: content.heroAndShowcase?.categories?.[0]?.id || "Marquesina",
                        src: "",
                        gridClass: "md:col-span-1 md:row-span-1"
                      });
                    }}
                    className="px-3 py-1.5 rounded-lg bg-orange-main text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer hover:bg-orange-600 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Agregar Trabajo</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {content.worksPage?.projects?.map((project: any, idx: number) => (
                    <div key={project.id || idx} className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl flex flex-col gap-4">
                      <div className="flex items-center justify-between border-b border-white/5 pb-2">
                        <span className="text-sm font-black text-orange-main">Trabajo #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeListItem("worksPage", "projects", idx)}
                          className="p-1.5 text-red-400 hover:bg-red-main/10 rounded-lg cursor-pointer transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Project Cover Preview */}
                      <div className="w-full h-36 bg-neutral-900 border border-white/10 rounded-xl flex items-center justify-center relative overflow-hidden group">
                        {project.src ? (
                          <img src={project.src} alt="" className="max-h-full max-w-full object-contain" />
                        ) : (
                          <ImageIcon className="w-8 h-8 text-neutral-700" />
                        )}
                        {uploadingImage === `project-cover-${idx}` && (
                          <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center text-xs font-bold text-orange-main">
                            Subiendo...
                          </div>
                        )}
                      </div>

                      {/* Upload and Title Controls */}
                      <div className="flex flex-col gap-3">
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, (url) => updateListItem("worksPage", "projects", idx, "src", url), `project-cover-${idx}`)}
                            className="hidden"
                            id={`upload-project-cover-${idx}`}
                          />
                          <label
                            htmlFor={`upload-project-cover-${idx}`}
                            className="w-full px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 text-xs font-bold text-neutral-200 cursor-pointer inline-flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>{uploadingImage === `project-cover-${idx}` ? "Subiendo..." : "Subir Portada"}</span>
                          </label>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Título del Proyecto</label>
                          <input
                            type="text"
                            value={project.title || ""}
                            onChange={(e) => updateListItem("worksPage", "projects", idx, "title", e.target.value)}
                            className="w-full bg-neutral-900 border border-white/5 focus:border-orange-main rounded-lg py-2 px-3 text-sm text-neutral-200 focus:outline-none transition-colors"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Categoría</label>
                            <select
                              value={project.category}
                              onChange={(e) => updateListItem("worksPage", "projects", idx, "category", e.target.value)}
                              className="w-full bg-neutral-900 border border-white/5 focus:border-orange-main rounded-lg py-2 px-3 text-xs text-neutral-200 focus:outline-none cursor-pointer transition-colors"
                            >
                              {content.heroAndShowcase?.categories?.map((cat: any) => (
                                <option key={cat.id} value={cat.id}>
                                  {cat.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Tamaño Bento</label>
                            <select
                              value={project.gridClass || "md:col-span-1 md:row-span-1"}
                              onChange={(e) => updateListItem("worksPage", "projects", idx, "gridClass", e.target.value)}
                              className="w-full bg-neutral-900 border border-white/5 focus:border-orange-main rounded-lg py-2 px-3 text-xs text-neutral-200 focus:outline-none cursor-pointer transition-colors"
                            >
                              <option value="md:col-span-1 md:row-span-1">Pequeño (1x1)</option>
                              <option value="md:col-span-2 md:row-span-1">Ancho (2x1)</option>
                              <option value="md:col-span-1 md:row-span-2">Alto (1x2)</option>
                              <option value="md:col-span-2 md:row-span-2">Grande (2x2)</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* TYPES OF WORK SECTION */}
              <div className="flex flex-col gap-4 border-t border-white/5 pt-6">
                <div>
                  <h3 className="text-lg font-black text-neutral-200">Tipos de Trabajo (&iquest;Qu&eacute; tipo de trabajo busc&aacute;s?)</h3>
                  <p className="text-xs text-neutral-500 mt-1">Configura las 4 tarjetas que permiten filtrar r&aacute;pidamente por categor&iacute;a.</p>
                </div>

                {/* Headers */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Etiqueta/Pill de Secci&oacute;n</label>
                    <input
                      type="text"
                      value={content.worksPage?.typeHeader?.pill || ""}
                      onChange={(e) => updateNestedField("worksPage", "typeHeader", "pill", e.target.value)}
                      className="w-full bg-neutral-900 border border-white/5 focus:border-orange-main rounded-lg py-2 px-3 text-sm text-neutral-100 focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">T&iacute;tulo de Secci&oacute;n</label>
                    <input
                      type="text"
                      value={content.worksPage?.typeHeader?.title || ""}
                      onChange={(e) => updateNestedField("worksPage", "typeHeader", "title", e.target.value)}
                      className="w-full bg-neutral-900 border border-white/5 focus:border-orange-main rounded-lg py-2 px-3 text-sm text-neutral-100 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Cards List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                  {content.worksPage?.types?.map((type: any, idx: number) => (
                    <div key={idx} className="bg-white/[0.02] border border-white/5 p-4 rounded-xl flex flex-col gap-3">
                      <span className="text-xs font-bold text-orange-main">Tarjeta Tipo #{idx + 1}</span>
                      
                      <div className="grid grid-cols-3 gap-3">
                        <div className="flex flex-col gap-1.5 col-span-1">
                          <label className="text-[10px] font-bold text-neutral-400 uppercase">Icono (Emoji)</label>
                          <input
                            type="text"
                            value={type.icon}
                            onChange={(e) => updateListItem("worksPage", "types", idx, "icon", e.target.value)}
                            className="bg-neutral-900 border border-white/5 rounded-lg py-2 px-3 text-xs text-neutral-100 focus:outline-none text-center"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5 col-span-2">
                          <label className="text-[10px] font-bold text-neutral-400 uppercase">T&iacute;tulo</label>
                          <input
                            type="text"
                            value={type.title}
                            onChange={(e) => updateListItem("worksPage", "types", idx, "title", e.target.value)}
                            className="bg-neutral-900 border border-white/5 rounded-lg py-2 px-3 text-xs text-neutral-100 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase">Descripci&oacute;n</label>
                        <input
                          type="text"
                          value={type.description}
                          onChange={(e) => updateListItem("worksPage", "types", idx, "description", e.target.value)}
                          className="w-full bg-neutral-900 border border-white/5 rounded-lg py-2 px-3 text-xs text-neutral-100 focus:outline-none"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase">Filtro Asoc. (Categor&iacute;a)</label>
                        <select
                          value={type.filterTag}
                          onChange={(e) => updateListItem("worksPage", "types", idx, "filterTag", e.target.value)}
                          className="w-full bg-neutral-900 border border-white/5 focus:border-orange-main rounded-lg py-2 px-3 text-xs text-neutral-200 focus:outline-none cursor-pointer"
                        >
                          {content.heroAndShowcase?.categories?.map((cat: any) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* TESTIMONIALS SECTION */}
              <div className="flex flex-col gap-4 border-t border-white/5 pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-black text-neutral-200">Opiniones de Clientes (Testimonios)</h3>
                    <p className="text-xs text-neutral-500 mt-1">Administra las opiniones que se muestran al final del portafolio.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (!content.worksPage?.testimonials) {
                        setContent((prev: any) => ({
                          ...prev,
                          worksPage: {
                            ...prev.worksPage,
                            testimonials: []
                          }
                        }));
                      }
                      addListItem("worksPage", "testimonials", {
                        stars: 5,
                        text: "\"Nueva opinión\"",
                        author: "Nombre Cliente",
                        company: "Detalle Empresa"
                      });
                    }}
                    className="px-3 py-1.5 rounded-lg bg-orange-main text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer hover:bg-orange-600 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Agregar Testimonio</span>
                  </button>
                </div>

                {/* Headers */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Etiqueta/Pill de Secci&oacute;n</label>
                    <input
                      type="text"
                      value={content.worksPage?.testimonialHeader?.pill || ""}
                      onChange={(e) => updateNestedField("worksPage", "testimonialHeader", "pill", e.target.value)}
                      className="w-full bg-neutral-900 border border-white/5 focus:border-orange-main rounded-lg py-2 px-3 text-sm text-neutral-100 focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">T&iacute;tulo de Secci&oacute;n</label>
                    <input
                      type="text"
                      value={content.worksPage?.testimonialHeader?.title || ""}
                      onChange={(e) => updateNestedField("worksPage", "testimonialHeader", "title", e.target.value)}
                      className="w-full bg-neutral-900 border border-white/5 focus:border-orange-main rounded-lg py-2 px-3 text-sm text-neutral-100 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Cards List */}
                <div className="flex flex-col gap-4 mt-2">
                  {content.worksPage?.testimonials?.map((test: any, idx: number) => (
                    <div key={idx} className="bg-white/[0.02] border border-white/5 p-5 rounded-xl flex flex-col gap-4">
                      <div className="flex items-center justify-between border-b border-white/5 pb-2">
                        <span className="text-xs font-bold text-orange-main">Opini&oacute;n #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeListItem("worksPage", "testimonials", idx)}
                          className="p-1.5 text-red-400 hover:bg-red-main/10 rounded-lg cursor-pointer transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="flex flex-col gap-1.5 md:col-span-1">
                          <label className="text-[10px] font-bold text-neutral-400 uppercase">Estrellas</label>
                          <select
                            value={test.stars || 5}
                            onChange={(e) => updateListItem("worksPage", "testimonials", idx, "stars", Number(e.target.value))}
                            className="bg-neutral-900 border border-white/5 rounded-lg py-2 px-3 text-xs text-neutral-100 focus:outline-none cursor-pointer"
                          >
                            <option value={5}>5 Estrellas</option>
                            <option value={4}>4 Estrellas</option>
                            <option value={3}>3 Estrellas</option>
                            <option value={2}>2 Estrellas</option>
                            <option value={1}>1 Estrella</option>
                          </select>
                        </div>
                        <div className="flex flex-col gap-1.5 md:col-span-3">
                          <label className="text-[10px] font-bold text-neutral-400 uppercase">Comentario (Texto)</label>
                          <textarea
                            rows={2}
                            value={test.text}
                            onChange={(e) => updateListItem("worksPage", "testimonials", idx, "text", e.target.value)}
                            className="w-full bg-neutral-900 border border-white/5 focus:border-orange-main rounded-lg py-2 px-3 text-xs text-neutral-100 focus:outline-none resize-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold text-neutral-400 uppercase">Autor (Cliente)</label>
                          <input
                            type="text"
                            value={test.author}
                            onChange={(e) => updateListItem("worksPage", "testimonials", idx, "author", e.target.value)}
                            className="w-full bg-neutral-900 border border-white/5 rounded-lg py-2 px-3 text-xs text-neutral-100 focus:outline-none"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold text-neutral-400 uppercase">Detalle Empresa / Ubicaci&oacute;n</label>
                          <input
                            type="text"
                            value={test.company}
                            onChange={(e) => updateListItem("worksPage", "testimonials", idx, "company", e.target.value)}
                            className="w-full bg-neutral-900 border border-white/5 rounded-lg py-2 px-3 text-xs text-neutral-100 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 4.5: CTA SECTION */}
          {activeTab === "cta" && (
            <div className="flex flex-col gap-8">
              <div>
                <h2 className="text-xl font-black text-neutral-100">Sección Call to Action (CTA)</h2>
                <p className="text-sm text-neutral-500 mt-1">Modifica el texto, enlaces e imagen de fondo de la sección de llamado a la acción al final de la página.</p>
              </div>

              {/* Title Input */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Título de la Sección (Slogan)</label>
                <textarea
                  rows={3}
                  value={content.ctaSection?.title || ""}
                  onChange={(e) => updateField("ctaSection", "title", e.target.value)}
                  placeholder="Escribe el slogan de la sección..."
                  className="w-full bg-neutral-900 border border-white/5 focus:border-orange-main rounded-xl py-3 px-4 text-sm font-semibold text-neutral-100 focus:outline-none resize-none transition-colors"
                />
                <p className="text-[11px] text-neutral-500 mt-1 leading-relaxed">
                  Tip: El texto entre asteriscos se renderizará con el **degradado naranja/rojo** (ejemplo: `Potencia *tu marca* con nosotros`). Puedes usar saltos de línea tradicionales.
                </p>
              </div>

              {/* Background Image Upload */}
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-center">
                <div className="w-40 h-24 bg-neutral-900 border border-white/10 rounded-xl flex items-center justify-center relative overflow-hidden shrink-0">
                  {content.ctaSection?.backgroundImage ? (
                    <img src={content.ctaSection.backgroundImage} alt="CTA Background" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-neutral-600" />
                  )}
                  {uploadingImage === "cta-background" && (
                    <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center text-xs font-bold text-orange-main">
                      Subiendo...
                    </div>
                  )}
                </div>
                <div className="flex-1 flex flex-col gap-3 w-full">
                  <label className="text-sm font-bold text-neutral-300">Imagen de Fondo de la Sección</label>
                  <p className="text-xs text-neutral-500">Se sugiere una imagen oscura o con bajo contraste para que el texto sea legible.</p>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, (url) => updateField("ctaSection", "backgroundImage", url), "cta-background")}
                      className="hidden"
                      id="upload-cta-bg"
                    />
                    <label
                      htmlFor="upload-cta-bg"
                      className="px-4 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-sm font-bold text-neutral-200 cursor-pointer inline-flex items-center gap-2 transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      <span>{uploadingImage === "cta-background" ? "Subiendo..." : "Cambiar Imagen de Fondo"}</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Links Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Enlace Botón &quot;Trabajos&quot;</label>
                  <input
                    type="text"
                    value={content.ctaSection?.worksHref || ""}
                    onChange={(e) => updateField("ctaSection", "worksHref", e.target.value)}
                    placeholder="e.g. #trabajos"
                    className="w-full bg-neutral-900 border border-white/5 focus:border-orange-main rounded-xl py-3 px-4 text-sm font-semibold text-neutral-100 focus:outline-none transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Enlace Botón &quot;Contactar&quot;</label>
                  <input
                    type="text"
                    value={content.ctaSection?.contactHref || ""}
                    onChange={(e) => updateField("ctaSection", "contactHref", e.target.value)}
                    placeholder="e.g. #contacto"
                    className="w-full bg-neutral-900 border border-white/5 focus:border-orange-main rounded-xl py-3 px-4 text-sm font-semibold text-neutral-100 focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: FAQS */}
          {activeTab === "faqs" && (
            <div className="flex flex-col gap-8">
              <div>
                <h2 className="text-xl font-black text-neutral-100">Preguntas Frecuentes</h2>
                <p className="text-sm text-neutral-500 mt-1">Administra la sección de acordeones de ayuda.</p>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-neutral-200">Preguntas & Respuestas</h3>
                  <button
                    type="button"
                    onClick={() => addListItem("faqSection", "faqs", { question: "Nueva pregunta", answer: "Respuesta" })}
                    className="px-3 py-1.5 rounded-lg bg-orange-main text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Agregar Pregunta</span>
                  </button>
                </div>

                <div className="flex flex-col gap-4">
                  {content.faqSection?.faqs?.map((faq: any, idx: number) => (
                    <div key={idx} className="bg-white/[0.02] border border-white/5 p-4 rounded-xl flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-orange-main">Pregunta #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeListItem("faqSection", "faqs", idx)}
                          className="p-1 text-red-400 hover:bg-red-main/10 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="flex flex-col gap-3">
                        <input
                          type="text"
                          value={faq.question}
                          onChange={(e) => updateListItem("faqSection", "faqs", idx, "question", e.target.value)}
                          placeholder="Escribe la pregunta aquí..."
                          className="w-full bg-neutral-900 border border-white/5 focus:border-orange-main rounded-lg py-2 px-3 text-sm text-neutral-100 focus:outline-none"
                        />
                        <textarea
                          rows={3}
                          value={faq.answer}
                          onChange={(e) => updateListItem("faqSection", "faqs", idx, "answer", e.target.value)}
                          placeholder="Escribe la respuesta aquí..."
                          className="w-full bg-neutral-900 border border-white/5 focus:border-orange-main rounded-lg py-2 px-3 text-sm text-neutral-100 focus:outline-none resize-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: CONTACT & INQUIRIES */}
          {activeTab === "contact" && (
            <div className="flex flex-col gap-8 animate-fade-in">
              <div>
                <h2 className="text-xl font-black text-neutral-100">Contacto & Mensajes</h2>
                <p className="text-sm text-neutral-500 mt-1">Configura el formulario, mapa, redes y gestiona los mensajes recibidos.</p>
              </div>

              {/* General Contact Info */}
              <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl flex flex-col gap-4">
                <h3 className="text-lg font-black text-neutral-200">Configuración General de Contacto</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Correo de Destino</label>
                    <input
                      type="email"
                      value={content.contactPage?.destinationEmail || ""}
                      onChange={(e) => updateField("contactPage", "destinationEmail", e.target.value)}
                      placeholder="e.g. contacto@empresa.com"
                      className="w-full bg-neutral-900 border border-white/5 focus:border-orange-main rounded-xl py-3 px-4 text-sm font-semibold text-neutral-100 focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Google Maps Iframe URL</label>
                    <input
                      type="text"
                      value={content.contactPage?.mapIframe || ""}
                      onChange={(e) => updateField("contactPage", "mapIframe", e.target.value)}
                      placeholder="https://www.google.com/maps/embed?pb=..."
                      className="w-full bg-neutral-900 border border-white/5 focus:border-orange-main rounded-xl py-3 px-4 text-sm font-semibold text-neutral-100 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Hero Configuration */}
              <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl flex flex-col gap-4">
                <h3 className="text-lg font-black text-neutral-200">Cabecera de Contacto (Hero)</h3>
                <div className="grid grid-cols-1 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Pill (Etiqueta superior)</label>
                    <input
                      type="text"
                      value={content.contactPage?.hero?.pill || ""}
                      onChange={(e) => updateNestedField("contactPage", "hero", "pill", e.target.value)}
                      placeholder="e.g. Contacto"
                      className="w-full bg-neutral-900 border border-white/5 focus:border-orange-main rounded-xl py-3 px-4 text-sm font-semibold text-neutral-100 focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Título (Usa asteriscos para degradado, e.g. *tu marca*)</label>
                    <input
                      type="text"
                      value={content.contactPage?.hero?.title || ""}
                      onChange={(e) => updateNestedField("contactPage", "hero", "title", e.target.value)}
                      placeholder="Hablemos de *tu proyecto*"
                      className="w-full bg-neutral-900 border border-white/5 focus:border-orange-main rounded-xl py-3 px-4 text-sm font-semibold text-neutral-100 focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Subtítulo</label>
                    <textarea
                      rows={3}
                      value={content.contactPage?.hero?.subtitle || ""}
                      onChange={(e) => updateNestedField("contactPage", "hero", "subtitle", e.target.value)}
                      placeholder="Completá el formulario..."
                      className="w-full bg-neutral-900 border border-white/5 focus:border-orange-main rounded-xl py-3 px-4 text-sm font-semibold text-neutral-100 focus:outline-none transition-colors resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Social Networks Manager */}
              <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-neutral-200">Redes Sociales</h3>
                  <button
                    type="button"
                    onClick={() => addListItem("contactPage", "socials", { name: "Nueva Red", href: "https://", value: "@usuario" })}
                    className="px-3 py-1.5 rounded-lg bg-orange-main text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Agregar Red</span>
                  </button>
                </div>

                <div className="flex flex-col gap-4">
                  {content.contactPage?.socials?.map((social: any, idx: number) => (
                    <div key={idx} className="bg-white/[0.02] border border-white/5 p-4 rounded-xl flex flex-col md:flex-row gap-4 items-start md:items-center">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Red (e.g. Instagram, WhatsApp)</label>
                          <input
                            type="text"
                            value={social.name || ""}
                            onChange={(e) => updateListItem("contactPage", "socials", idx, "name", e.target.value)}
                            placeholder="Nombre de red"
                            className="w-full bg-neutral-900 border border-white/5 focus:border-orange-main rounded-lg py-2 px-3 text-xs text-neutral-100 focus:outline-none"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Texto Visible (e.g. @powerprint)</label>
                          <input
                            type="text"
                            value={social.value || ""}
                            onChange={(e) => updateListItem("contactPage", "socials", idx, "value", e.target.value)}
                            placeholder="Ej. @powerprint"
                            className="w-full bg-neutral-900 border border-white/5 focus:border-orange-main rounded-lg py-2 px-3 text-xs text-neutral-100 focus:outline-none"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Enlace Completo (href)</label>
                          <input
                            type="text"
                            value={social.href || ""}
                            onChange={(e) => updateListItem("contactPage", "socials", idx, "href", e.target.value)}
                            placeholder="https://..."
                            className="w-full bg-neutral-900 border border-white/5 focus:border-orange-main rounded-lg py-2 px-3 text-xs text-neutral-100 focus:outline-none"
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeListItem("contactPage", "socials", idx)}
                        className="p-2 text-red-400 hover:bg-red-main/10 rounded-lg self-end md:self-auto cursor-pointer"
                        title="Borrar Red"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Fields Control */}
              <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-neutral-200">Campos del Formulario</h3>
                  <button
                    type="button"
                    onClick={() => addListItem("contactPage", "formFields", { 
                      id: `campo_${Date.now().toString().slice(-4)}`, 
                      label: "Nuevo Campo", 
                      type: "text", 
                      required: false, 
                      placeholder: "", 
                      enabled: true 
                    })}
                    className="px-3 py-1.5 rounded-lg bg-orange-main text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Agregar Campo</span>
                  </button>
                </div>
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-neutral-400 text-xs font-bold uppercase tracking-wider">
                        <th className="pb-3 pr-4">Identificador / Tipo</th>
                        <th className="pb-3 px-4">Etiqueta (Label)</th>
                        <th className="pb-3 px-4">Marcador (Placeholder)</th>
                        <th className="pb-3 px-4 text-center">Obligatorio</th>
                        <th className="pb-3 px-4 text-center">Activo</th>
                        <th className="pb-3 pl-4 text-center">Eliminar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-sm">
                      {content.contactPage?.formFields?.map((field: any, idx: number) => (
                        <tr key={idx} className="hover:bg-white/[0.01]">
                          <td className="py-3 pr-4 flex flex-col gap-1.5">
                            <input
                              type="text"
                              value={field.id || ""}
                              onChange={(e) => updateListItem("contactPage", "formFields", idx, "id", e.target.value.replace(/[^a-zA-Z0-9_]/g, ""))}
                              className="bg-neutral-900 border border-white/5 focus:border-orange-main rounded px-2.5 py-1.5 text-xs text-neutral-100 focus:outline-none w-36 font-mono"
                              placeholder="key_name"
                            />
                            <select
                              value={field.type || "text"}
                              onChange={(e) => updateListItem("contactPage", "formFields", idx, "type", e.target.value)}
                              className="bg-neutral-900 border border-white/5 focus:border-orange-main rounded px-2.5 py-1 text-[10px] text-neutral-400 focus:outline-none w-36"
                            >
                              <option value="text">Texto simple</option>
                              <option value="email">Email</option>
                              <option value="tel">Teléfono</option>
                              <option value="textarea">Área de texto</option>
                              <option value="select">Menú desplegable</option>
                            </select>
                          </td>
                          <td className="py-3 px-4">
                            <input
                              type="text"
                              value={field.label || ""}
                              onChange={(e) => updateListItem("contactPage", "formFields", idx, "label", e.target.value)}
                              className="bg-neutral-900 border border-white/5 focus:border-orange-main rounded px-2.5 py-1.5 text-xs text-neutral-100 focus:outline-none w-full min-w-[120px]"
                            />
                            {field.type === "select" && (
                              <div className="mt-1.5 flex flex-col gap-1">
                                <span className="text-[10px] text-neutral-500 font-semibold uppercase">Opciones (separadas por comas)</span>
                                <input
                                  type="text"
                                  value={field.options || ""}
                                  onChange={(e) => updateListItem("contactPage", "formFields", idx, "options", e.target.value)}
                                  placeholder="Marquesina,Corpóreas,Otros"
                                  className="bg-neutral-900 border border-white/5 focus:border-orange-main rounded px-2.5 py-1 text-[10px] text-neutral-200 focus:outline-none w-full"
                                />
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <input
                              type="text"
                              value={field.placeholder || ""}
                              onChange={(e) => updateListItem("contactPage", "formFields", idx, "placeholder", e.target.value)}
                              className="bg-neutral-900 border border-white/5 focus:border-orange-main rounded px-2.5 py-1.5 text-xs text-neutral-100 focus:outline-none w-full min-w-[140px]"
                            />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <input
                              type="checkbox"
                              checked={!!field.required}
                              onChange={(e) => updateListItem("contactPage", "formFields", idx, "required", e.target.checked)}
                              className="w-4 h-4 rounded accent-orange-main bg-neutral-950 border-white/10 cursor-pointer"
                            />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <input
                              type="checkbox"
                              checked={!!field.enabled}
                              onChange={(e) => updateListItem("contactPage", "formFields", idx, "enabled", e.target.checked)}
                              className="w-4 h-4 rounded accent-orange-main bg-neutral-950 border-white/10 cursor-pointer"
                            />
                          </td>
                          <td className="py-3 pl-4 text-center">
                            <button
                              type="button"
                              onClick={() => removeListItem("contactPage", "formFields", idx)}
                              className="p-1.5 text-red-400 hover:bg-red-main/10 rounded-lg cursor-pointer inline-block transition-colors"
                              title="Eliminar Campo"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Inbox / Received Inquiries */}
              <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl flex flex-col gap-4">
                <h3 className="text-lg font-black text-neutral-200">Consultas Recibidas (Buzón)</h3>
                
                {isLoadingInquiries ? (
                  <div className="py-12 flex justify-center items-center text-neutral-400">
                    <Loader2 className="w-6 h-6 animate-spin text-orange-main mr-2" />
                    <span>Cargando consultas...</span>
                  </div>
                ) : inquiries.length === 0 ? (
                  <div className="py-12 text-center text-neutral-500 font-semibold border border-dashed border-white/10 rounded-xl">
                    No hay consultas recibidas en el buzón.
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {inquiries.map((inquiry: any) => {
                      const dateStr = new Date(inquiry.timestamp).toLocaleString("es-AR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      });
                      
                      return (
                        <div key={inquiry.id} className="bg-neutral-900 border border-white/5 rounded-xl p-5 flex flex-col sm:flex-row justify-between gap-4 items-start hover:border-white/10 transition-colors">
                          <div className="flex-1 flex flex-col gap-3">
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-bold text-neutral-500">{dateStr}</span>
                              <span className="h-1.5 w-1.5 rounded-full bg-orange-main" />
                              <span className="text-xs font-semibold text-orange-main/80 font-mono">ID: {inquiry.id}</span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 mt-1">
                              {Object.entries(inquiry.data || {}).map(([key, value]) => {
                                const matchedField = content.contactPage?.formFields?.find((f: any) => f.id === key);
                                const label = matchedField ? matchedField.label : key;
                                if (!value || (typeof value === "string" && value.trim() === "")) return null;
                                return (
                                  <div key={key} className="text-sm">
                                    <span className="text-neutral-400 font-bold block text-xs uppercase tracking-wider">{label}</span>
                                    <span className="text-neutral-200 mt-0.5 block whitespace-pre-wrap">{String(value)}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDeleteInquiry(inquiry.id)}
                            className="px-3 py-2 rounded-lg bg-red-main/10 hover:bg-red-main/20 text-red-400 hover:text-red-300 font-bold text-xs flex items-center gap-1.5 self-end sm:self-auto cursor-pointer shrink-0 transition-all active:scale-95 animate-fade-in"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Eliminar</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 7: PRODUCTS & CATEGORIES */}
          {activeTab === "products" && (
            <div className="flex flex-col gap-8 animate-fade-in">
              <div>
                <h2 className="text-xl font-black text-neutral-100">Productos & Categorías</h2>
                <p className="text-sm text-neutral-500 mt-1">Administra la lista de categorías globales, carga sus fotos y elige cuál se muestra en la cabecera (Hero).</p>
              </div>

              {/* Categories Section */}
              <div className="flex flex-col gap-4 border-t border-white/5 pt-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-neutral-200">Categorías Globales</h3>
                  <button
                    type="button"
                    onClick={() => addListItem("heroAndShowcase", "categories", { 
                      id: `categoria-${Date.now().toString().slice(-4)}`, 
                      slug: "",
                      label: "Nueva Categoría", 
                      title: "Título de la Categoría", 
                      description: "Descripción de los productos...", 
                      thumbnail: "", 
                      heroImageTransparent: "", 
                      heroImageSupport: "", 
                      coverImage: "",
                      contentMarkdown: "",
                      isHeroFeatured: false 
                    })}
                    className="px-3 py-1.5 rounded-lg bg-orange-main text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Agregar Categoría</span>
                  </button>
                </div>

                <div className="flex flex-col gap-6">
                  {content.heroAndShowcase?.categories?.map((cat: any, idx: number) => (
                    <div key={idx} className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl flex flex-col gap-5 relative">
                      
                      {/* Top Header Row */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-white/5">
                        <div className="flex items-center gap-3">
                          <span className="bg-orange-main/10 border border-orange-main/20 text-orange-main font-mono px-2 py-0.5 rounded text-xs font-bold">
                            #{idx + 1}
                          </span>
                          <span className="text-sm font-bold text-neutral-300 font-mono">{cat.id}</span>
                        </div>

                        <div className="flex items-center gap-4 self-end sm:self-auto">
                          {/* Hero featured toggle */}
                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={!!cat.isHeroFeatured}
                              onChange={() => setFeaturedCategory(idx)}
                              className="w-4 h-4 rounded accent-orange-main bg-neutral-950 border-white/10 cursor-pointer"
                            />
                            <span className={`text-xs font-bold ${cat.isHeroFeatured ? "text-orange-main" : "text-neutral-400"}`}>
                              Destacar en Cabecera (Hero)
                            </span>
                          </label>

                          <button
                            type="button"
                            onClick={() => removeListItem("heroAndShowcase", "categories", idx)}
                            className="p-1.5 text-red-400 hover:bg-red-main/10 rounded-lg cursor-pointer transition-colors"
                            title="Eliminar Categoría"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Text details */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Identificador (ID para filtros)</label>
                          <input
                            type="text"
                            value={cat.id || ""}
                            onChange={(e) => updateListItem("heroAndShowcase", "categories", idx, "id", e.target.value)}
                            className="bg-neutral-900 border border-white/5 focus:border-orange-main rounded-lg py-2 px-3 text-xs text-neutral-100 focus:outline-none"
                            placeholder="Letras corpóreas"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Slug (URL amigable)</label>
                          <input
                            type="text"
                            value={cat.slug || ""}
                            onChange={(e) => updateListItem("heroAndShowcase", "categories", idx, "slug", e.target.value)}
                            className="bg-neutral-900 border border-white/5 focus:border-orange-main rounded-lg py-2 px-3 text-xs text-neutral-100 focus:outline-none"
                            placeholder="letras-corporeas"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Etiqueta de Botón (Label)</label>
                          <input
                            type="text"
                            value={cat.label || ""}
                            onChange={(e) => updateListItem("heroAndShowcase", "categories", idx, "label", e.target.value)}
                            className="bg-neutral-900 border border-white/5 focus:border-orange-main rounded-lg py-2 px-3 text-xs text-neutral-100 focus:outline-none"
                            placeholder="Marquesina"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Título de Detalle (Cabecera)</label>
                          <input
                            type="text"
                            value={cat.title || ""}
                            onChange={(e) => updateListItem("heroAndShowcase", "categories", idx, "title", e.target.value)}
                            className="bg-neutral-900 border border-white/5 focus:border-orange-main rounded-lg py-2 px-3 text-xs text-neutral-100 focus:outline-none"
                            placeholder="Marquesinas y Fachadas"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5 md:col-span-4">
                          <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Descripción (Para cabecera y Bento card)</label>
                          <textarea
                            rows={3}
                            value={cat.description || ""}
                            onChange={(e) => updateListItem("heroAndShowcase", "categories", idx, "description", e.target.value)}
                            className="bg-neutral-900 border border-white/5 focus:border-orange-main rounded-lg py-2 px-3 text-xs text-neutral-100 focus:outline-none resize-none"
                            placeholder="Escribe una breve descripción aquí..."
                          />
                        </div>
                      </div>

                      {/* Image managers */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        
                        {/* 1. Thumbnail image */}
                        <div className="flex flex-col gap-3 p-4 bg-white/[0.01] border border-white/5 rounded-xl">
                          <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wider">Imagen de Bento (Miniatura)</span>
                          
                          <div className="w-full h-32 bg-neutral-900 border border-white/10 rounded-xl overflow-hidden relative flex items-center justify-center p-2">
                            {cat.thumbnail ? (
                              <img src={cat.thumbnail} alt="Thumbnail preview" className="max-h-full max-w-full object-contain" />
                            ) : (
                              <div className="text-center flex flex-col items-center gap-1">
                                <ImageIcon className="w-6 h-6 text-neutral-600" />
                                <span className="text-[9px] font-semibold text-neutral-500">Sin imagen de bento</span>
                              </div>
                            )}
                          </div>

                          <label className="px-3 py-2 bg-neutral-900 hover:bg-neutral-800 border border-white/10 rounded-lg text-xs font-bold text-center text-neutral-300 cursor-pointer flex items-center justify-center gap-1.5 transition-colors">
                            <Upload className="w-3.5 h-3.5" />
                            <span>{uploadingImage === `category-${idx}-thumbnail` ? "Subiendo..." : "Subir Miniatura"}</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleCategoryImageUpload(e, idx, "thumbnail")}
                              disabled={uploadingImage !== null}
                            />
                          </label>
                        </div>

                        {/* 2. Transparent hero image */}
                        <div className="flex flex-col gap-3 p-4 bg-white/[0.01] border border-white/5 rounded-xl">
                          <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wider">Imagen de Cabecera (Transparente)</span>
                          
                          <div className="w-full h-32 bg-neutral-900 border border-white/10 rounded-xl overflow-hidden relative flex items-center justify-center p-2">
                            {cat.heroImageTransparent ? (
                              <img src={cat.heroImageTransparent} alt="Transparent preview" className="max-h-full max-w-full object-contain" />
                            ) : (
                              <div className="text-center flex flex-col items-center gap-1">
                                <ImageIcon className="w-6 h-6 text-neutral-600" />
                                <span className="text-[9px] font-semibold text-neutral-500">Sin imagen transparente</span>
                              </div>
                            )}
                          </div>

                          <label className="px-3 py-2 bg-neutral-900 hover:bg-neutral-800 border border-white/10 rounded-lg text-xs font-bold text-center text-neutral-300 cursor-pointer flex items-center justify-center gap-1.5 transition-colors">
                            <Upload className="w-3.5 h-3.5" />
                            <span>{uploadingImage === `category-${idx}-heroImageTransparent` ? "Subiendo..." : "Subir Transparente"}</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleCategoryImageUpload(e, idx, "heroImageTransparent")}
                              disabled={uploadingImage !== null}
                            />
                          </label>
                        </div>

                        {/* 3. Support hero image */}
                        <div className="flex flex-col gap-3 p-4 bg-white/[0.01] border border-white/5 rounded-xl">
                          <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wider">Foto de Apoyo de Cabecera</span>
                          
                          <div className="w-full h-32 bg-neutral-900 border border-white/10 rounded-xl overflow-hidden relative flex items-center justify-center p-2">
                            {cat.heroImageSupport ? (
                              <img src={cat.heroImageSupport} alt="Support preview" className="max-h-full max-w-full object-contain" />
                            ) : (
                              <div className="text-center flex flex-col items-center gap-1">
                                <ImageIcon className="w-6 h-6 text-neutral-600" />
                                <span className="text-[9px] font-semibold text-neutral-500">Sin foto de apoyo</span>
                              </div>
                            )}
                          </div>

                          <label className="px-3 py-2 bg-neutral-900 hover:bg-neutral-800 border border-white/10 rounded-lg text-xs font-bold text-center text-neutral-300 cursor-pointer flex items-center justify-center gap-1.5 transition-colors">
                            <Upload className="w-3.5 h-3.5" />
                            <span>{uploadingImage === `category-${idx}-heroImageSupport` ? "Subiendo..." : "Subir Apoyo"}</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleCategoryImageUpload(e, idx, "heroImageSupport")}
                              disabled={uploadingImage !== null}
                            />
                          </label>
                        </div>

                      </div>

                      {/* Cover image & detailed content */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4 pt-4 border-t border-white/5">
                        {/* 4. Cover Image (Banner) */}
                        <div className="flex flex-col gap-3 p-4 bg-white/[0.01] border border-white/5 rounded-xl">
                          <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wider">Imagen de Portada (Ancho Completo)</span>
                          
                          <div className="w-full h-32 bg-neutral-900 border border-white/10 rounded-xl overflow-hidden relative flex items-center justify-center p-2">
                            {cat.coverImage ? (
                              <img src={cat.coverImage} alt="Cover preview" className="max-h-full max-w-full object-cover" />
                            ) : (
                              <div className="text-center flex flex-col items-center gap-1">
                                <ImageIcon className="w-6 h-6 text-neutral-600" />
                                <span className="text-[9px] font-semibold text-neutral-500">Sin imagen de portada</span>
                              </div>
                            )}
                          </div>

                          <label className="px-3 py-2 bg-neutral-900 hover:bg-neutral-800 border border-white/10 rounded-lg text-xs font-bold text-center text-neutral-300 cursor-pointer flex items-center justify-center gap-1.5 transition-colors">
                            <Upload className="w-3.5 h-3.5" />
                            <span>{uploadingImage === `category-${idx}-coverImage` ? "Subiendo..." : "Subir Portada"}</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleCategoryImageUpload(e, idx, "coverImage")}
                              disabled={uploadingImage !== null}
                            />
                          </label>
                        </div>

                        {/* 5. Extended Markdown Content */}
                        <div className="flex flex-col gap-1.5 md:col-span-2">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-neutral-400">Contenido Detallado del Producto</label>
                          </div>
                          <MarkdownEditor
                            inputId={`category-md-editor-${idx}`}
                            placeholder="# Título de sección&#10;&#10;Este es un párrafo de texto...&#10;&#10;![Imagen](/assets/ejemplo.jpg)&#10;&#10;@[Video](https://vimeo.com/...)"
                            value={cat.contentMarkdown || ""}
                            onChange={(val) => updateListItem("heroAndShowcase", "categories", idx, "contentMarkdown", val)}
                          />
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </main>

        {/* Preview Panel */}
        <div className="hidden lg:flex w-[380px] xl:w-[420px] bg-neutral-900/10 border-l border-white/5 p-5 flex-col gap-4 overflow-y-auto shrink-0 select-none items-center justify-start sticky top-16 h-[calc(100vh-64px)]">
          <div className="w-full flex items-center justify-between border-b border-white/5 pb-2">
            <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Vista Previa (Tiempo Real)</span>
            <span className="text-[9px] px-2 py-0.5 rounded bg-orange-main/10 border border-orange-main/20 text-orange-main font-bold">Celular</span>
          </div>
          
          {/* Phone Device Mockup */}
          <div className="relative w-[320px] h-[640px] bg-neutral-950 rounded-[40px] p-2.5 shadow-2xl border-4 border-neutral-800 ring-1 ring-neutral-700/50 flex flex-col shrink-0">
            {/* Notch / Speaker */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-4 bg-neutral-950 rounded-full z-20 flex items-center justify-center">
              <div className="w-10 h-1 bg-neutral-800 rounded-full" />
            </div>
            
            {/* Scrollable screen iframe */}
            <iframe
              ref={iframeRef}
              src="/admin/preview"
              className="w-full h-full bg-white rounded-[32px] overflow-hidden border-none"
            />
          </div>
        </div>

      {/* Crop Image Modal */}
      {isCropOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6 w-full max-w-xl flex flex-col gap-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div>
              <h3 className="text-lg font-black text-neutral-100">Recortar y Ajustar Imagen</h3>
              <p className="text-xs text-neutral-400 mt-1">
                Arrastra la imagen en el recuadro para centrar el encuadre. Usa el control deslizante para hacer zoom.
              </p>
            </div>

            {/* Interactive Preview Box (2:1 aspect ratio matching the factory slider banner aspect) */}
            <div 
              ref={previewRef}
              className="w-full aspect-[2/1] relative overflow-hidden rounded-xl border border-white/10 bg-neutral-950 cursor-move select-none"
              onMouseDown={handleDragStart}
              onMouseMove={handleDragMove}
              onMouseUp={handleDragEnd}
              onMouseLeave={handleDragEnd}
              onTouchStart={handleDragStart}
              onTouchMove={handleDragMove}
              onTouchEnd={handleDragEnd}
            >
              <img
                src={cropImageSrc}
                alt="Para recortar"
                className="pointer-events-none select-none"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transform: `scale(${cropZoom}) translate(${cropX / cropZoom}px, ${cropY / cropZoom}px)`,
                  transformOrigin: "center center",
                }}
              />
              {/* Overlay cropping lines (rule of thirds style) */}
              <div className="absolute inset-0 border border-orange-main/20 pointer-events-none grid grid-cols-3 grid-rows-3 opacity-30">
                <div className="border-r border-b border-white/20" />
                <div className="border-r border-b border-white/20" />
                <div className="border-b border-white/20" />
                <div className="border-r border-b border-white/20" />
                <div className="border-r border-b border-white/20" />
                <div className="border-b border-white/20" />
              </div>
            </div>

            {/* Zoom Control */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs font-bold text-neutral-400">
                <span>Zoom</span>
                <span>{Math.round(cropZoom * 100)}%</span>
              </div>
              <input
                type="range"
                min="1"
                max="3"
                step="0.01"
                value={cropZoom}
                onChange={(e) => {
                  const newZoom = parseFloat(e.target.value);
                  handleZoomChange(newZoom);
                }}
                className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-orange-main"
              />
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/5">
              <button
                type="button"
                onClick={() => setIsCropOpen(false)}
                disabled={isCroppingSave}
                className="px-4 py-2 text-xs font-bold text-neutral-400 hover:text-neutral-200 cursor-pointer transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleApplyCrop}
                disabled={isCroppingSave}
                className="px-5 py-2.5 bg-orange-main hover:bg-orange-600 disabled:bg-orange-500/50 rounded-xl text-xs font-extrabold text-white cursor-pointer transition-all flex items-center gap-2 shadow-lg shadow-orange-main/15"
              >
                {isCroppingSave ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Guardando Recorte...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Aplicar Recorte</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      </div>

    </div>
  );
}
