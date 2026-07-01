"use client";

import { useState } from "react";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import CTASection from "@/components/home/CTASection";
import { 
  Mail, 
  MapPin, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  MessageCircle,
  HelpCircle,
  Upload
} from "lucide-react";

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const socialIconMap: { [key: string]: any } = {
  "Instagram": InstagramIcon,
  "Facebook": FacebookIcon,
  "WhatsApp": MessageCircle,
};

interface FormField {
  id: string;
  label: string;
  type: string;
  required: boolean;
  placeholder: string;
  enabled: boolean;
  options?: string;
}

interface SocialLink {
  name: string;
  href: string;
  value: string;
}

interface ContactPageConfig {
  hero: {
    pill: string;
    title: string;
    subtitle: string;
  };
  destinationEmail: string;
  mapIframe: string;
  socials: SocialLink[];
  formFields: FormField[];
}

interface ContactClientProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any;
}

export default function ContactClient({ content }: ContactClientProps) {
  const contactPage: ContactPageConfig = content?.contactPage || {
    hero: {
      pill: "Contacto",
      title: "Hablemos de *tu proyecto*",
      subtitle: "Completá el formulario o escribinos por nuestras redes. Nos pondremos en contacto a la brevedad."
    },
    destinationEmail: "contacto@powerprint.com",
    mapIframe: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.0167132768468!2d-58.383759024259834!3d-34.60373887295175!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4aa2261907b28e87%3A0x11859edd396e1192!2sEl%20Obelisco!5e0!3m2!1ses-419!2sar!4v1700000000000!5m2!1ses-419!2sar",
    socials: [
      { name: "Instagram", href: "https://instagram.com", value: "@powerprint" },
      { name: "Facebook", href: "https://facebook.com", value: "Power Print" },
      { name: "WhatsApp", href: "https://wa.me/5491100000000", value: "+54 9 11 0000-0000" }
    ],
    formFields: [
      { id: "name", label: "Nombre", type: "text", required: true, placeholder: "Ej. Juan Pérez", enabled: true },
      { id: "email", label: "Email", type: "email", required: true, placeholder: "Ej. juan@correo.com", enabled: true },
      { id: "message", label: "Mensaje", type: "textarea", required: true, placeholder: "Detalles del proyecto...", enabled: true }
    ]
  };

  const [formData, setFormData] = useState<Record<string, string>>({});
  const [fileData, setFileData] = useState<Record<string, File | null>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileChange = (id: string, file: File | null) => {
    setFileData(prev => ({ ...prev, [id]: file }));
    if (errors[id]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  };

  const activeFields = contactPage.formFields.filter(f => f.enabled);

  const handleInputChange = (id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
    if (errors[id]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    setSubmitStatus("idle");

    // Client side validation
    const newErrors: Record<string, string> = {};
    for (const field of activeFields) {
      if (field.type === "file") {
        const file = fileData[field.id];
        if (field.required && !file) {
          newErrors[field.id] = `El campo "${field.label}" es obligatorio.`;
        }
      } else {
        const val = formData[field.id];
        if (field.required && (!val || val.trim() === "")) {
          newErrors[field.id] = `El campo "${field.label}" es obligatorio.`;
        }
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      for (const field of activeFields) {
        if (field.type === "file") {
          const file = fileData[field.id];
          if (file) {
            formDataToSend.append(field.id, file);
          }
        } else {
          const val = formData[field.id] || "";
          formDataToSend.append(field.id, val);
        }
      }

      const response = await fetch("/api/contact", {
        method: "POST",
        body: formDataToSend,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitStatus("success");
        setFormData({});
        setFileData({});
      } else {
        setSubmitStatus("error");
        setErrorMessage(result.error || "Ocurrió un error al enviar el formulario.");
        if (result.errors) {
          setErrors(result.errors);
        }
      }
    } catch (err) {
      console.error(err);
      setSubmitStatus("error");
      setErrorMessage("No se pudo conectar con el servidor. Inténtalo más tarde.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const parseTitle = (text: string) => {
    if (!text) return "";
    const parts = text.split(/(\*[^*]+\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith("*") && part.endsWith("*")) {
        const cleanText = part.slice(1, -1);
        return (
          <span key={idx} className="bg-gradient-to-r from-orange-main to-red-main bg-clip-text text-transparent inline-block font-black">
            {cleanText}
          </span>
        );
      }
      const subParts = part.split("\n");
      return subParts.map((sub, sIdx) => (
        <span key={`${idx}-${sIdx}`}>
          {sub}
          {sIdx < subParts.length - 1 && <br />}
        </span>
      ));
    });
  };

  return (
    <div className="min-h-screen w-full flex flex-col font-sans antialiased bg-gradient-to-t from-neutral-50 via-neutral-50 to-orange-100/30 overflow-x-clip selection:bg-orange-200/80 selection:text-orange-950">
      
      {/* Navbar */}
      <Navbar data={content?.navbar} categories={content?.heroAndShowcase?.categories} />

      <main className="flex-1 w-full flex flex-col items-center">
        
        {/* Hero Section */}
        <section className="w-full max-w-7xl mx-auto px-6 pt-24 pb-16 md:pt-32 md:pb-24 flex flex-col items-center gap-8 text-center select-none">
          <div className="bg-orange-50 border border-orange-main/30 px-4 py-1.5 rounded-full flex items-center shrink-0">
            <span className="text-xs font-extrabold text-orange-main uppercase tracking-wider">
              {contactPage.hero.pill}
            </span>
          </div>
          
          <h1 className="max-w-[1100px] text-center font-black leading-[1.1] text-4xl md:text-[80px] lg:text-[90px] text-neutral-900 tracking-tight">
            {parseTitle(contactPage.hero.title)}
          </h1>

          <p className="max-w-[780px] text-sm md:text-lg text-neutral-500 font-semibold leading-relaxed mt-2">
            {contactPage.hero.subtitle}
          </p>
        </section>

        {/* Form and Contact Info Grid */}
        <section className="w-full max-w-7xl mx-auto px-6 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Form Card */}
          <div className="lg:col-span-7 bg-white/80 backdrop-blur-md border border-neutral-200/50 rounded-3xl p-6 md:p-10 shadow-xl shadow-orange-950/5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[6px] bg-gradient-to-r from-orange-main to-red-main" />
            
            {submitStatus === "success" ? (
              <div className="flex flex-col items-center text-center py-10 animate-fade-in">
                <div className="w-16 h-16 bg-green-50 border border-green-200 text-green-500 rounded-full flex items-center justify-center mb-6 shadow-sm">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-neutral-900 mb-2">¡Mensaje Enviado!</h3>
                <p className="text-neutral-500 font-semibold max-w-sm mb-8">
                  Tu consulta fue registrada con éxito. Nos comunicaremos contigo al correo o teléfono proporcionado a la brevedad.
                </p>
                <button
                  onClick={() => setSubmitStatus("idle")}
                  className="px-6 py-3 bg-neutral-900 text-white rounded-xl font-bold hover:bg-neutral-800 transition-colors duration-200"
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <h3 className="text-2xl font-black text-neutral-900">Envíanos tu consulta</h3>
                  <p className="text-sm font-semibold text-neutral-500">Completa el formulario a continuación y te responderemos pronto.</p>
                </div>

                {submitStatus === "error" && (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <div className="text-sm font-semibold">{errorMessage}</div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {activeFields.map((field) => {
                    const isFullWidth = field.type === "textarea" || field.type === "file";
                    const fieldElement = (
                      <div key={field.id} className={`flex flex-col gap-2 ${isFullWidth ? "md:col-span-2" : ""}`}>
                        <label htmlFor={field.id} className="text-sm font-extrabold text-neutral-700 flex items-center gap-1">
                          {field.label}
                          {field.required && <span className="text-red-main font-bold">*</span>}
                        </label>
                        
                        {field.type === "textarea" ? (
                          <textarea
                            id={field.id}
                            value={formData[field.id] || ""}
                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                            placeholder={field.placeholder}
                            rows={5}
                            className={`w-full bg-neutral-50/50 border ${errors[field.id] ? "border-red-500" : "border-neutral-200"} rounded-xl px-4 py-3 text-neutral-900 placeholder:text-neutral-400 text-base focus:ring-2 focus:ring-orange-main focus:border-transparent outline-none transition-all duration-200 resize-y`}
                          />
                        ) : field.type === "select" ? (
                          <select
                            id={field.id}
                            value={formData[field.id] || ""}
                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                            className={`w-full bg-neutral-50/50 border ${errors[field.id] ? "border-red-500" : "border-neutral-200"} rounded-xl px-4 py-3 text-neutral-900 text-base focus:ring-2 focus:ring-orange-main focus:border-transparent outline-none transition-all duration-200 appearance-none`}
                            style={{ backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23737373' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`, backgroundPosition: 'right 16px center', backgroundRepeat: 'no-repeat', backgroundSize: '18px' }}
                          >
                            <option value="">{field.placeholder || "Selecciona una opción"}</option>
                            {(field.options ? field.options.split(",") : []).map(opt => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        ) : field.type === "file" ? (
                          <div className="relative flex flex-col items-center justify-center w-full min-h-[110px] border-2 border-dashed border-neutral-200 hover:border-orange-main/50 rounded-2xl cursor-pointer bg-neutral-50/30 hover:bg-orange-50/10 transition-all duration-200 px-4 py-5 text-center">
                            <input
                              id={field.id}
                              type="file"
                              onChange={(e) => handleFileChange(field.id, e.target.files?.[0] || null)}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <Upload className="w-8 h-8 text-neutral-400 mb-2" />
                            <span className="text-sm font-bold text-neutral-700">
                              {fileData[field.id] ? fileData[field.id]!.name : (field.placeholder || "Seleccionar o arrastrar archivo")}
                            </span>
                            <span className="text-xs text-neutral-400 mt-1 font-semibold">
                              {fileData[field.id] ? `${(fileData[field.id]!.size / 1024 / 1024).toFixed(2)} MB` : "Archivos de hasta 10MB"}
                            </span>
                            {fileData[field.id] && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleFileChange(field.id, null);
                                }}
                                className="mt-2.5 text-xs font-extrabold text-red-600 hover:text-red-500 underline cursor-pointer relative z-10"
                              >
                                Quitar archivo
                              </button>
                            )}
                          </div>
                        ) : (
                          <input
                            id={field.id}
                            type={field.type}
                            value={formData[field.id] || ""}
                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                            placeholder={field.placeholder}
                            className={`w-full bg-neutral-50/50 border ${errors[field.id] ? "border-red-500" : "border-neutral-200"} rounded-xl px-4 py-3 text-neutral-900 placeholder:text-neutral-400 text-base focus:ring-2 focus:ring-orange-main focus:border-transparent outline-none transition-all duration-200`}
                          />
                        )}

                        {errors[field.id] && (
                          <span className="text-xs font-semibold text-red-600 flex items-center gap-1 mt-0.5">
                            <AlertCircle className="w-3.5 h-3.5" />
                            {errors[field.id]}
                          </span>
                        )}
                      </div>
                    );

                    return fieldElement;
                  })}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-4 w-full bg-gradient-to-r from-orange-main to-red-main text-white font-extrabold text-lg py-4 rounded-xl shadow-lg shadow-orange-main/20 hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:pointer-events-none"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span>Enviando...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Enviar Consulta</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Contact Info Cards & Map */}
          <div className="lg:col-span-5 flex flex-col gap-6 w-full">
            
            {/* General contact info card */}
            <div className="bg-white/80 backdrop-blur-md border border-neutral-200/50 rounded-3xl p-6 md:p-8 shadow-xl shadow-orange-950/5">
              <h3 className="text-xl font-black text-neutral-900 mb-6">Información de contacto</h3>
              
              <div className="flex flex-col gap-5">
                {/* Destination email */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-orange-50 border border-orange-100 text-orange-main rounded-xl flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-neutral-400 uppercase tracking-wider">Correo de atención</h4>
                    <p className="text-base font-bold text-neutral-800 mt-0.5">{contactPage.destinationEmail}</p>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-[1px] bg-neutral-200/60 w-full" />

                {/* Social media connections */}
                <div className="flex flex-col gap-4">
                  <h4 className="text-xs font-extrabold text-neutral-400 uppercase tracking-wider">Redes sociales</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                    {contactPage.socials.map((social) => {
                      const Icon = socialIconMap[social.name] || HelpCircle;
                      return (
                        <a
                          key={social.name}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 bg-neutral-50/50 border border-neutral-200/60 rounded-2xl hover:border-orange-main/30 hover:bg-orange-50/20 transition-all duration-300 shadow-sm"
                        >
                          <div className="w-8 h-8 bg-white border border-neutral-200/80 rounded-lg flex items-center justify-center text-neutral-700 shrink-0 shadow-sm">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="overflow-hidden">
                            <span className="block text-[10px] font-extrabold text-neutral-400 uppercase tracking-wide leading-none">{social.name}</span>
                            <span className="block text-sm font-bold text-neutral-800 truncate mt-0.5">{social.value}</span>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>

            {/* Google Map Card */}
            <div className="bg-white/80 backdrop-blur-md border border-neutral-200/50 rounded-3xl p-4 shadow-xl shadow-orange-950/5 overflow-hidden flex flex-col gap-4">
              <div className="flex items-center gap-3 px-2">
                <div className="w-8 h-8 bg-orange-50 border border-orange-100 text-orange-main rounded-lg flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-neutral-400 uppercase tracking-wider leading-none">Ubicación</h4>
                  <span className="text-sm font-bold text-neutral-800">Nuestra zona de cobertura</span>
                </div>
              </div>
              
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-neutral-200/60 shadow-inner">
                <iframe
                  src={contactPage.mapIframe}
                  className="absolute inset-0 w-full h-full border-0"
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Power Print Location Map"
                />
              </div>
            </div>

          </div>

        </section>

        {/* CTA Section */}
        <CTASection data={{ ...content?.ctaSection, logoTypo: content?.navbar?.logoWhite }} />

      </main>

      {/* Footer */}
      <Footer data={content?.footer} />
      
    </div>
  );
}
