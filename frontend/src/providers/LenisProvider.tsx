"use client";

import React, { useEffect, useRef } from "react";
import Lenis from "lenis";

/* ═══════════════════════════════════════════
   CineVault — Lenis Smooth Scroll Provider
   Integrates with GSAP ScrollTrigger
   ═══════════════════════════════════════════ */

interface LenisProviderProps {
  children: React.ReactNode;
}

export function LenisProvider({ children }: LenisProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Integrate with GSAP ScrollTrigger if available
    if (typeof window !== "undefined") {
      import("gsap").then(({ default: gsap }) => {
        import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
          gsap.registerPlugin(ScrollTrigger);

          lenis.on("scroll", ScrollTrigger.update);

          gsap.ticker.add((time: number) => {
            lenis.raf(time * 1000);
          });

          gsap.ticker.lagSmoothing(0);
        });
      });
    }

    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
