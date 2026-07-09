"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { MOCK_MOVIES, GENRES } from "@/lib/constants";
import styles from "./ContentSections.module.css";
import { MovieCard } from "@/components/cards/MovieCard";
import { GradientText } from "@/components/ui/Primitives";
import { staggerContainer, staggerItem } from "@/animations/framer/variants";
import { useTMDBMovies } from "@/hooks/useTMDBMovies";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════
   CineVault — Content Sections
   Each section has unique animation & design,
   integrated dynamically with real TMDB data.
   ═══════════════════════════════════════════ */

/* ── Section Header ── */
function SectionHeader({
  title,
  subtitle,
  accent,
  action,
}: {
  title: string;
  subtitle?: string;
  accent?: boolean;
  action?: React.ReactNode;
}) {
  return (
    <motion.div
      className={styles.headerContainer}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div>
        {subtitle && (
          <span className={styles.subtitle}>
            {subtitle}
          </span>
        )}
        <h2 className={styles.title}>
          {accent ? (
            <GradientText as="span">{title}</GradientText>
          ) : (
            title
          )}
        </h2>
      </div>
      {action && (
        <motion.div
          whileHover={{ x: 5 }}
          className={styles.actionBtn}
        >
          View All
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </motion.div>
      )}
    </motion.div>
  );
}

/* ── Horizontal Carousel ── */
function HorizontalCarousel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className={styles.carouselWrapper}>
      <div
        ref={scrollRef}
        className={cn(styles.carouselScroll, className)}
      >
        {children}
      </div>

      {/* Scroll fade edges */}
      <div className={styles.carouselFadeLeft} />
      <div className={styles.carouselFadeRight} />
    </div>
  );
}

/* ═══════════════════════════════════════════
   1. TRENDING NOW
   ═══════════════════════════════════════════ */
