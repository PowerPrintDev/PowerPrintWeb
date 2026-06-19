"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, Eye, EyeOff, Loader2 } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Check status on mount
  useEffect(() => {
    fetch("/api/admin/status")
      .then((res) => res.json())
      .then((data) => {
        if (data.loggedIn) {
          router.push("/admin");
        }
      });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(data.error || "Credenciales incorrectas");
        setLoading(false);
      }
    } catch (err) {
      setError("Error al conectar con el servidor");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-neutral-950 relative overflow-hidden font-sans select-none selection:bg-orange-main/30 selection:text-orange-200">
      
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-orange-main/10 blur-[120px] pointer-events-none animate-pulse duration-10000" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[400px] h-[400px] rounded-full bg-red-main/10 blur-[130px] pointer-events-none animate-pulse duration-10000 delay-2000" />

      {/* Main card */}
      <div className="relative z-10 w-full max-w-[420px] px-6">
        
        {/* Logo / Header Branding */}
        <div className="flex flex-col items-center gap-4 mb-8">
          <img
            src="/assets/logo.svg"
            alt="Power Print Logo"
            className="h-16 w-auto object-contain filter drop-shadow-[0_0_15px_rgba(246,131,34,0.2)]"
          />
          <h1 className="text-2xl font-black tracking-tight text-neutral-100 text-center">
            Consola de Administración
          </h1>
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">
            Power Print CMS
          </p>
        </div>

        {/* Login Form Container */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col gap-6">
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {error && (
              <div className="bg-red-main/10 border border-red-main/20 text-red-400 text-sm px-4 py-3 rounded-xl font-bold animate-shake">
                {error}
              </div>
            )}

            {/* Username Input */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider pl-1">
                Usuario
              </label>
              <div className="relative flex items-center">
                <User className="absolute left-4 w-5 h-5 text-neutral-500" />
                <input
                  type="text"
                  required
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                  className="w-full bg-neutral-900 border border-white/5 focus:border-orange-main focus:shadow-[0_0_12px_rgba(246,131,34,0.15)] rounded-xl py-3.5 pl-12 pr-4 text-sm font-semibold text-neutral-100 placeholder-neutral-600 focus:outline-none transition-all duration-300 disabled:opacity-50"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider pl-1">
                Contraseña
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute left-4 w-5 h-5 text-neutral-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full bg-neutral-900 border border-white/5 focus:border-orange-main focus:shadow-[0_0_12px_rgba(246,131,34,0.15)] rounded-xl py-3.5 pl-12 pr-12 text-sm font-semibold text-neutral-100 placeholder-neutral-600 focus:outline-none transition-all duration-300 disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 p-1 rounded hover:bg-white/5 text-neutral-500 hover:text-neutral-300 transition-colors focus:outline-none cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full py-4 bg-gradient-to-r from-orange-main to-red-main hover:opacity-95 text-white font-bold rounded-xl shadow-lg shadow-orange-main/20 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Iniciando sesión...</span>
                </>
              ) : (
                <span>Ingresar</span>
              )}
            </button>
          </form>

        </div>

        {/* Footer info link */}
        <p className="text-center text-xs text-neutral-600 mt-8 font-semibold">
          Power Print & Graphic Solutions
        </p>

      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
        .animate-pulse {
          animation: pulse 10s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 0.4; }
        }
      `}</style>

    </div>
  );
}
