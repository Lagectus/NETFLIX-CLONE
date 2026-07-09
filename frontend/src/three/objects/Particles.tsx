"use client";

import React, { useRef, useMemo, useCallback } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* ═══════════════════════════════════════════
   CineVault — GPU Particle System
   10k+ instanced particles with mouse interaction,
   depth-based fading, and organic movement
   ═══════════════════════════════════════════ */

interface ParticlesProps {
  count?: number;
  size?: number;
  color?: string;
  speed?: number;
  mouseInfluence?: number;
  spread?: number;
}

export function Particles({
  count = 8000,
  size = 0.015,
  color = "#60A5FA",
  speed = 0.3,
  mouseInfluence = 2,
  spread = 20,
}: ParticlesProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const mouseRef = useRef(new THREE.Vector3());
  const { viewport } = useThree();

  // Temp objects for performance (no allocations in render loop)
  const tempObject = useMemo(() => new THREE.Object3D(), []);
  const tempColor = useMemo(() => new THREE.Color(), []);

  // Generate initial particle data
  const particleData = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Spread particles in 3D space
      positions[i * 3] = (Math.random() - 0.5) * spread;
      positions[i * 3 + 1] = (Math.random() - 0.5) * spread;
      positions[i * 3 + 2] = (Math.random() - 0.5) * spread * 0.5;

      // Random velocities for organic movement
      velocities[i * 3] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.01;

      // Random phase for wave animations
      phases[i] = Math.random() * Math.PI * 2;

      // Varied sizes
      sizes[i] = 0.5 + Math.random() * 1.5;
    }

    return { positions, velocities, phases, sizes };
  }, [count, spread]);

  // Mouse tracking
  const handlePointerMove = useCallback(
    (e: { point: THREE.Vector3 }) => {
      mouseRef.current.copy(e.point);
    },
    []
  );

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.elapsedTime * speed;
    const mouse = mouseRef.current;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const phase = particleData.phases[i];

      // Base position with organic wave motion
      let x =
        particleData.positions[i3] +
        Math.sin(time + phase) * 0.3 +
        particleData.velocities[i3] * time * 20;
      let y =
        particleData.positions[i3 + 1] +
        Math.cos(time * 0.8 + phase) * 0.3 +
        particleData.velocities[i3 + 1] * time * 20;
      let z =
        particleData.positions[i3 + 2] +
        Math.sin(time * 0.6 + phase * 2) * 0.15;

      // Wrap around boundaries
      const halfSpread = spread / 2;
      if (x > halfSpread) x -= spread;
      if (x < -halfSpread) x += spread;
      if (y > halfSpread) y -= spread;
      if (y < -halfSpread) y += spread;

      // Mouse influence — particles gently push away from cursor
      const dx = x - mouse.x;
      const dy = y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const influence = Math.max(0, 1 - dist / mouseInfluence);

      if (influence > 0) {
        const pushForce = influence * 0.5;
        x += (dx / dist) * pushForce;
        y += (dy / dist) * pushForce;
      }

      // Set instance transform
      tempObject.position.set(x, y, z);
      const s = particleData.sizes[i] * size * (1 + Math.sin(time + phase) * 0.3);
      tempObject.scale.setScalar(s);
      tempObject.updateMatrix();
      meshRef.current.setMatrixAt(i, tempObject.matrix);

      // Color based on depth (closer = brighter)
      const depthFactor = THREE.MathUtils.mapLinear(
        z,
        -spread * 0.25,
        spread * 0.25,
        0.2,
        1
      );
      tempColor
        .set(color)
        .multiplyScalar(depthFactor * (0.7 + influence * 0.5));
      meshRef.current.setColorAt(i, tempColor);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  });

  return (
    <group onPointerMove={handlePointerMove}>
      {/* Invisible plane for mouse tracking */}
      <mesh visible={false}>
        <planeGeometry args={[viewport.width * 2, viewport.height * 2]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Instanced particles */}
      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, count]}
        frustumCulled={false}
      >
        <sphereGeometry args={[1, 6, 6]} />
        <meshBasicMaterial transparent opacity={0.8} toneMapped={false} />
      </instancedMesh>
    </group>
  );
}
