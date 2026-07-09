"use client";

import React from "react";
import { motion } from "framer-motion";
import styles from "./Primitives.module.css";

/* ═══════════════════════════════════════════
   CineVault — Animated Gradient Text
   ═══════════════════════════════════════════ */

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  from?: string;
  via?: string;
  to?: string;
  animate?: boolean;
  as?: "span" | "h1" | "h2" | "h3" | "h4" | "p";
}

export function GradientText({
  children,
  className,
  from = "#2563EB",
  via = "#60A5FA",
  to = "#818CF8",
  animate = true,
  as = "span",
}: GradientTextProps) {
  const Tag = as === "h1" ? motion.h1 : as === "h2" ? motion.h2 : as === "h3" ? motion.h3 : as === "h4" ? motion.h4 : as === "p" ? motion.p : motion.span;

  return (
    <Tag
      className={`${styles.gradientText} ${animate ? styles.animateGradientShift : ''} ${className || ''}`}
      style={{
        backgroundImage: `linear-gradient(135deg, ${from}, ${via}, ${to}, ${from})`,
        backgroundSize: animate ? "200% 200%" : "100% 100%",
      }}
    >
      {children}
    </Tag>
  );
}

/* ═══════════════════════════════════════════
   CineVault — Premium Skeleton Loader
   ═══════════════════════════════════════════ */

interface SkeletonProps {
  className?: string;
  variant?: "rectangular" | "circular" | "text";
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  className,
  variant = "rectangular",
  width,
  height,
}: SkeletonProps) {
  return (
    <div
      className={`${styles.skeleton} ${variant === "circular" ? styles.skeletonCircular : ''} ${variant === "rectangular" ? styles.skeletonRectangular : ''} ${variant === "text" ? styles.skeletonText : ''} ${className || ''}`}
      style={{ width, height }}
    />
  );
}

/* ═══════════════════════════════════════════
   CineVault — Badge Component
   ═══════════════════════════════════════════ */

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "accent" | "success" | "warning" | "premium";
  className?: string;
  icon?: React.ReactNode;
  style?: React.CSSProperties;
}

const badgeVariants: Record<string, string> = {
  default: styles.badgeDefault,
  accent: styles.badgeAccent,
  success: styles.badgeSuccess,
  warning: styles.badgeWarning,
  premium: styles.badgePremium,
};

export function Badge({
  children,
  variant = "default",
  className,
  icon,
  style,
}: BadgeProps) {
  return (
    <motion.span
      className={`${styles.badge} ${badgeVariants[variant]} ${className || ''}`}
      style={style}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    >
      {icon && <span className={styles.badgeIcon}>{icon}</span>}
      {children}
    </motion.span>
  );
}

/* ═══════════════════════════════════════════
   CineVault — Score Ring
   ═══════════════════════════════════════════ */

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function ScoreRing({
  score,
  size = 44,
  strokeWidth = 3,
  className,
}: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 10) * circumference;

  const getColor = (s: number) => {
    if (s >= 8) return "#22C55E";
    if (s >= 6) return "#EAB308";
    return "#EF4444";
  };

  return (
    <div className={`${styles.scoreRing} ${className || ''}`}>
      <svg width={size} height={size} className={styles.scoreRingSvg}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor(score)}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        />
      </svg>
      <span className={styles.scoreRingText}>
        {score.toFixed(1)}
      </span>
    </div>
  );
}