export function TrendingSection() {
  const { data, isLoading } = useTMDBMovies("trending", { type: "all" });
  const movies = data && data.length > 0 ? data.slice(0, 10) : MOCK_MOVIES.slice(0, 10);

  return (
    <section className={styles.section}>
      <div className="section-container">
        <SectionHeader
          title="Trending Now"
          subtitle="What's hot"
          action={<span>View All</span>}
        />

        <HorizontalCarousel>
          {movies.map((movie, i) => (
            <div key={movie.id} className={styles.trendingItem}>
              {/* Giant rank number */}
              <span
                className={styles.trendingRank}
                style={{
                  WebkitTextStroke: "2px rgba(255,255,255,0.08)",
                }}
              >
                {i + 1}
              </span>
              <div className={styles.trendingCardWrapper}>
                <MovieCard {...movie} index={i} variant="default" />
              </div>
            </div>
          ))}
        </HorizontalCarousel>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   2. POPULAR
   ═══════════════════════════════════════════ */
export function PopularSection() {
  const { data } = useTMDBMovies("popular");
  const movies = data && data.length > 0 ? data.slice(0, 8) : MOCK_MOVIES.slice(3, 11);

  return (
    <section className={styles.section}>
      {/* Background glow */}
      <div className={styles.popularGlow} />

      <div className="section-container">
        <SectionHeader title="Popular" subtitle="Most watched" accent action={<span>View All</span>} />

        <HorizontalCarousel>
          {movies.map((movie, i) => (
            <MovieCard key={movie.id} {...movie} index={i} variant="large" />
          ))}
        </HorizontalCarousel>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   3. TOP RATED
   ═══════════════════════════════════════════ */
export function TopRatedSection() {
  const { data } = useTMDBMovies("top_rated");
  const movies = data && data.length > 0 ? data.slice(0, 8) : MOCK_MOVIES.slice(0, 8);

  return (
    <section className={styles.section}>
      <div className="section-container">
        <SectionHeader title="Top Rated" subtitle="Critics' choice" />

        <HorizontalCarousel>
          {movies.map((movie, i) => (
            <div key={movie.id} className={styles.topRatedItem}>
              <MovieCard {...movie} index={i} variant="default" />
              {/* Gold rank badge */}
              <div className={styles.topRatedBadgeRow}>
                <span className={styles.topRatedRankText}>#{i + 1}</span>
                <div className={styles.topRatedLine} />
              </div>
            </div>
          ))}
        </HorizontalCarousel>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   4. CONTINUE WATCHING
   ═══════════════════════════════════════════ */
export function ContinueWatchingSection() {
  const { data } = useTMDBMovies("trending");
  const movies = (data && data.length > 0 ? data.slice(4, 9) : MOCK_MOVIES.slice(0, 5)).map((m, i) => ({
    ...m,
    progress: 10 + (i * 15) % 80,
  }));

  return (
    <section className={styles.section}>
      <div className="section-container">
        <SectionHeader title="Continue Watching" subtitle="Pick up where you left off" />

        <HorizontalCarousel>
          {movies.map((movie, i) => (
            <MovieCard key={movie.id} {...movie} index={i} variant="wide" />
          ))}
        </HorizontalCarousel>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   5. GENRES
   ═══════════════════════════════════════════ */
export function GenresSection() {
  return (
    <section className={styles.sectionOverflowHidden}>
      <div className="section-container">
        <SectionHeader title="Browse by Genre" subtitle="Explore" accent />

        <motion.div
          className={styles.genresGrid}
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-50px" }}
        >
          {GENRES.slice(0, 12).map((genre) => (
            <motion.div
              key={genre.id}
              className={styles.genreCard}
              variants={staggerItem}
              whileHover={{ scale: 1.03, y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <div
                className={styles.genreCardInner}
                style={{
                  background: `linear-gradient(135deg, ${genre.color}22, ${genre.color}08)`,
                }}
              >
                {/* Hover glow */}
                <div
                  className={styles.genreGlow}
                  style={{
                    background: `radial-gradient(circle at center, ${genre.color}20, transparent 70%)`,
                  }}
                />

                <span className={styles.genreIcon}>{genre.icon}</span>
                <span className={styles.genreName}>
                  {genre.name}
                </span>
              </div>

              {/* Border */}
              <div className={styles.genreBorder} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   6. ORIGINALS — Cinematic wide cards
   ═══════════════════════════════════════════ */
export function OriginalsSection() {
  const { data } = useTMDBMovies("popular");
  const movies = data && data.length > 0 ? data.slice(5, 11) : MOCK_MOVIES.slice(5, 11);

  return (
    <section className={styles.section}>
      {/* Accent glow */}
      <div className={styles.originalsGlow} />

      <div className="section-container">
        <SectionHeader title="CineVault Originals" subtitle="Only here" accent />

        <HorizontalCarousel>
          {movies.map((movie, i) => (
            <MovieCard key={movie.id} {...movie} index={i} variant="wide" />
          ))}
        </HorizontalCarousel>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   6.5. K-DRAMAS
   ═══════════════════════════════════════════ */
export function KDramaSection() {
  const { data } = useTMDBMovies("discover", { type: "series", originalLanguage: "ko" });
  const movies = data && data.length > 0 ? data.slice(0, 10) : MOCK_MOVIES.slice(0, 10);

  return (
    <section className={styles.section}>
      <div className="section-container">
        <SectionHeader title="K-Dramas" subtitle="Hallyu wave" action={<span>View All</span>} />

        <HorizontalCarousel>
          {movies.map((movie, i) => (
            <MovieCard key={movie.id} {...movie} index={i} variant="default" />
          ))}
        </HorizontalCarousel>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   7. NEW RELEASES — Spotlight with glow
   ═══════════════════════════════════════════ */
export function NewReleasesSection() {
  const { data } = useTMDBMovies("now_playing");
  const movies = data && data.length > 0 ? data.slice(0, 8) : MOCK_MOVIES.slice(10, 18);

  return (
    <section className={styles.section}>
      <div className="section-container">
        <SectionHeader title="New Releases" subtitle="Fresh drops" action={<span>View All</span>} />

        <HorizontalCarousel>
          {movies.map((movie, i) => (
            <div key={movie.id} className={styles.snapItemRelative}>
              <MovieCard {...movie} index={i} variant="default" />
              {/* "New" badge */}
              <motion.div
                className={styles.newBadge}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", delay: i * 0.05 + 0.3 }}
              >
                NEW
              </motion.div>
            </div>
          ))}
        </HorizontalCarousel>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   8. COMING SOON
   ═══════════════════════════════════════════ */
export function ComingSoonSection() {
  const { data } = useTMDBMovies("upcoming");
  const movies = data && data.length > 0 ? data.slice(0, 8) : MOCK_MOVIES.slice(14, 20);
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 14);

  return (
    <section className={styles.section}>
      <div className="section-container">
        <SectionHeader title="Coming Soon" subtitle="Get ready" />

        <HorizontalCarousel>
          {movies.map((movie, i) => (
            <div key={movie.id} className={styles.snapItemRelative}>
              <div className="relative">
                <MovieCard {...movie} index={i} variant="default" />
                {/* Coming soon overlay */}
                <div className={styles.comingSoonOverlay}>
                  <motion.div
                    className={styles.comingSoonText}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 + 0.2 }}
                  >
                    <span className={styles.comingSoonLabel}>
                      Coming
                    </span>
                    <p className={styles.comingSoonDate}>
                      {futureDate.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </motion.div>
                </div>
              </div>
            </div>
          ))}
        </HorizontalCarousel>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   9. INFINITE MARQUEE — Recently Added
   ═══════════════════════════════════════════ */
export function RecentlyAddedMarquee() {
  const { data } = useTMDBMovies("trending", { type: "all" });
  const movies = data && data.length > 0 ? data : MOCK_MOVIES;

  return (
    <section className={styles.sectionOverflowHidden}>
      <div className={`section-container ${styles.marqueeContainer}`}>
        <SectionHeader title="Recently Added" subtitle="Don't miss out" />
      </div>

      <div className="relative">
        <div className={styles.marqueeRow}>
          {[...movies, ...movies].map((movie, i) => (
            <MovieCard
              key={`${movie.id}-${i}`}
              {...movie}
              variant="default"
              className={styles.snapItem}
            />
          ))}
        </div>

        {/* Edge fades */}
        <div className={styles.marqueeFadeLeft} />
        <div className={styles.marqueeFadeRight} />
      </div>
    </section>
  );
}
