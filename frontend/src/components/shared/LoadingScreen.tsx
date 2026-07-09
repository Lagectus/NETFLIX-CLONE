"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./LoadingScreen.module.css";

/* ═══════════════════════════════════════════
   CineVault — Cinematic Loading Screen
   Premium branded loading animation with progress
   ═══════════════════════════════════════════ */

export function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsComplete(true), 400);
          setTimeout(() => setIsVisible(false), 1200);
          return 100;
        }
        // Accelerating progress
        const increment = prev < 70 ? Math.random() * 15 + 5 : Math.random() * 8 + 2;
        return Math.min(prev + increment, 100);
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          className={styles.loadingWrapper}
          exit={{
            opacity: 0,
            scale: 1.1,
            filter: "blur(20px)",
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
          }}
        >
          {/* Background ambient */}
          <div className={styles.ambientBackground}>
            <div className={styles.ambientGlow} />
          </div>

          <div className={styles.contentContainer}>
            {/* Logo animation */}
            <motion.div
              className={styles.logoRow}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Icon */}
              <motion.div
                className={styles.logoIcon}
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(37,99,235,0.2)",
                    "0 0 40px rgba(37,99,235,0.4)",
                    "0 0 20px rgba(37,99,235,0.2)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </motion.div>

              <span className={styles.logoText}>
                <span className={styles.logoTextWhite}>Cine</span>
                <span className={styles.gradientText}>Vault</span>
              </span>
            </motion.div>

            {/* Progress bar */}
            <motion.div
              className={styles.progressBarContainer}
              initial={{ opacity: 0, scaleX: 0.8 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <motion.div
                className={styles.progressBarFill}
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </motion.div>

            {/* Loading text */}
            <motion.p
              className={styles.loadingText}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Loading experience
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
