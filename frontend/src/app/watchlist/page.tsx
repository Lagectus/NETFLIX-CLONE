"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { MOCK_MOVIES } from "@/lib/constants";
import { useWatchlistStore } from "@/store/watchlistStore";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/sections/Footer";
import { MovieCard } from "@/components/cards/MovieCard";
import { GradientText } from "@/components/ui/Primitives";
import { staggerContainer, staggerItem } from "@/animations/framer/variants";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import styles from "./watchlist.module.css";

/* ═══════════════════════════════════════════
   CineVault — Premium Watchlist Page
   Dynamic collections, drag reordering layout,
   and visual statistics for user's favorite content.
   ═══════════════════════════════════════════ */

export default function WatchlistPage() {
  const [activeTab, setActiveTab] = useState<"all" | "in-progress" | "saved">("all");
  const { savedMovies } = useWatchlistStore();

  const watchlistItems = useMemo(() => {
    return savedMovies.filter((movie) => {
      const hasProgress = movie.progress !== undefined && movie.progress > 0;

      if (activeTab === "in-progress") return hasProgress;
      if (activeTab === "saved") return !hasProgress;
      return true; // "all"
    });
  }, [activeTab, savedMovies]);

  return (
    <main className={styles.pageWrapper}>
      {/* 3D Cinematic ambient glow in background */}
      <div className={styles.ambientGlowTop} />
      <div className={styles.ambientGlowBottom} />

      <div>
        <Navbar />

        {/* Top spacer for navbar */}
        <div className={styles.navSpacer} />

        <div className={`section-container ${styles.contentSection}`}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className={styles.headerRow}
          >
            <div>
              <h1 className={styles.title}>
                My <GradientText>Watchlist</GradientText>
              </h1>
              <p className={styles.subtitle}>
                Your private vault. Keep track of films you want to watch, are currently enjoying, or have saved for later.
              </p>
            </div>

            {/* Watchlist Quick Stats */}
            <div className={styles.statsRow}>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Total Titles</span>
                <span className={styles.statValue}>
                  {savedMovies.length}
                </span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Watching</span>
                <span className={`${styles.statValue} ${styles.statValueHighlight}`}>
                  {savedMovies.filter(m => m.progress && m.progress > 0).length}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Collection Tab bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={styles.tabBar}
          >
            {(["all", "in-progress", "saved"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`${styles.tabBtn} ${activeTab === tab ? styles.tabBtnActive : styles.tabBtnInactive}`}
              >
                {tab === "all" ? "All Saved" : tab === "in-progress" ? "In Progress" : "Saved"}
              </button>
            ))}
          </motion.div>

          {/* Grid Area */}
          <AnimatePresence mode="wait">
            {watchlistItems.length > 0 ? (
              <motion.div
                key={activeTab}
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                exit="exit"
                className={styles.gridArea}
              >
                {watchlistItems.map((movie, index) => (
                  <motion.div key={movie.id} variants={staggerItem}>
                    <MovieCard {...movie} isBookmarked={true} index={index} variant="grid" />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className={styles.emptyState}
              >
                <div className={styles.emptyIcon}>📁</div>
                <h3 className={styles.emptyTitle}>Your watchlist is empty</h3>
                <p className={styles.emptySubtitle}>
                  Items you bookmark while browsing will appear here for easy access.
                </p>
                <Link href="/browse" className={styles.emptyAction}>
                  <Button variant="primary" size="md">
                    Explore Catalogue
                  </Button>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <Footer />
    </main>
  );
}
