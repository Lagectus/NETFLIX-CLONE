"use client";

import React, { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import styles from "./GlassCard.module.css";

/* ═══════════════════════════════════════════
   CineVault — Premium Glass Card Component
   3D tilt, glow border, reflection, depth
   ═══════════════════════════════════════════ */

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  tilt?: boolean;
  glow?: boolean;
  glowColor?: string;
  hover?: boolean;
  onClick?: () => void;
  as?: "div" | "article" | "section";
  intensity?: number;
}

export function GlassCard({
  children,
  className,
  tilt = true,
  glow = true,
  glowColor = "rgba(37, 99, 235, 0.3)",
  hover = true,
  onClick,
  as = "div",
  intensity = 15,
}: GlassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0 });
  const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!tilt || !cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      setTransform({
        rotateX: (y - 0.5) * -intensity,
        rotateY: (x - 0.5) * intensity,
      });
      setGlowPosition({ x: x * 100, y: y * 100 });
    },
    [tilt, intensity]
  );

  const handleMouseLeave = useCallback(() => {
    setTransform({ rotateX: 0, rotateY: 0 });
    setGlowPosition({ x: 50, y: 50 });
    setIsHovered(false);
  }, []);

  const MotionComponent = as === "section" ? motion.section : as === "article" ? motion.article : motion.div;

  return (
    <MotionComponent
      ref={cardRef}
      className={`${styles.card} ${hover ? styles.cursorPointer : ''} ${(isHovered && glow) ? styles.glowActive : ''} ${className || ''}`}
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
      animate={{
        rotateX: transform.rotateX,
        rotateY: transform.rotateY,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {/* Glow effect following cursor */}
      {glow && isHovered && (
        <div
          className={styles.glowEffect}
          style={{
            background: `radial-gradient(circle at ${glowPosition.x}% ${glowPosition.y}%, ${glowColor}, transparent 60%)`,
          }}
        />
      )}

      {/* Top reflection line */}
      <div className={styles.reflectionLine} />

      {/* Content */}
      <div className={styles.contentWrapper}>{children}</div>
    </MotionComponent>
  );
}
