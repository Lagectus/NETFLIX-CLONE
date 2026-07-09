"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { GradientText } from "@/components/ui/Primitives";
import { ThreeCanvas } from "@/providers/ThreeProvider";
import { HeroBackground } from "@/three/scenes/HeroBackground";
import styles from "./login.module.css";

/* ═══════════════════════════════════════════
   CineVault — Login Page
   Cinematic login with 3D background, floating glass form
   ═══════════════════════════════════════════ */

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulated login
    await new Promise((r) => setTimeout(r, 1500));
    setIsLoading(false);
  };

  return (
    <div className={styles.pageWrapper}>
      {/* 3D Background */}
      <div className={styles.bgContainer}>
        <ThreeCanvas dpr={[1, 1.5]}>
          <HeroBackground accentColor="#2563EB" />
        </ThreeCanvas>
      </div>

      {/* Overlay */}
      <div className={styles.overlay} />

      {/* Form */}
      <motion.div
        className={styles.formContainer}
        initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className={styles.glassStrong}>
          {/* Logo */}
          <div className={styles.logoRow}>
            <div className={styles.logoIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>
            <span className={styles.logoText}>
              Cine<GradientText>Vault</GradientText>
            </span>
          </div>

          <h1 className={styles.title}>Welcome back</h1>
          <p className={styles.subtitle}>
            Sign in to continue streaming
          </p>

          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Email */}
            <div className={styles.inputGroup}>
              <label className={styles.label}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={styles.input}
                required
              />
            </div>

            {/* Password */}
            <div className={styles.inputGroup}>
              <label className={styles.label}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={styles.input}
                required
              />
            </div>

            {/* Remember & Forgot */}
            <div className={styles.rememberRow}>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" className={styles.checkbox} />
                <span className={styles.checkboxText}>Remember me</span>
              </label>
              <a href="#" className={styles.forgotLink}>
                Forgot password?
              </a>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
              glow
            >
              Sign In
            </Button>
          </form>

          {/* Divider */}
          <div className={styles.dividerRow}>
            <div className={styles.dividerLine} />
            <span className={styles.dividerText}>or continue with</span>
            <div className={styles.dividerLine} />
          </div>

          {/* Social login */}
          <div className={styles.socialGrid}>
            <Button variant="outline" size="md">
              Google
            </Button>
            <Button variant="outline" size="md">
              GitHub
            </Button>
          </div>

          {/* Sign up link */}
          <p className={styles.signupText}>
            Don&apos;t have an account?{" "}
            <Link href="/register" className={styles.signupLink}>
              Sign up free
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
