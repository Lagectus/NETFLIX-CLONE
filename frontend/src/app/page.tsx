"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/sections/Hero";
import {
  TrendingSection,
  PopularSection,
  TopRatedSection,
  ContinueWatchingSection,
  GenresSection,
  OriginalsSection,
  NewReleasesSection,
  ComingSoonSection,
  RecentlyAddedMarquee,
  KDramaSection,
} from "@/components/sections/ContentSections";
import { Footer } from "@/components/sections/Footer";

import styles from "./page.module.css";

/* ═══════════════════════════════════════════
   CineVault — Landing Page
   Cinematic homepage with all sections
   ═══════════════════════════════════════════ */

export default function HomePage() {
  return (
    <main className={styles.mainWrapper}>
      {/* Navigation */}
      <Navbar />

      {/* Hero */}
      <Hero />

      {/* Content Sections — each with unique design & animation */}
      <div className={styles.contentWrapper}>
        <TrendingSection />
        <ContinueWatchingSection />
        <PopularSection />
        <GenresSection />
        <OriginalsSection />
        <TopRatedSection />
        <KDramaSection />
        <RecentlyAddedMarquee />
        <NewReleasesSection />
        <ComingSoonSection />
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}
