"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { GradientText } from "@/components/ui/Primitives";
import { ThreeCanvas } from "@/providers/ThreeProvider";
import { HeroBackground } from "@/three/scenes/HeroBackground";
import styles from "./register.module.css";

/* ═══════════════════════════════════════════
   CineVault — Register Page
   Multi-step registration with 3D background
   ═══════════════════════════════════════════ */

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 2) {
      setStep(2);
      return;
    }
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsLoading(false);
  };

  return (
    <div className={styles.pageWrapper}>
      {/* 3D Background */}
      <div className={styles.bgContainer}>
        <ThreeCanvas dpr={[1, 1.5]}>
          <HeroBackground accentColor="#7C3AED" />
        </ThreeCanvas>
      </div>

      <div className={styles.overlay} />

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

          {/* Steps indicator */}
          <div className={styles.stepIndicatorRow}>
            {[1, 2].map((s) => (
              <div key={s} className={styles.stepItem}>
                <div
                  className={`${styles.stepCircle} ${step >= s ? styles.stepCircleActive : styles.stepCircleInactive}`}
                >
                  {s}
                </div>
                {s < 2 && (
                  <div
                    className={`${styles.stepLine} ${step > s ? styles.stepLineActive : styles.stepLineInactive}`}
                  />
                )}
              </div>
            ))}
          </div>

          <h1 className={styles.title}>
            {step === 1 ? "Create account" : "Set up your profile"}
          </h1>
          <p className={styles.subtitle}>
            {step === 1
              ? "Start your premium streaming journey"
              : "Almost there! Just a few more details"}
          </p>

          <form onSubmit={handleSubmit} className={styles.form}>
            {step === 1 ? (
              <>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className={styles.input}
                    required
                  />
                </div>
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
              </>
            ) : (
              <>
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
                    minLength={8}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className={styles.input}
                    required
                    minLength={8}
                  />
                </div>
              </>
            )}

            <div className={styles.btnRow}>
              {step > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="lg"
                  onClick={() => setStep(step - 1)}
                >
                  Back
                </Button>
              )}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isLoading}
                glow
              >
                {step === 1 ? "Continue" : "Create Account"}
              </Button>
            </div>
          </form>

          <p className={styles.signupText}>
            Already have an account?{" "}
            <Link href="/login" className={styles.signupLink}>
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
