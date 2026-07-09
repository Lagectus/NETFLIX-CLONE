"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { MOCK_MOVIES, GENRES } from "@/lib/constants";
import { GradientText, Badge } from "@/components/ui/Primitives";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import styles from "../dashboard.module.css";

/* ═══════════════════════════════════════════
   CineVault — Admin Movie Management
   Interactive high-fidelity CRUD dashboard
   ═══════════════════════════════════════════ */

export default function AdminMoviesPage() {
  const [movies, setMovies] = useState(MOCK_MOVIES);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string>("all");

  const filteredMovies = movies.filter((movie) => {
    const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === "all" || movie.genres.includes(selectedGenre as any);
    return matchesSearch && matchesGenre;
  });

  const handleDelete = (id: string) => {
    setMovies(movies.filter((m) => m.id !== id));
  };

  const toggleFeatured = (id: string) => {
    // Just toggle progress/featured state mock
    console.log("Toggle featured for", id);
  };

  return (
    <div className={styles.dashboardLayout}>
      {/* Sidebar (simplified/reused) */}
      <aside className={styles.sidebar}>
        <div className={styles.logoContainer}>
          <div className={styles.logoIcon}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
          <span className={styles.logoText}>
            Cine<GradientText>Vault</GradientText>
          </span>
          <span className={styles.adminBadge}>
            Admin
          </span>
        </div>
        {[
          { label: "Overview", icon: "📊", href: "/dashboard" },
          { label: "Movies", icon: "🎬", href: "/dashboard/movies", active: true },
          { label: "Upload", icon: "⬆️", href: "/dashboard/upload" },
        ].map((link) => (
          <a
            key={link.label}
            href={link.href}
            className={`${styles.navLink} ${link.active ? styles.navLinkActive : styles.navLinkInactive}`}
          >
            <span>{link.icon}</span>
            <span>{link.label}</span>
          </a>
        ))}
      </aside>

      {/* Main Panel */}
      <main className={styles.mainContent}>
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>
              Manage <GradientText>Movies</GradientText>
            </h1>
            <p className={styles.pageSubtitle}>
              Add, edit, delete, or manage catalog visibility.
            </p>
          </div>
          <Button variant="primary" size="md">
            + Add New Movie
          </Button>
        </div>

        {/* Filters Bar */}
        <GlassCard className={styles.filtersBar} tilt={false} glow={false}>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search catalog..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            <span className={styles.searchIcon}>🔍</span>
          </div>

          <div className={styles.genreFilterContainer}>
            <span className={styles.genreFilterLabel}>Genre:</span>
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className={styles.genreSelect}
            >
              <option value="all">All Genres</option>
              {GENRES.map((g) => (
                <option key={g.id} value={g.name}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>
        </GlassCard>

        {/* Movie Table Card */}
        <GlassCard tilt={false} glow={false} className={styles.tableCard}>
          <div className={styles.tableResponsive}>
            <table className={styles.movieTable}>
              <thead>
                <tr className={styles.tableHeadRow}>
                  <th className={styles.tableHeadCell}>Movie</th>
                  <th className={styles.tableHeadCell}>Year</th>
                  <th className={styles.tableHeadCell}>Rating</th>
                  <th className={styles.tableHeadCell}>Score</th>
                  <th className={styles.tableHeadCell}>Duration</th>
                  <th className={styles.tableHeadCell}>Status</th>
                  <th className={styles.tableHeadCellRight}>Actions</th>
                </tr>
              </thead>
              <tbody className={styles.tableBody}>
                <AnimatePresence>
                  {filteredMovies.map((movie) => (
                    <motion.tr
                      key={movie.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, x: -50 }}
                      className={styles.tableBodyRow}
                    >
                      <td className={styles.tableCell}>
                        <div className={styles.movieTitleCell}>
                          <div
                            className={styles.movieThumb}
                            style={{
                              backgroundImage: `linear-gradient(135deg, 
                                hsl(${(parseInt(movie.id.replace(/\D/g, "")) || 0) * 37 % 360}, 40%, 20%), 
                                hsl(${((parseInt(movie.id.replace(/\D/g, "")) || 0) * 37 + 60) % 360}, 50%, 15%))`,
                            }}
                          />
                          <div>
                            <p className={styles.movieTitleText}>{movie.title}</p>
                            <p className={styles.movieGenresText}>{movie.genres.join(", ")}</p>
                          </div>
                        </div>
                      </td>
                      <td className={`${styles.tableCell} ${styles.tableTextDim}`}>{movie.year}</td>
                      <td className={styles.tableCell}>
                        <span className={styles.tableRatingBadge}>
                          {movie.rating}
                        </span>
                      </td>
                      <td className={`${styles.tableCell} ${styles.tableScoreText}`}>⭐ {movie.score}</td>
                      <td className={`${styles.tableCell} ${styles.tableTextDimmer}`}>{movie.duration}m</td>
                      <td className={styles.tableCell}>
                        <Badge variant="success">Published</Badge>
                      </td>
                      <td className={styles.tableCellRight}>
                        <button
                          onClick={() => toggleFeatured(movie.id)}
                          className={`${styles.actionBtn} ${styles.featureBtn}`}
                        >
                          Feature
                        </button>
                        <button
                          onClick={() => handleDelete(movie.id)}
                          className={`${styles.actionBtn} ${styles.deleteBtn}`}
                        >
                          Delete
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>

            {filteredMovies.length === 0 && (
              <div className={styles.emptyTableState}>
                No matching movies found in the catalog.
              </div>
            )}
          </div>
        </GlassCard>
      </main>
    </div>
  );
}
