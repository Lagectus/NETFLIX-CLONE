"use client";

import React, { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* ═══════════════════════════════════════════
   CineVault — Light Beams
   Animated volumetric-style light rays
   ═══════════════════════════════════════════ */

interface LightBeamsProps {
  count?: number;
  color?: string;
  opacity?: number;
  speed?: number;
}

export function LightBeams({
  count = 5,
  color = "#2563EB",
  opacity = 0.06,
  speed = 0.3,
}: LightBeamsProps) {
  const groupRef = useRef<THREE.Group>(null);

  const beams = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      position: [(Math.random() - 0.5) * 15, 8, -5 - Math.random() * 5] as [number, number, number],
      rotation: [0, 0, ((Math.random() - 0.5) * Math.PI) / 4] as [number, number, number],
      scale: [0.3 + Math.random() * 0.5, 20, 1] as [number, number, number],
      phase: Math.random() * Math.PI * 2,
      speed: 0.5 + Math.random() * 0.5,
    }));
  }, [count]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime * speed;

    groupRef.current.children.forEach((child, i) => {
      const beam = beams[i];
      const mesh = child as THREE.Mesh;
      const material = mesh.material as THREE.MeshBasicMaterial;

      // Animate opacity
      material.opacity =
        opacity * (0.3 + Math.sin(time * beam.speed + beam.phase) * 0.7);

      // Subtle sway
      mesh.rotation.z =
        beam.rotation[2] + Math.sin(time * 0.5 + beam.phase) * 0.05;
    });
  });

  return (
    <group ref={groupRef}>
      {beams.map((beam, i) => (
        <mesh key={i} position={beam.position} rotation={beam.rotation}>
          <planeGeometry args={[beam.scale[0], beam.scale[1]]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={opacity}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ═══════════════════════════════════════════
   CineVault — Volumetric Fog
   Soft fog layer with noise-based opacity
   ═══════════════════════════════════════════ */

interface FogLayerProps {
  opacity?: number;
  color?: string;
  height?: number;
}

export function FogLayer({
  opacity = 0.15,
  color = "#0B0F19",
  height = -2,
}: FogLayerProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const material = meshRef.current.material as THREE.MeshBasicMaterial;
    material.opacity =
      opacity * (0.7 + Math.sin(state.clock.elapsedTime * 0.3) * 0.3);
  });

  return (
    <mesh ref={meshRef} position={[0, height, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[50, 50]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

/* ═══════════════════════════════════════════
   CineVault — Gradient Sphere
   Animated background gradient environment
   ═══════════════════════════════════════════ */

interface GradientSphereProps {
  color1?: string;
  color2?: string;
  scale?: number;
}

export function GradientSphere({
  color1 = "#0B0F19",
  color2 = "#131A2A",
  scale = 30,
}: GradientSphereProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Create gradient material via vertex colors
  const geometry = useMemo(() => {
    const geo = new THREE.SphereGeometry(1, 32, 32);
    const colors = new Float32Array(geo.attributes.position.count * 3);
    const c1 = new THREE.Color(color1);
    const c2 = new THREE.Color(color2);

    for (let i = 0; i < geo.attributes.position.count; i++) {
      const y = geo.attributes.position.getY(i);
      const t = (y + 1) / 2; // Normalize to 0-1
      const c = c1.clone().lerp(c2, t);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [color1, color2]);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.02;
  });

  return (
    <mesh ref={meshRef} geometry={geometry} scale={scale}>
      <meshBasicMaterial vertexColors side={THREE.BackSide} />
    </mesh>
  );
}
