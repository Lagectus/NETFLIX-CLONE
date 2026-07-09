"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useTMDBDetails } from "@/hooks/useTMDBMovies";
import { useWatchlistStore } from "@/store/watchlistStore";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/sections/Footer";
import { MovieCard } from "@/components/cards/MovieCard";
import styles from "./title.module.css";

/* ═══════════════════════════════════════════
   CineVault — Title Details Page
   Immersive Netflix-style details screen
   ═══════════════════════════════════════════ */

export default function TitlePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  
  const { data: movie, isLoading, error } = useTMDBDetails(id);
  const { toggleMovie, isBookmarked } = useWatchlistStore();
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");

  useEffect(() => {
    if (movie && movie.languages && movie.languages.length > 0 && !selectedLanguage) {
      setSelectedLanguage(movie.languages[0]);
    }
  }, [movie, selectedLanguage]);

  if (isLoading) {
    return (
      <div className={styles.loadingWrapper}>
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Loading...
        </motion.div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className={styles.loadingWrapper}>
        <div>Failed to load details.</div>
        <button onClick={() => router.back()} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>Go Back</button>
      </div>
    );
  }

  const bookmarked = isBookmarked(movie.id);

  return (
    <main className={styles.pageWrapper}>
      <Navbar />

      {/* ── Backdrop ── */}
      <div 
        className={styles.backdrop} 
        style={{ backgroundImage: `url(${movie.backdrop})` }}
      >
        <div className={styles.backdropGradient} />
      </div>

      {/* ── Content ── */}
      <div className={`section-container ${styles.contentWrapper}`}>
        <motion.div 
          className={styles.heroContent}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Title */}
          <h1 className={styles.title}>{movie.title}</h1>
          
          {/* Metadata */}
          <div className={styles.metadataRow}>
            <span className={styles.matchScore}>{(movie.score * 10).toFixed(0)}% Match</span>
            <span>{movie.year}</span>
            <span className={styles.rating}>{movie.rating || "TV-MA"}</span>
            {movie.duration && <span>{Math.floor(movie.duration / 60)}h {movie.duration % 60}m</span>}
            <span>HD</span>
          </div>

          {/* Synopsis */}
          <p className={styles.synopsis}>{movie.description}</p>

          {/* Language Selection Tabs */}
          {movie.languages && movie.languages.length > 0 && (
            <div className={styles.languageTabsContainer}>
              <div className={styles.languageTabs}>
                {movie.languages.map((lang) => (
                  <button
                    key={lang}
                    className={`${styles.languageTab} ${selectedLanguage === lang ? styles.languageTabActive : ""}`}
                    onClick={() => setSelectedLanguage(lang)}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className={styles.actionButtons}>
            <button 
              className={styles.playBtn}
              onClick={() => router.push(`/watch/${movie.id}`)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              Play
            </button>

            <button 
              className={styles.actionIcon}
              onClick={() => toggleMovie(movie)}
              title={bookmarked ? "Remove from Watchlist" : "Add to Watchlist"}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill={bookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                {bookmarked ? (
                  <path d="M20 6L9 17l-5-5" />
                ) : (
                  <path d="M12 5v14M5 12h14" />
                )}
              </svg>
            </button>

            <button className={styles.actionIcon} title="Like">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
              </svg>
            </button>
          </div>
        </motion.div>

        {/* ── Additional Details ── */}
        <motion.div 
          className={styles.detailsGrid}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {/* Cast & Episodes Column */}
          <div>
            {(movie.seasons || movie.episodes) && (
              <div style={{ marginBottom: '3rem' }}>
                <h3 className={styles.sectionTitle}>Show Information</h3>
                <div style={{ display: 'flex', gap: '2rem' }}>
                  {movie.seasons && (
                    <div>
                      <div className={styles.infoLabel}>Seasons</div>
                      <div className={styles.infoValue} style={{ fontSize: '1.5rem', fontWeight: 600 }}>{movie.seasons}</div>
                    </div>
                  )}
                  {movie.episodes && (
                    <div>
                      <div className={styles.infoLabel}>Episodes</div>
                      <div className={styles.infoValue} style={{ fontSize: '1.5rem', fontWeight: 600 }}>{movie.episodes}</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Cast */}
            {movie.cast && movie.cast.length > 0 && (
              <div>
                <h3 className={styles.sectionTitle}>Cast</h3>
              <div className={styles.castList}>
                {movie.cast.map(actor => (
                  <div key={actor.id} className={styles.castMember}>
                    <img src={actor.photo} alt={actor.name} className={styles.castPhoto} />
                    <div>
                      <div className={styles.castName}>{actor.name}</div>
                      <div className={styles.castCharacter}>{actor.character}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          </div>

          {/* Info Column */}
          <div className={styles.infoColumn}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Genres</span>
              <span className={styles.infoValue}>{movie.genres.join(", ")}</span>
            </div>
            {movie.tagline && (
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Tagline</span>
                <span className={styles.infoValue}>"{movie.tagline}"</span>
              </div>
            )}
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Maturity Rating</span>
              <span className={styles.infoValue}>
                {movie.rating || "TV-MA"} Recommended for mature audiences.
              </span>
            </div>
          </div>
        </motion.div>

        {/* ── Recommendations ── */}
        {movie.recommendations && movie.recommendations.length > 0 && (
          <motion.div
            className={styles.recommendationsSection}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <h3 className={styles.sectionTitle} style={{ marginTop: '4rem', marginBottom: '1.5rem' }}>More Like This</h3>
            <div className={styles.recommendationsCarousel}>
              {movie.recommendations.slice(0, 5).map(rec => (
                <MovieCard key={rec.id} {...rec} variant="default" />
              ))}
            </div>
          </motion.div>
        )}
      </div>
      
      <Footer />
    </main>
  );
}
