"use client";

import React, { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* ═══════════════════════════════════════════
   CineVault — Interactive Cursor Light
   Point light that follows mouse with color shifting
   ═══════════════════════════════════════════ */

interface CursorLightProps {
  color?: string;
  intensity?: number;
  distance?: number;
  smoothing?: number;
}

export function CursorLight({
  color = "#60A5FA",
  intensity = 2,
  distance = 15,
  smoothing = 0.08,
}: CursorLightProps) {
  const lightRef = useRef<THREE.PointLight>(null);
  const targetPos = useRef(new THREE.Vector3());
  const currentPos = useRef(new THREE.Vector3());
  const { viewport } = useThree();

  useFrame((state) => {
    if (!lightRef.current) return;

    // Map normalized mouse to viewport coordinates
    targetPos.current.set(
      (state.pointer.x * viewport.width) / 2,
      (state.pointer.y * viewport.height) / 2,
      3
    );

    // Smooth interpolation for cinematic feel
    currentPos.current.lerp(targetPos.current, smoothing);
    lightRef.current.position.copy(currentPos.current);

    // Subtle intensity pulse
    lightRef.current.intensity =
      intensity * (0.8 + Math.sin(state.clock.elapsedTime * 2) * 0.2);
  });

  return (
    <>
      <pointLight
        ref={lightRef}
        color={color}
        intensity={intensity}
        distance={distance}
        decay={2}
      />
      {/* Ambient fill light */}
      <ambientLight intensity={0.1} color="#131A2A" />
    </>
  );
}
