"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUIStore } from "@/store/uiStore";
import { GENRES } from "@/lib/constants";
import { useTMDBMovies } from "@/hooks/useTMDBMovies";
import { useRouter } from "next/navigation";
import styles from "./SearchOverlay.module.css";

/* ═══════════════════════════════════════════
   CineVault — Premium Search Overlay
   Fullscreen animated search with instant results,
   recent searches, trending, genre filtering
   ═══════════════════════════════════════════ */

export function SearchOverlay() {
  const { isSearchOpen, closeSearch } = useUIStore();
  const [query, setQuery] = useState("");
  const [recentSearches] = useState([
    "Quantum Horizon",
    "Action movies",
    "Sci-Fi 2025",
    "Best thrillers",
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Debounce query
  const [debouncedQuery, setDebouncedQuery] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  // Fetch TMDB results
  const { data: tmdbResults, isLoading } = useTMDBMovies("search", { query: debouncedQuery, type: "all" });
  const results = debouncedQuery.length > 0 ? (tmdbResults || []) : [];

  // Focus input when opened
  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
    if (!isSearchOpen) {
      setQuery("");
      setDebouncedQuery("");
    }
  }, [isSearchOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSearch();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeSearch]);

  const handleResultClick = (id: string) => {
    closeSearch();
    router.push(`/title/${id}`);
  };

  const trendingSearches = ["Sci-Fi", "Action", "New releases", "Top rated", "Thriller"];

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <motion.div
          className={styles.overlayWrapper}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <motion.div
            className={styles.backdrop}
            onClick={closeSearch}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Search Content */}
          <div className={styles.contentContainer}>
            {/* Search Bar */}
            <motion.div
              className={`section-container ${styles.searchHeader}`}
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className={styles.searchInputWrapper}>
                {/* Search icon */}
                <svg
                  className={styles.searchIcon}
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>

                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search movies, series, genres..."
                  className={styles.searchInput}
                />

                {/* Close button */}
                <motion.button
                  className={styles.closeBtn}
                  onClick={closeSearch}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </motion.button>

                {/* Keyboard shortcut hint */}
                <div className={styles.shortcutHint}>
                  <kbd className={styles.shortcutKey}>
                    ESC
                  </kbd>
                </div>
              </div>
            </motion.div>

            {/* Results Area */}
            <div className={styles.resultsArea}>
              <div className={`section-container ${styles.resultsContainer}`}>
                {query.length === 0 ? (
                  /* ── Empty State: Recent & Trending ── */
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    {/* Recent Searches */}
                    <div className="mb-10">
                      <h3 className={styles.sectionTitle}>
                        Recent Searches
                      </h3>
                      <div className={styles.recentGrid}>
                        {recentSearches.map((search) => (
                          <motion.button
                            key={search}
                            className={styles.recentBtn}
                            onClick={() => setQuery(search)}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                          >
                            {search}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Trending */}
                    <div className="mb-10">
                      <h3 className={styles.sectionTitle}>
                        Trending Searches
                      </h3>
                      <div className={styles.trendingList}>
                        {trendingSearches.map((search, i) => (
                          <motion.button
                            key={search}
                            className={styles.trendingBtn}
                            onClick={() => setQuery(search)}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + i * 0.05 }}
                          >
                            <span className={styles.trendingRank}>
                              {i + 1}
                            </span>
                            <span className={styles.trendingText}>
                              {search}
                            </span>
                            <svg
                              className={styles.trendingIcon}
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <line x1="7" y1="17" x2="17" y2="7" />
                              <polyline points="7 7 17 7 17 17" />
                            </svg>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Browse Genres */}
                    <div>
                      <h3 className={styles.sectionTitle}>
                        Browse Genres
                      </h3>
                      <div className={styles.genresGrid}>
                        {GENRES.slice(0, 8).map((genre) => (
                          <motion.button
                            key={genre.id}
                            className={styles.genreBtn}
                            onClick={() => setQuery(genre.name)}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                          >
                            <span>{genre.icon}</span>
                            <span className={styles.genreText}>
                              {genre.name}
                            </span>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ) : results.length > 0 ? (
                  /* ── Search Results ── */
                  <motion.div
                    className={styles.resultsList}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className={styles.resultsCount}>
                      {results.length} result{results.length !== 1 ? "s" : ""} found
                    </p>
                    {isLoading ? (
                      <div className={styles.loadingState}>Searching...</div>
                    ) : (
                      results.map((movie, i) => (
                        <motion.div
                          key={`${movie.id}-${i}`}
                          className={styles.resultItem}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.03 }}
                          onClick={() => handleResultClick(movie.id)}
                          style={{ cursor: "pointer" }}
                        >
                          {/* Poster */}
                          <div
                            className={styles.resultPoster}
                            style={{
                              backgroundImage: movie.poster 
                                ? `url(${movie.poster})`
                                : `linear-gradient(135deg, 
                                hsl(${(parseInt(movie.id.replace(/\D/g, "")) || 0) * 37 % 360}, 40%, 20%), 
                                hsl(${((parseInt(movie.id.replace(/\D/g, "")) || 0) * 37 + 60) % 360}, 50%, 15%))`,
                            }}
                          />
  
                          <div className={styles.resultInfo}>
                            <h4 className={styles.resultTitle}>
                              {movie.title}
                            </h4>
                            <div className={styles.resultMeta}>
                              <span>{movie.year || "Unknown"}</span>
                              <span>•</span>
                              {movie.genres && movie.genres[0] && (
                                <>
                                  <span>{movie.genres[0]}</span>
                                  <span>•</span>
                                </>
                              )}
                              <span>⭐ {movie.score ? movie.score.toFixed(1) : "N/A"}</span>
                            </div>
                          </div>

                        <svg
                          className={styles.resultIcon}
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </motion.div>
                    ))
                    )}
                  </motion.div>
                ) : (
                  /* ── No Results ── */
                  <motion.div
                    className={styles.emptyState}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className={styles.emptyIconWrapper}>
                      <svg
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="1.5"
                        className={styles.emptyIcon}
                      >
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.3-4.3" />
                      </svg>
                    </div>
                    <p className={styles.emptyTextMain}>
                      No results found for &quot;{query}&quot;
                    </p>
                    <p className={styles.emptyTextSub}>
                      Try searching for something else
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
