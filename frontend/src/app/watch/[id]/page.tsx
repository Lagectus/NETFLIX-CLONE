"use client";

import React from "react";
import { CinemaPlayer } from "@/components/player/CinemaPlayer";
import { useParams, useRouter } from "next/navigation";
import styles from "./watch.module.css";
import { useTMDBDetails } from "@/hooks/useTMDBMovies";

/* ═══════════════════════════════════════════
   CineVault — Watch Page
   Full cinema mode video player page
   ═══════════════════════════════════════════ */

export default function WatchPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  // Fetch movie details so we can display the correct title in the player overlay
  const { data: movie } = useTMDBDetails(id);

  return (
    <div className={styles.pageWrapper}>
      <CinemaPlayer
        id={id}
        movie={movie}
        onBack={() => router.back()}
      />
    </div>
  );
}
