"use client";

import React, { lazy, Suspense } from "react";
import styles from "./ThreeProvider.module.css";

/* ═══════════════════════════════════════════
   CineVault — Three.js Canvas Provider
   Lazy-loaded R3F Canvas wrapper with
   performance monitoring and fallback
   ═══════════════════════════════════════════ */

// Lazy load the entire Three.js stack to avoid blocking page load
const Canvas = lazy(() =>
  import("@react-three/fiber").then((mod) => ({ default: mod.Canvas }))
);

interface ThreeCanvasProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  dpr?: [number, number];
  camera?: {
    position?: [number, number, number];
    fov?: number;
    near?: number;
    far?: number;
  };
}

export function ThreeCanvas({
  children,
  className,
  style,
  dpr = [1, 1.5],
  camera = { position: [0, 0, 8], fov: 60, near: 0.1, far: 100 },
}: ThreeCanvasProps) {
  return (
    <Suspense fallback={<ThreeFallback className={className} />}>
      <Canvas
        className={`${styles.canvas} ${className || ''}`}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          ...style,
        }}
        dpr={dpr}
        camera={camera}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
        performance={{ min: 0.5 }}
      >
        {children}
      </Canvas>
    </Suspense>
  );
}

/* ── Fallback while Three.js loads ── */
function ThreeFallback({ className }: { className?: string }) {
  return (
    <div className={`${styles.fallback} ${className || ''}`}>
      {/* Animated gradient fallback */}
      <div className={styles.fallbackGlow} />
    </div>
  );
}
