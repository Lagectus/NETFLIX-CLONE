"use client";

import React, { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { MOCK_MOVIES, GENRES } from "@/lib/constants";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/sections/Footer";
import { MovieCard } from "@/components/cards/MovieCard";
import { GradientText } from "@/components/ui/Primitives";
import { staggerContainer, staggerItem } from "@/animations/framer/variants";
import { useTMDBInfiniteMovies } from "@/hooks/useTMDBMovies";
import styles from "./browse.module.css";

/* ═══════════════════════════════════════════
   CineVault — Premium Browse Page
   Dynamic filtering, genre tabs, sort options,
   integrated dynamically with real TMDB data.
   ═══════════════════════════════════════════ */

const genreNameToId: Record<string, number> = {
  "Action": 28,
  "Adventure": 12,
  "Animation": 16,
  "Comedy": 35,
  "Crime": 80,
  "Documentary": 99,
  "Drama": 18,
  "Family": 10751,
  "Fantasy": 14,
  "History": 36,
  "Horror": 27,
  "Music": 10402,
  "Mystery": 9648,
  "Romance": 10749,
  "Sci-Fi": 878,
  "Thriller": 53,
  "War": 10752,
  "Western": 37
};

const tvGenreNameToId: Record<string, number> = {
  "Action": 10759, // Action & Adventure
  "Adventure": 10759,
  "Animation": 16,
  "Comedy": 35,
  "Crime": 80,
  "Documentary": 99,
  "Drama": 18,
  "Family": 10751,
  "Fantasy": 10765, // Sci-Fi & Fantasy
  "Sci-Fi": 10765,
  "Mystery": 9648,
  "War": 10768, // War & Politics
  "Western": 37
};

export default function BrowsePage() {
  const searchParams = useSearchParams();
  const initialType = searchParams.get("type") || "all";
  const initialSort = searchParams.get("sort") || "popular";

  const [activeType, setActiveType] = useState<string>(initialType);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>(initialSort);

  // Determine TMDB parameters
  const { endpoint, genreParam } = useMemo(() => {
    let ep = "popular";
    let gp = "";

    if (selectedGenre) {
      ep = "discover";
      gp = activeType === "series" 
        ? String(tvGenreNameToId[selectedGenre] || 18) 
        : String(genreNameToId[selectedGenre] || "");
    } else if (sortBy === "newest") {
      ep = "upcoming";
    } else if (sortBy === "rating") {
      ep = "top_rated";
    }

    return { endpoint: ep, genreParam: gp };
  }, [selectedGenre, sortBy, activeType]);

  // Query real TMDB data with infinite scroll / pagination
  const yearParam = searchParams.get("year") || undefined;
  
  const { 
    data, 
    isLoading, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage 
  } = useTMDBInfiniteMovies(endpoint, { genre: genreParam, type: activeType, year: yearParam });

  // Filter local & remote data uniformly
  const displayedMovies = useMemo(() => {
    const flatData = data ? data.pages.flatMap((page) => page.data) : null;
    const sourceList = flatData && flatData.length > 0 ? flatData : MOCK_MOVIES;

    return sourceList.filter((movie) => {
      // Basic type partitioning for fallback MOCK_MOVIES
      if (!data) {
        const isSeries = movie.id.includes("movie-2") || movie.id.includes("movie-4") || movie.id.includes("movie-6") || movie.id.includes("movie-8") || movie.id.includes("movie-10") || movie.id.includes("movie-12") || movie.id.includes("movie-14") || movie.id.includes("movie-16") || movie.id.includes("movie-18") || movie.id.includes("movie-20");
        if (activeType === "movie" && isSeries) return false;
        if (activeType === "series" && !isSeries) return false;
      }
      return true;
    });
  }, [data, activeType]);

  return (
    <main className={styles.pageWrapper}>
      {/* 3D Cinematic ambient glow in background */}
      <div className={styles.ambientGlowTop} />
      <div className={styles.ambientGlowMiddle} />

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
            <h1 className={styles.title}>
              Explore <GradientText>CineVault</GradientText>
            </h1>
            <p className={styles.subtitle}>
              Browse through our ultimate catalogue of cinematic blockbusters, critically acclaimed series, and award-winning originals.
            </p>
          </motion.div>

          {/* Filters Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className={styles.filtersBar}
          >
            {/* Row 1: Type Tabs & Sorting */}
            <div className={styles.rowOne}>
              {/* Type selector */}
              <div className={styles.typeSelector}>
                {["all", "movie", "series"].map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setActiveType(type);
                      setSelectedGenre(null); // Reset genre filter when switching type
                    }}
                    className={`${styles.typeBtn} ${activeType === type ? styles.typeBtnActive : styles.typeBtnInactive}`}
                  >
                    {type === "all" ? "All Content" : type === "movie" ? "Movies" : "TV Series"}
                  </button>
                ))}
              </div>

              {/* Sorting selector */}
              <div className={styles.sortSelector}>
                <span className={styles.sortLabel}>Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={styles.sortSelect}
                >
                  <option value="popular">Most Popular</option>
                  <option value="newest">New Releases</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>

            {/* Row 2: Genre Pills */}
            <div className={styles.rowTwo}>
              <span className={styles.genreLabel}>Genres:</span>
              <div className={styles.genreList}>
                <button
                  onClick={() => setSelectedGenre(null)}
                  className={`${styles.genreBtn} ${selectedGenre === null ? styles.genreBtnAllActive : styles.genreBtnInactive}`}
                >
                  All Genres
                </button>
                {GENRES.map((genre) => (
                  <button
                    key={genre.id}
                    onClick={() => setSelectedGenre(genre.name)}
                    className={`${styles.genreBtn} ${selectedGenre === genre.name ? styles.genreBtnActive : styles.genreBtnInactive}`}
                  >
                    <span>{genre.icon}</span>
                    <span>{genre.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Grid Area */}
          <AnimatePresence mode="wait">
            {displayedMovies.length > 0 ? (
              <motion.div
                key={`${activeType}-${selectedGenre}-${sortBy}-${displayedMovies.length}`}
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                exit="exit"
                className={styles.gridArea}
              >
                {displayedMovies.map((movie, index) => (
                  <motion.div key={movie.id} variants={staggerItem}>
                    <MovieCard {...movie} index={index} variant="grid" />
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
                <div className={styles.emptyIcon}>🎬</div>
                <h3 className={styles.emptyTitle}>No titles found</h3>
                <p className={styles.emptySubtitle}>
                  Try adjusting your filters or search options to find what you&apos;re looking for.
                </p>
                <button
                  onClick={() => {
                    setSelectedGenre(null);
                    setActiveType("all");
                  }}
                  className={styles.resetBtn}
                >
                  Reset Filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Load More Button */}
          {hasNextPage && displayedMovies.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
              <button 
                onClick={() => fetchNextPage()} 
                disabled={isFetchingNextPage}
                className={styles.resetBtn} // Reusing resetBtn styles for the load more button
              >
                {isFetchingNextPage ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
