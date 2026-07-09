"use client";

import React, { Suspense, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Particles } from "../objects/Particles";
import { LightBeams, FogLayer, GradientSphere } from "../objects/Environment";
import { CursorLight } from "../objects/CursorLight";

/* ═══════════════════════════════════════════
   CineVault — Hero Background Scene
   Cinematic 3D environment with particles,
   volumetric lighting, fog, and cursor interaction
   ═══════════════════════════════════════════ */

interface HeroBackgroundProps {
  accentColor?: string;
}

function CameraAnimation() {
  const cameraRef = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    // Gentle camera sway based on mouse
    const targetX = state.pointer.x * 0.5;
    const targetY = state.pointer.y * 0.3;

    cameraRef.current.x += (targetX - cameraRef.current.x) * 0.03;
    cameraRef.current.y += (targetY - cameraRef.current.y) * 0.03;

    state.camera.position.x = cameraRef.current.x;
    state.camera.position.y = cameraRef.current.y;
    state.camera.lookAt(0, 0, 0);

    // Subtle breathing zoom
    const breathe = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    state.camera.position.z = 8 + breathe;
  });

  return null;
}

export function HeroBackground({ accentColor = "#2563EB" }: HeroBackgroundProps) {
  return (
    <Suspense fallback={null}>
      {/* Background gradient sphere */}
      <GradientSphere color1="#050810" color2="#0B0F19" scale={35} />

      {/* Particles */}
      <Particles
        count={6000}
        color={accentColor}
        speed={0.2}
        mouseInfluence={3}
        spread={25}
        size={0.012}
      />

      {/* Volumetric light beams */}
      <LightBeams count={4} color={accentColor} opacity={0.04} speed={0.2} />

      {/* Fog */}
      <FogLayer opacity={0.1} height={-4} />

      {/* Cursor-following light */}
      <CursorLight color={accentColor} intensity={1.5} distance={12} />

      {/* Camera animation */}
      <CameraAnimation />

      {/* Subtle directional light */}
      <directionalLight
        position={[5, 5, 5]}
        intensity={0.05}
        color={accentColor}
      />
    </Suspense>
  );
}
