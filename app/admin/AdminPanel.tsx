"use client";

import { useState } from "react";
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
  MapPin,
  Settings,
  Megaphone
} from "lucide-react";

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

              {/* Showcase categories */}
              <div className="flex flex-col gap-4 border-t border-white/5 pt-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-neutral-200">Categorías de Marquesinas</h3>
                  <button
                    type="button"
                    onClick={() => addListItem("heroAndShowcase", "categories", { id: "Nueva", label: "Nueva", title: "Título", description: "Descripción" })}
                    className="px-3 py-1.5 rounded-lg bg-orange-main text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Agregar</span>
                  </button>
                </div>

                <div className="flex flex-col gap-4">
                  {content.heroAndShowcase?.categories?.map((cat: any, idx: number) => (
                    <div key={idx} className="bg-white/[0.02] border border-white/5 p-4 rounded-xl grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase">ID / Filtro</label>
                        <input
                          type="text"
                          value={cat.id}
                          onChange={(e) => updateListItem("heroAndShowcase", "categories", idx, "id", e.target.value)}
                          className="bg-neutral-900 border border-white/5 rounded-lg py-2 px-3 text-xs text-neutral-100 focus:outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase">Etiqueta botón</label>
                        <input
                          type="text"
                          value={cat.label}
                          onChange={(e) => updateListItem("heroAndShowcase", "categories", idx, "label", e.target.value)}
                          className="bg-neutral-900 border border-white/5 rounded-lg py-2 px-3 text-xs text-neutral-100 focus:outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5 md:col-span-2">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase">Título detalle</label>
                        <input
                          type="text"
                          value={cat.title}
                          onChange={(e) => updateListItem("heroAndShowcase", "categories", idx, "title", e.target.value)}
                          className="bg-neutral-900 border border-white/5 rounded-lg py-2 px-3 text-xs text-neutral-100 focus:outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5 md:col-span-3">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase">Descripción</label>
                        <textarea
                          rows={2}
                          value={cat.description}
                          onChange={(e) => updateListItem("heroAndShowcase", "categories", idx, "description", e.target.value)}
                          className="bg-neutral-900 border border-white/5 rounded-lg py-2 px-3 text-xs text-neutral-100 focus:outline-none resize-none"
                        />
                      </div>
                      <div className="flex justify-end md:justify-center">
                        <button
                          type="button"
                          onClick={() => removeListItem("heroAndShowcase", "categories", idx)}
                          className="p-2 text-red-400 hover:bg-red-main/10 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
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

        </main>
      </div>

    </div>
  );
}
