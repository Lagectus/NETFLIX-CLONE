"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { GENRES } from "@/lib/constants";
import { GradientText } from "@/components/ui/Primitives";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import dashboardStyles from "../dashboard.module.css";
import uploadStyles from "./upload.module.css";

/* ═══════════════════════════════════════════
   CineVault — Admin Upload Center
   High-fidelity video pipeline upload interface
   ═══════════════════════════════════════════ */

export default function AdminUploadPage() {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());

  // Upload steps status: null, "uploading", "processing", "transcoding", "complete"
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const startPipeline = () => {
    if (!selectedFile) return;

    setUploadStatus("uploading");
    setUploadProgress(0);
    setLogs(["[10:45:10] Initializing upload stream to Cloudflare R2...", "[10:45:12] Multi-part upload chunk 1 size: 100MB initialized."]);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          startProcessing();
          return 100;
        }
        return prev + 10;
      });
    }, 400);
  };

  const startProcessing = () => {
    setUploadStatus("processing");
    setLogs((prev) => [...prev, "[10:45:18] Upload successfully saved to R2 storage.", "[10:45:19] Triggering FFmpeg worker pipeline for HLS segmentation."]);

    setTimeout(() => {
      setUploadStatus("transcoding");
      setLogs((prev) => [
        ...prev,
        "[10:45:21] FFmpeg parsing video stream codec: h264 (Main) / audio: aac.",
        "[10:45:22] Creating Master Playlist: master.m3u8",
        "[10:45:23] Segmenting 1080p resolution stream (5.0s chunks).",
        "[10:45:25] Segmenting 720p resolution stream (5.0s chunks).",
        "[10:45:26] Generating video thumbnail sheet."
      ]);

      setTimeout(() => {
        setUploadStatus("complete");
        setLogs((prev) => [...prev, "[10:45:30] Transcoding pipeline complete.", "[10:45:31] Movie successfully listed in drafting state."]);
      }, 3000);
    }, 2000);
  };

  const resetAll = () => {
    setSelectedFile(null);
    setTitle("");
    setDescription("");
    setGenre("");
    setUploadStatus(null);
    setUploadProgress(0);
    setLogs([]);
  };

  return (
    <div className={dashboardStyles.dashboardLayout}>
      {/* Sidebar */}
      <aside className={dashboardStyles.sidebar}>
        <div className={dashboardStyles.logoContainer}>
          <div className={dashboardStyles.logoIcon}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
          <span className={dashboardStyles.logoText}>
            Cine<GradientText>Vault</GradientText>
          </span>
          <span className={dashboardStyles.adminBadge}>
            Admin
          </span>
        </div>
        {[
          { label: "Overview", icon: "📊", href: "/dashboard" },
          { label: "Movies", icon: "🎬", href: "/dashboard/movies" },
          { label: "Upload", icon: "⬆️", href: "/dashboard/upload", active: true },
        ].map((link) => (
          <a
            key={link.label}
            href={link.href}
            className={`${dashboardStyles.navLink} ${link.active ? dashboardStyles.navLinkActive : dashboardStyles.navLinkInactive}`}
          >
            <span>{link.icon}</span>
            <span>{link.label}</span>
          </a>
        ))}
      </aside>

      {/* Main Panel */}
      <main className={dashboardStyles.mainContent}>
        <div className={dashboardStyles.pageHeader}>
          <div>
            <h1 className={dashboardStyles.pageTitle}>
              Upload <GradientText>Center</GradientText>
            </h1>
            <p className={dashboardStyles.pageSubtitle}>
              Publish new movies directly into the transcoding pipeline.
            </p>
          </div>
        </div>

        <div className={uploadStyles.uploadGrid}>
          {/* Form and drag zone */}
          <div className={uploadStyles.uploadCol}>
            <GlassCard className={dashboardStyles.cardBase} tilt={false} glow={false}>
              <h3 className={uploadStyles.cardTitle}>Metadata Details</h3>
              <div className={uploadStyles.formGroup}>
                <div>
                  <label className={uploadStyles.label}>
                    Movie Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter movie title"
                    className={uploadStyles.inputField}
                  />
                </div>
                <div>
                  <label className={uploadStyles.label}>
                    Synopsis / Description
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief details..."
                    className={`${uploadStyles.inputField} ${uploadStyles.textAreaField}`}
                  />
                </div>
                <div className={uploadStyles.inputGrid}>
                  <div>
                    <label className={uploadStyles.label}>
                      Release Year
                    </label>
                    <input
                      type="number"
                      value={year}
                      onChange={(e) => setYear(Number(e.target.value))}
                      className={uploadStyles.inputField}
                    />
                  </div>
                  <div>
                    <label className={uploadStyles.label}>
                      Primary Genre
                    </label>
                    <select
                      value={genre}
                      onChange={(e) => setGenre(e.target.value)}
                      className={uploadStyles.inputField}
                    >
                      <option value="">Select genre</option>
                      {GENRES.map((g) => (
                        <option key={g.id} value={g.name}>
                          {g.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Drag Zone */}
            <div onDragEnter={handleDrag} className={uploadStyles.dragZoneContainer}>
              <input
                type="file"
                id="file-upload"
                onChange={handleFileChange}
                accept="video/*"
                style={{ display: 'none' }}
              />
              <label
                htmlFor="file-upload"
                className={`${uploadStyles.dragZoneLabel} ${
                  dragActive ? uploadStyles.dragZoneActive : uploadStyles.dragZoneDefault
                } ${selectedFile ? uploadStyles.dragZoneSelected : ''}`}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
              >
                <div className={uploadStyles.dragIcon}>🎥</div>
                <p className={uploadStyles.dragTitle}>
                  {selectedFile ? selectedFile.name : "Drag & Drop video file here"}
                </p>
                <p className={uploadStyles.dragSubtitle}>
                  Supports MP4, MOV, WEBM (Max size 5GB)
                </p>
                <div className={uploadStyles.pointerEventsNone}>
                  <Button variant="outline" size="sm" style={{ marginTop: '1rem' }}>
                    Choose File
                  </Button>
                </div>
              </label>
            </div>

            {selectedFile && !uploadStatus && (
              <Button variant="primary" size="lg" fullWidth onClick={startPipeline} glow>
                Start Transcoding Pipeline
              </Button>
            )}
          </div>

          {/* Transcoding pipeline status / logs */}
          <div className={uploadStyles.uploadCol}>
            <GlassCard className={`${dashboardStyles.cardBase} ${uploadStyles.statusCard}`} tilt={false} glow={false}>
              <div>
                <h3 className={uploadStyles.cardTitle}>Pipeline Status</h3>

                {uploadStatus === null ? (
                  <div className={uploadStyles.emptyStatus}>
                    No active transcoding pipeline running. Fill details and upload file to monitor process.
                  </div>
                ) : (
                  <div className={uploadStyles.formGroup}>
                    {/* Status Badge */}
                    <div className={uploadStyles.statusIndicatorRow}>
                      <div>
                        <span className={uploadStyles.statusLabel}>Status</span>
                        <span className={uploadStyles.statusText}>
                          {uploadStatus}
                        </span>
                      </div>
                      {uploadStatus === "complete" ? (
                        <span className={uploadStyles.statusCheck}>✓</span>
                      ) : (
                        <div className={uploadStyles.statusSpinner} />
                      )}
                    </div>

                    {/* Progress Bar */}
                    {uploadStatus === "uploading" && (
                      <div>
                        <div className={uploadStyles.progressContainer}>
                          <span>Uploading File to Cloudflare R2</span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <div className={uploadStyles.progressBarBg}>
                          <motion.div
                            className={uploadStyles.progressBarFill}
                            style={{ width: `${uploadProgress}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Transcoding Resolutions Indicator */}
                    {uploadStatus !== "uploading" && (
                      <div className={uploadStyles.resGrid}>
                        {["1080p", "720p", "480p", "360p"].map((res) => (
                          <div
                            key={res}
                            className={`${uploadStyles.resBadge} ${
                                uploadStatus === "complete"
                                  ? uploadStyles.resComplete
                                  : uploadStatus === "transcoding"
                                  ? uploadStyles.resTranscoding
                                  : uploadStyles.resPending
                            }`}
                          >
                            {res}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Logs output */}
              {logs.length > 0 && (
                <div className={uploadStyles.logsContainer}>
                  <h4 className={uploadStyles.logsLabel}>
                    HLS segment logs
                  </h4>
                  <div className={uploadStyles.logsViewer}>
                    {logs.map((log, i) => (
                      <div key={i}>{log}</div>
                    ))}
                    {uploadStatus !== "complete" && (
                      <span className={uploadStyles.cursor} />
                    )}
                  </div>
                  {uploadStatus === "complete" && (
                    <div style={{ marginTop: '1rem' }}>
                      <Button variant="secondary" size="md" fullWidth onClick={resetAll}>
                        Upload Another Movie
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </GlassCard>
          </div>
        </div>
      </main>
    </div>
  );
}
