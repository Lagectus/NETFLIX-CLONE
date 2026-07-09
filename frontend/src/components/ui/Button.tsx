"use client";

import React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import styles from "./Button.module.css";

/* ═══════════════════════════════════════════
   CineVault — Premium Button Component
   Glassmorphic with glow, ripple, & animations
   ═══════════════════════════════════════════ */

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "accent";
type ButtonSize = "sm" | "md" | "lg" | "xl";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "size"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  glow?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: styles.variantPrimary,
  secondary: styles.variantSecondary,
  ghost: styles.variantGhost,
  outline: styles.variantOutline,
  accent: styles.variantAccent,
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
  xl: styles.sizeXl,
};

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  icon,
  iconPosition = "left",
  glow = false,
  fullWidth = false,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      className={`${styles.button} ${variantStyles[variant]} ${sizeStyles[size]} ${glow ? styles.glow : ''} ${fullWidth ? styles.fullWidth : ''} ${(disabled || isLoading) ? styles.isLoading : ''} ${className || ''}`}
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      disabled={disabled || isLoading}
      {...props}
    >
      {/* Shimmer overlay on hover */}
      <motion.div
        className={styles.shimmerOverlay}
        whileHover={{ opacity: 1, x: ["-100%", "100%"] }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />

      {/* Content */}
      <span className={styles.contentWrapper}>
        {isLoading ? (
          <svg
            className={styles.spinner}
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className={styles.spinnerCircle}
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className={styles.spinnerPath}
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        ) : (
          <>
            {icon && iconPosition === "left" && (
              <span className={styles.flexShrink}>{icon}</span>
            )}
            {children}
            {icon && iconPosition === "right" && (
              <span className={styles.flexShrink}>{icon}</span>
            )}
          </>
        )}
      </span>
    </motion.button>
  );
}
