"use client";

import { useEffect, useState } from "react";

interface SliderfabricaProps {
    data?: {
        title?: string;
        media?: string[];
        intervalMs?: number;
    };
}

export default function Sliderfabrica({ data }: SliderfabricaProps) {
    const title = data?.title || "Somos fabricantes";
    const media = data?.media || [
        "/assets/ban/c.jpg",
        "/assets/ban/b.jpeg",
        "/assets/ban/a.jpeg",
        "/assets/ban/d.jpeg",
    ];
    const intervalMs = data?.intervalMs || 5000;

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (media.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % media.length);
        }, intervalMs);
        return () => clearInterval(interval);
    }, [media.length, intervalMs]);

    const isVideo = (src: string) => {
        return /\.(mp4|webm|ogg)($|\?)/i.test(src);
    };

    return (
        <section className="relative w-full h-[50vh] overflow-hidden select-none bg-neutral-950">
            {/* Media Slides */}
            {media.map((src, idx) => {
                const isActive = idx === currentIndex;
                return (
                    <div
                        key={src}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${isActive ? "opacity-100 z-10" : "opacity-0 z-0"
                            }`}
                    >
                        {isVideo(src) ? (
                            <video
                                src={src}
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <img
                                src={src}
                                alt={`Fabricación ${idx + 1}`}
                                className={`w-full h-full object-cover transition-transform duration-[6000ms] ease-out ${isActive ? "scale-105" : "scale-100"
                                    }`}
                            />
                        )}
                        {/* Darkened overlay */}
                        <div className="absolute inset-0 bg-black/45" />
                    </div>
                );
            })}

            {/* Text Overlay */}
            <div className="absolute inset-0 z-20 flex items-center justify-center px-4 text-center">
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-widest uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
                    {title}
                </h2>
            </div>
        </section>
    );
}
