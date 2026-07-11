"use client";

import React, { useState, useMemo, useRef } from 'react';
import { Settings, Image as ImageIcon, Lightbulb, Download } from 'lucide-react';
import { toPng } from 'html-to-image';
import content from '../../data/content.json';

export default function SimuladorPage() {
  const [text, setText] = useState("POWERPRINT");

  // Default sprite settings (can be calibrated)
  const [cols, setCols] = useState(6); // 6 columns
  const [rows, setRows] = useState(5); // 5 rows (26 letters fit in 6x5)
  const [showSettings, setShowSettings] = useState(false);
  const [isLightOn, setIsLightOn] = useState(false);
  const [bgSelection, setBgSelection] = useState('bg1'); // 'none', 'bg1', 'bg2'
  const [letterMapStr, setLetterMapStr] = useState("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
  
  const previewRef = useRef<HTMLDivElement>(null);

  const handleExport = async () => {
    if (previewRef.current === null) return;
    try {
      const dataUrl = await toPng(previewRef.current, { 
        cacheBust: true,
      });
      const link = document.createElement('a');
      link.download = 'simulacion-powerprint.png';
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error exportando imagen:', err);
    }
  };

  const letterMap = letterMapStr.split('');

  const letters = useMemo(() => {
    return text.toUpperCase().split('').map((char, index) => {
      if (char === ' ') return { char, isSpace: true, key: index };

      const charIndex = letterMap.indexOf(char);
      if (charIndex === -1) return { char, isSpace: false, key: index, isUnknown: true };

      const col = charIndex % cols;
      const row = Math.floor(charIndex / cols);

      const posX = cols > 1 ? (col / (cols - 1)) * 100 : 0;
      const posY = rows > 1 ? (row / (rows - 1)) * 100 : 0;

      const bgSizeX = cols * 100;
      const bgSizeY = rows * 100;

      return {
        char,
        isSpace: false,
        key: index,
        isUnknown: false,
        style: {
          backgroundImage: 'url(/assets/font/1.png)',
          backgroundPosition: `${posX}% ${posY}%`,
          backgroundSize: `${bgSizeX}% ${bgSizeY}%`
        }
      };
    });
  }, [text, cols, rows, letterMap]);

  const containerStyle = useMemo(() => {
    if (bgSelection === 'none') return {};

    let url = '';
    if (bgSelection === 'bg1') {
      url = isLightOn ? '/assets/font/bg1Dark.png' : '/assets/font/bg1.png';
    } else if (bgSelection === 'bg2') {
      url = isLightOn ? '/assets/font/bg2Dark.png' : '/assets/font/bg2.png';
    }

    return {
      backgroundImage: `url(${url})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    };
  }, [bgSelection, isLightOn]);

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter bg-gradient-to-br from-white to-neutral-500 bg-clip-text text-transparent">
            Simulador de Letras Corpóreas
          </h1>
          <p className="text-neutral-400 text-lg md:text-xl max-w-2xl mx-auto">
            Escribe tu texto y visualiza cómo quedaría con nuestras letras volumétricas.
          </p>
        </header>

        <main className="space-y-8">
          {/* Input Section */}
          <div className="max-w-2xl mx-auto space-y-6">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Escribe aquí..."
              className="w-full bg-neutral-900 border-2 border-neutral-800 rounded-2xl px-6 py-4 text-2xl md:text-4xl text-center font-bold text-white focus:outline-none focus:border-amber-500 transition-colors shadow-2xl"
              maxLength={20}
            />
            <div className="flex justify-center flex-wrap gap-4">
              <button
                onClick={() => setIsLightOn(!isLightOn)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${isLightOn ? 'bg-amber-500 text-neutral-950 shadow-[0_0_20px_rgba(251,191,36,0.6)]' : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'}`}
              >
                <Lightbulb size={20} className={isLightOn ? 'animate-pulse' : ''} />
                {isLightOn ? 'Apagar Luces' : 'Encender Luces'}
              </button>

              <div className="flex bg-neutral-900 rounded-full p-1 border border-neutral-800">
                <button
                  onClick={() => setBgSelection('none')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${bgSelection === 'none' ? 'bg-neutral-700 text-white' : 'text-neutral-400 hover:text-white'}`}
                >
                  Sin Fondo
                </button>
                <button
                  onClick={() => setBgSelection('bg1')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${bgSelection === 'bg1' ? 'bg-neutral-700 text-white' : 'text-neutral-400 hover:text-white'}`}
                >
                  Ladrillos
                </button>
                <button
                  onClick={() => setBgSelection('bg2')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${bgSelection === 'bg2' ? 'bg-neutral-700 text-white' : 'text-neutral-400 hover:text-white'}`}
                >
                  Vegetación
                </button>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div 
            ref={previewRef}
            className={`rounded-3xl p-8 md:p-16 border border-neutral-800 shadow-2xl overflow-hidden min-h-[300px] flex items-center justify-center flex-wrap -space-x-4 md:-space-x-8 relative transition-all duration-700 ${bgSelection === 'none' ? 'bg-neutral-900/50 backdrop-blur-sm' : ''}`}
            style={containerStyle}
          >
            {letters.map((letter) => {
              if (letter.isSpace) {
                return <div key={letter.key} className="w-8 md:w-16" />;
              }
              if (letter.isUnknown) {
                return (
                  <div key={letter.key} className="w-16 h-24 md:w-24 md:h-32 bg-neutral-800/50 border border-dashed border-neutral-700 rounded-lg flex items-center justify-center text-neutral-500 font-mono text-xl">
                    {letter.char}
                  </div>
                );
              }

              return (
                <div
                  key={letter.key}
                  className="w-16 h-24 md:w-32 md:h-48 relative drop-shadow-2xl hover:scale-105 transition-transform cursor-default select-none group"
                  style={{ zIndex: letters.length - letter.key }}
                >
                  <div
                    className="w-full h-full bg-no-repeat transition-all duration-500 group-hover:brightness-110"
                    style={{
                      ...letter.style,
                      filter: isLightOn ? 'drop-shadow(0 0 15px rgba(238, 238, 238, 0.93)) drop-shadow(0 0 35px rgba(226, 217, 193, 0.1))' : 'drop-shadow(0 0 0px rgba(0,0,0,0))'
                    }}
                  />
                </div>
              );
            })}

            {letters.length === 0 && (
              <div className="text-neutral-600 flex flex-col items-center gap-4">
                <ImageIcon size={48} className="opacity-50" />
                <p className="text-xl">Ingresa un texto para visualizar</p>
              </div>
            )}

            {/* Logo in bottom right */}
            <div className="absolute bottom-6 right-8 opacity-60 hover:opacity-100 transition-opacity pointer-events-none">
              <img src={content.navbar.logoWhite} alt="PowerPrint Logo" className="h-6 md:h-8 object-contain" />
            </div>
          </div>

          {/* Export Button Section */}
          <div className="flex justify-center mt-8">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-8 py-4 bg-white text-neutral-950 rounded-full font-bold hover:bg-neutral-200 transition-colors shadow-lg hover:scale-105 active:scale-95"
            >
              <Download size={20} />
              Exportar Imagen
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
