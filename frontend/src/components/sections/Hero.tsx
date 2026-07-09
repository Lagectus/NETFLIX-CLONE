"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { cn, formatDuration } from "@/lib/utils";
import styles from "./Hero.module.css";
import { FEATURED_MOVIES } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { Badge, ScoreRing } from "@/components/ui/Primitives";
import { ThreeCanvas } from "@/providers/ThreeProvider";
import { HeroBackground } from "@/three/scenes/HeroBackground";
import { useUIStore } from "@/store/uiStore";
import { useWatchlistStore } from "@/store/watchlistStore";
import { useTMDBMovies } from "@/hooks/useTMDBMovies";

/* ═══════════════════════════════════════════
   CineVault — Cinematic Hero Section
   Award-winning fullscreen hero with 3D background,
   auto-rotating featured content, staggered typography,
   dynamic gradient lighting, and scroll indicator
   ═══════════════════════════════════════════ */

export function Hero() {
  const router = useRouter();
  const { data, isLoading } = useTMDBMovies("trending");
  const featuredMovies = data && data.length > 0 ? data.slice(0, 5) : FEATURED_MOVIES;

  const { heroIndex, nextHero } = useUIStore();
  const { toggleMovie, isBookmarked } = useWatchlistStore();
  
  const [isReady, setIsReady] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Ensure index bounds if featuredMovies length changes
  const currentIndex = heroIndex >= featuredMovies.length ? 0 : heroIndex;
  const movie = featuredMovies[currentIndex];

  // Auto-rotate featured content every 8 seconds
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      nextHero(featuredMovies.length);
    }, 8000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [nextHero, featuredMovies.length]);

  // Mark ready after mount for entrance animations
  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleDotClick = useCallback(
    (index: number) => {
      useUIStore.getState().setHeroIndex(index);
      // Reset interval
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        nextHero(featuredMovies.length);
      }, 8000);
    },
    [nextHero, featuredMovies.length]
  );

  if (!movie) return null;

  const accentColor = movie.accentColor || "#2563EB";
  const bookmarked = isBookmarked(movie.id);

  return (
    <section id="hero" className={styles.heroSection}>
      {/* ── Backdrop Image ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={movie.id}
          className={styles.backdrop}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 0.6, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          style={{ backgroundImage: `url(${movie.backdrop})` }}
        />
      </AnimatePresence>

      {/* ── Gradient overlays ── */}
      <div className={styles.gradientOverlays}>
        <div className={styles.gradientBottom} />
        <div className={styles.gradientLeft} />
        <div className={styles.gradientTop} />
      </div>

      {/* ── Main Content ── */}
      <div className={`section-container ${styles.mainContent}`}>
        <div className={styles.contentWrapper}>
          <AnimatePresence mode="wait">
            <motion.div
              key={movie.id}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={{
                hidden: {},
                visible: {
                  transition: { staggerChildren: 0.1, delayChildren: 0.1 },
                },
                exit: {
                  transition: { staggerChildren: 0.03, staggerDirection: -1 },
                },
              }}
            >
              {/* Badges */}
              <motion.div
                className={styles.badgesRow}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
                }}
              >
                <Badge variant="accent" style={{ backgroundColor: `${accentColor}20`, color: accentColor, borderColor: `${accentColor}40` }}>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  Trending Now
                </Badge>
                <Badge variant="default">{movie.year}</Badge>
                <Badge variant="default">{movie.rating}</Badge>
              </motion.div>

              {/* Title */}
              <motion.h1
                className={styles.title}
                variants={{
                  hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
                  visible: {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    transition: {
                      duration: 0.8,
                      ease: [0.16, 1, 0.3, 1],
                    },
                  },
                  exit: {
                    opacity: 0,
                    y: -20,
                    filter: "blur(5px)",
                    transition: { duration: 0.3 },
                  },
                }}
              >
                {movie.title}
              </motion.h1>

              {/* Tagline */}
              {movie.tagline && (
                <motion.p
                  className={styles.tagline}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
                    },
                    exit: { opacity: 0, transition: { duration: 0.2 } },
                  }}
                >
                  {movie.tagline}
                </motion.p>
              )}

              {/* Metadata row */}
              <motion.div
                className={styles.metadataRow}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5 },
                  },
                  exit: { opacity: 0, transition: { duration: 0.2 } },
                }}
              >
                <ScoreRing score={movie.score} size={40} />
                <span className={styles.metadataText}>
                  {formatDuration(movie.duration)}
                </span>
                <span className={styles.metadataDot}>•</span>
                {movie.genres.slice(0, 3).map((genre, i) => (
                  <React.Fragment key={`${genre}-${i}`}>
                    {i > 0 && <span className={styles.metadataDot}>•</span>}
                    <span className={styles.metadataText}>{genre}</span>
                  </React.Fragment>
                ))}
              </motion.div>

              {/* Description */}
              <motion.p
                className={styles.description}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5 },
                  },
                  exit: { opacity: 0, transition: { duration: 0.2 } },
                }}
              >
                {movie.description}
              </motion.p>

              {/* CTAs */}
              <motion.div
                className={styles.ctaRow}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5 },
                  },
                  exit: { opacity: 0, transition: { duration: 0.2 } },
                }}
              >
                <Button
                  variant="primary"
                  size="lg"
                  glow
                  onClick={() => router.push(`/watch/${movie.id}`)}
                  icon={
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  }
                >
                  Watch Now
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => router.push(`/title/${movie.id}`)}
                  icon={
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 16v-4M12 8h.01" />
                    </svg>
                  }
                >
                  More Info
                </Button>
                <motion.button
                  className={`${styles.watchlistBtn} ${bookmarked ? styles.watchlistBtnActive : ''}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title={bookmarked ? "Remove from Watchlist" : "Add to Watchlist"}
                  onClick={() => toggleMovie(movie as any)}
                  style={{
                    backgroundColor: bookmarked ? "rgba(255, 255, 255, 1)" : "rgba(255, 255, 255, 0.06)",
                    color: bookmarked ? "#0B0F19" : "rgba(255, 255, 255, 0.6)"
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill={bookmarked ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    {bookmarked ? (
                      <path d="M20 6L9 17l-5-5" /> // Checkmark for saved
                    ) : (
                      <path d="M12 5v14M5 12h14" /> // Plus for add
                    )}
                  </svg>
                </motion.button>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Carousel Indicators ── */}
        <div className={styles.carouselIndicators}>
          {featuredMovies.map((_, i) => (
            <motion.button
              key={i}
              className={cn(
                styles.dot,
                i === currentIndex ? styles.dotActive : styles.dotInactive
              )}
              style={i === currentIndex ? { backgroundColor: accentColor } : {}}
              onClick={() => handleDotClick(i)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>
      </div>

    </section>
  );
}

