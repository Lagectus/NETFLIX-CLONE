"use client";

import React, { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import styles from "./MovieCard.module.css";
import { ScoreRing } from "@/components/ui/Primitives";
import { useWatchlistStore } from "@/store/watchlistStore";
import { Movie } from "@/types";

/* ═══════════════════════════════════════════
   CineVault — Premium Movie Card
   3D tilt, glow, scale, reflection, animated borders,
   progress indicator, metadata animation, bookmark
   ═══════════════════════════════════════════ */

interface MovieCardProps {
  id: string;
  title: string;
  poster: string;
  year: number;
  rating: string;
  score: number;
  duration: number;
  genres: string[];
  progress?: number;
  isBookmarked?: boolean;
  variant?: "default" | "wide" | "large" | "grid";
  className?: string;
  index?: number;
  onClick?: () => void;
}

export function MovieCard({
  id,
  title,
  poster,
  year,
  rating,
  score,
  duration,
  genres,
  progress,
  isBookmarked = false,
  variant = "default",
  className,
  index = 0,
  onClick,
  ...rest
}: MovieCardProps & any) {
  const router = useRouter();
  const { toggleMovie, isBookmarked: checkBookmarked } = useWatchlistStore();
  
  const fullMovie = { id, title, poster, year, rating, score, duration, genres, progress, ...rest } as Movie;
  
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  // Sync with global store instead of local state
  const bookmarked = checkBookmarked(id) || isBookmarked;

  const handleClick = useCallback(() => {
    if (onClick) {
      onClick();
    } else {
      router.push(`/title/${id}`);
    }
  }, [onClick, router, id]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      setTilt({
        x: (y - 0.5) * -12,
        y: (x - 0.5) * 12,
      });
      setGlowPos({ x: x * 100, y: y * 100 });
    },
    []
  );

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
    setGlowPos({ x: 50, y: 50 });
    setIsHovered(false);
  }, []);

  const sizeClasses = {
    default: styles.sizeDefault,
    wide: styles.sizeWide,
    large: styles.sizeLarge,
    grid: styles.sizeGrid,
  };

  const aspectClasses = {
    default: styles.aspectDefault,
    wide: styles.aspectWide,
    large: styles.aspectLarge,
    grid: styles.aspectDefault, // grid uses default portrait aspect ratio
  };

  return (
    <motion.div
      ref={cardRef}
      className={`${styles.cardWrapper} ${sizeClasses[variant]} ${className || ''}`}
      style={{ perspective: "1000px" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.05,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <motion.div
        className={styles.cardInner}
        animate={{
          rotateX: tilt.x,
          rotateY: tilt.y,
          scale: isHovered ? 1.05 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* ── Poster Image ── */}
        <div className={`${styles.imageWrapper} ${aspectClasses[variant]}`}>
          {/* Placeholder gradient */}
          <div className={styles.placeholder} />

          {/* Poster Image */}
          <div
            className={styles.posterImage}
            style={{
              backgroundImage: poster
                ? `url(${poster})`
                : `linear-gradient(135deg, 
                hsl(${(parseInt(id.replace(/\D/g, "")) || 0) * 37 % 360}, 40%, 20%), 
                hsl(${((parseInt(id.replace(/\D/g, "")) || 0) * 37 + 60) % 360}, 50%, 15%))`,
            }}
          />


          {/* Hover glow overlay */}
          {isHovered && (
            <div
              className={styles.hoverGlow}
              style={{
                background: `radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, rgba(37,99,235,0.3), transparent 60%)`,
              }}
            />
          )}

          {/* Bottom gradient */}
          <div className={styles.bottomGradient} />

          {/* ── Animated Border Glow ── */}
          <div
            className={`${styles.borderGlow} ${isHovered ? styles.borderGlowHovered : ''}`}
          />

          {/* ── Score ── */}
          <div className={styles.scoreWrapper}>
            <ScoreRing score={score} size={36} strokeWidth={2.5} />
          </div>

          {/* ── Bookmark Button ── */}
          <motion.button
            className={`${styles.bookmarkBtn} ${bookmarked ? styles.bookmarkBtnActive : styles.bookmarkBtnInactive}`}
            onClick={(e) => {
              e.stopPropagation();
              toggleMovie(fullMovie);
            }}
            whileTap={{ scale: 0.8 }}
            animate={bookmarked ? { scale: [1, 1.3, 1] } : {}}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill={bookmarked ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </motion.button>

          {/* ── Progress Bar ── */}
          {progress !== undefined && progress > 0 && (
            <div className={styles.progressContainer}>
              <motion.div
                className={styles.progressFill}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
              />
            </div>
          )}
        </div>

        {/* ── Metadata ── */}
        <motion.div
          className={styles.metadataContainer}
          animate={{
            y: isHovered ? 0 : 4,
            opacity: isHovered ? 1 : 0.8,
          }}
          transition={{ duration: 0.3 }}
        >
          <h3 className={styles.metadataTitle}>
            {title}
          </h3>
          <div className={styles.metadataInfoRow}>
            <span>{year}</span>
            <span>•</span>
            <span className={styles.ratingBadge}>
              {rating}
            </span>
            {genres[0] && (
              <>
                <span>•</span>
                <span className={styles.genreTruncate}>{genres[0]}</span>
              </>
            )}
          </div>
        </motion.div>

        {/* ── Hover Play Button ── */}
        <AnimatedPlayButton isVisible={isHovered} />

        {/* ── Bottom reflection ── */}
        <div className={styles.bottomReflection} />
      </motion.div>
    </motion.div>
  );
}

/* ── Play button that appears on hover ── */
function AnimatedPlayButton({ isVisible }: { isVisible: boolean }) {
  return (
    <motion.div
      className={styles.playBtnContainer}
      initial={false}
      animate={{
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? 1 : 0.5,
      }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <div className={styles.playBtnCircle}>
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="white"
          className={styles.playIcon}
        >
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
      </div>
    </motion.div>
  );
}
