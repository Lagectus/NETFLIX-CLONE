"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import styles from "./CinemaPlayer.module.css";
import { useTMDBSeason } from "@/hooks/useTMDBMovies";

/* ═══════════════════════════════════════════
   CineVault — Premium 2-Column Player
   Features a sidebar for TV Show seasons and
   episodes, plus multiple streaming servers.
   ═══════════════════════════════════════════ */

interface CinemaPlayerProps {
  id: string; // The prefixed ID from TMDB (e.g., 'movie-246' or 'tv-246')
  movie?: any;
  onBack?: () => void;
}

const SERVERS = [
  { id: "vidlink", name: "VidLink (Fast)", isFast: true },
  { id: "vidsrc", name: "VidSrc Net", isFast: false },
  { id: "vidsrccc", name: "VidSrc CC", isFast: false },
  { id: "vidsrcin", name: "VidSrc IN", isFast: false },
  { id: "embedsu", name: "Embed SU", isFast: false },
  { id: "autoembed", name: "Auto Embed", isFast: false },
  { id: "super", name: "Super Embed", isFast: false },
];

export function CinemaPlayer({
  id,
  movie,
  onBack,
}: CinemaPlayerProps) {
  const [embedUrl, setEmbedUrl] = useState("");
  const [selectedServer, setSelectedServer] = useState(SERVERS[0].id);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Parse ID
  let mediaType = "movie";
  let actualId = id;
  if (id && id.includes("-")) {
    const parts = id.split("-");
    mediaType = parts[0];
    actualId = parts.slice(1).join("-");
  }

  // Fetch episodes for the selected season if it's a TV show
  const { data: episodesData, isLoading: isLoadingEpisodes } = useTMDBSeason(
    mediaType === "tv" ? `tv-${actualId}` : "",
    selectedSeason
  );

  // Generate URL whenever dependencies change
  useEffect(() => {
    if (!id) return;

    let url = "";
    if (selectedServer === "vidlink") {
      url = `https://vidlink.pro/${mediaType}/${actualId}`;
      if (mediaType === "tv") url += `/${selectedSeason}/${selectedEpisode}`;
    } else if (selectedServer === "vidsrc") {
      url = `https://vidsrc.net/embed/${mediaType}?tmdb=${actualId}`;
      if (mediaType === "tv") url += `&season=${selectedSeason}&episode=${selectedEpisode}`;
    } else if (selectedServer === "vidsrccc") {
      url = `https://vidsrc.cc/v2/embed/${mediaType}/${actualId}`;
      if (mediaType === "tv") url += `/${selectedSeason}/${selectedEpisode}`;
    } else if (selectedServer === "vidsrcin") {
      url = `https://vidsrc.in/embed/${mediaType}/${actualId}`;
      if (mediaType === "tv") url += `/${selectedSeason}/${selectedEpisode}`;
    } else if (selectedServer === "embedsu") {
      url = `https://embed.su/embed/${mediaType}/${actualId}`;
      if (mediaType === "tv") url += `/${selectedSeason}/${selectedEpisode}`;
    } else if (selectedServer === "autoembed") {
      url = `https://player.autoembed.cc/embed/${mediaType}/${actualId}`;
      if (mediaType === "tv") url += `/${selectedSeason}/${selectedEpisode}`;
    } else if (selectedServer === "super") {
      url = `https://multiembed.mov/?video_id=${actualId}&tmdb=1`;
      if (mediaType === "tv") url += `&s=${selectedSeason}&e=${selectedEpisode}`;
    }

    setEmbedUrl(url);
  }, [id, mediaType, actualId, selectedServer, selectedSeason, selectedEpisode]);

  return (
    <div className={styles.layout}>
      {/* LEFT: Video Area */}
      <div className={styles.videoArea}>
        {/* Top Header */}
        <div className={styles.topHeader}>
          <button className={styles.backBtn} onClick={onBack}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back
          </button>
          
          <h2 className={styles.headerTitle}>
            {movie?.title || "Loading..."}
            {mediaType === "tv" && <span className={styles.seasonText}> [S{selectedSeason}-E{selectedEpisode}]</span>}
          </h2>

          <div className={styles.headerRight}>
            {/* Server Selector for Movies in Header */}
            {mediaType === "movie" && (
              <select 
                className={styles.headerDropdown}
                value={selectedServer}
                onChange={(e) => setSelectedServer(e.target.value)}
              >
                {SERVERS.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            )}

            {mediaType === "tv" && (
              <button className={styles.toggleSidebarBtn} onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <line x1="15" y1="3" x2="15" y2="21"/>
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Video Player */}
        <div className={styles.playerContainer}>
          {embedUrl && (
            <iframe
              src={embedUrl}
              className={styles.iframe}
              allowFullScreen
              allow="autoplay; encrypted-media"
            />
          )}
        </div>
      </div>

      {/* RIGHT: Sidebar (TV ONLY) */}
      {isSidebarOpen && mediaType === "tv" && (
        <div className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h3>Resources</h3>
            <span className={styles.providerTag}>By CineVault</span>
          </div>

          <div className={styles.selectors}>
            {/* Server Dropdown */}
            <select 
              className={styles.dropdown}
              value={selectedServer}
              onChange={(e) => setSelectedServer(e.target.value)}
            >
              {SERVERS.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>

            {/* Season Dropdown (TV Only) */}
            {mediaType === "tv" && movie?.seasons && (
              <select 
                className={styles.dropdown}
                value={selectedSeason}
                onChange={(e) => {
                  setSelectedSeason(parseInt(e.target.value));
                  setSelectedEpisode(1); // Reset to ep 1 on season change
                }}
              >
                {Array.from({ length: movie.seasons }, (_, i) => (
                  <option key={i + 1} value={i + 1}>Season {String(i + 1).padStart(2, '0')}</option>
                ))}
              </select>
            )}
          </div>

          {/* Episode Grid (TV Only) */}
          {mediaType === "tv" && (
            <div className={styles.episodesSection}>
              {isLoadingEpisodes ? (
                <div className={styles.episodesLoading}>Loading episodes...</div>
              ) : (
                <div className={styles.episodesGrid}>
                  {episodesData && episodesData.length > 0 ? (
                    episodesData.map((ep: any) => (
                      <button
                        key={ep.episode_number}
                        className={`${styles.episodeBtn} ${selectedEpisode === ep.episode_number ? styles.activeEpisode : ""}`}
                        onClick={() => setSelectedEpisode(ep.episode_number)}
                        title={ep.name}
                      >
                        {String(ep.episode_number).padStart(2, '0')}
                      </button>
                    ))
                  ) : (
                    <div className={styles.noEpisodes}>No episodes found.</div>
                  )}
                </div>
              )}
            </div>
          )}

        </div>
      )}
    </div>
  );
}
