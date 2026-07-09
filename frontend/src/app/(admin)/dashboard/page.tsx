"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { GradientText } from "@/components/ui/Primitives";
import { GlassCard } from "@/components/ui/GlassCard";
import { staggerContainer, staggerItem } from "@/animations/framer/variants";
import styles from "./dashboard.module.css";

/* ═══════════════════════════════════════════
   CineVault — Admin Dashboard
   Modern enterprise analytics dashboard with
   animated charts, stats cards, and data management
   ═══════════════════════════════════════════ */

const stats = [
  {
    label: "Total Users",
    value: "124,521",
    change: "+12.5%",
    isPositive: true,
    icon: "👥",
    color: "#2563EB",
  },
  {
    label: "Total Movies",
    value: "2,847",
    change: "+8",
    isPositive: true,
    icon: "🎬",
    color: "#7C3AED",
  },
  {
    label: "Total Views",
    value: "1.2M",
    change: "+23.1%",
    isPositive: true,
    icon: "👁️",
    color: "#059669",
  },
  {
    label: "Revenue",
    value: "$84,230",
    change: "+15.3%",
    isPositive: true,
    icon: "💰",
    color: "#EAB308",
  },
  {
    label: "Active Now",
    value: "3,412",
    change: "-2.1%",
    isPositive: false,
    icon: "🟢",
    color: "#22C55E",
  },
  {
    label: "New Signups",
    value: "847",
    change: "+31%",
    isPositive: true,
    icon: "📈",
    color: "#EC4899",
  },
];

const recentActivity = [
  { action: "New movie uploaded", detail: "Quantum Horizon — Processing HLS", time: "2m ago", icon: "🎬" },
  { action: "User registered", detail: "john.doe@email.com", time: "5m ago", icon: "👤" },
  { action: "Payment received", detail: "$12.99 — Premium Plan", time: "12m ago", icon: "💳" },
  { action: "Movie published", detail: "The Last Algorithm", time: "1h ago", icon: "✅" },
  { action: "Report generated", detail: "Monthly analytics — June 2025", time: "3h ago", icon: "📊" },
];

const sidebarLinks = [
  { label: "Overview", icon: "📊", href: "/dashboard", active: true },
  { label: "Movies", icon: "🎬", href: "/dashboard/movies" },
  { label: "Series", icon: "📺", href: "/dashboard/series" },
  { label: "Users", icon: "👥", href: "/dashboard/users" },
  { label: "Upload", icon: "⬆️", href: "/dashboard/upload" },
  { label: "Analytics", icon: "📈", href: "/dashboard/analytics" },
  { label: "Genres", icon: "🏷️", href: "/dashboard/genres" },
  { label: "Banners", icon: "🖼️", href: "/dashboard/banners" },
  { label: "Notifications", icon: "🔔", href: "/dashboard/notifications" },
  { label: "Settings", icon: "⚙️", href: "/dashboard/settings" },
];

// Simple bar chart component
function MiniChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  return (
    <div className={styles.miniChartContainer}>
      {data.map((val, i) => (
        <motion.div
          key={i}
          className={styles.miniChartBar}
          style={{ backgroundColor: color }}
          initial={{ height: 0 }}
          whileInView={{ height: `${(val / max) * 100}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
        />
      ))}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className={styles.dashboardLayout}>
      {/* Sidebar */}
      <motion.aside
        className={styles.sidebar}
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo */}
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

        {sidebarLinks.map((link) => (
          <motion.a
            key={link.label}
            href={link.href}
            className={`${styles.navLink} ${link.active ? styles.navLinkActive : styles.navLinkInactive}`}
            whileHover={{ x: 4 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <span>{link.icon}</span>
            <span>{link.label}</span>
          </motion.a>
        ))}

        {/* Bottom profile */}
        <div className={styles.profileContainer}>
          <div className={styles.profileRow}>
            <div className={styles.profileAvatar}>
              A
            </div>
            <div>
              <p className={styles.profileName}>Admin</p>
              <p className={styles.profileEmail}>admin@cinevault.com</p>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main content */}
      <div className={styles.mainContent}>
        {/* Header */}
        <motion.div
          className={styles.pageHeader}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className={styles.pageTitle}>
              Dashboard <GradientText as="span">Overview</GradientText>
            </h1>
            <p className={styles.pageSubtitle}>
              Welcome back, Admin. Here&apos;s what&apos;s happening today.
            </p>
          </div>
          <motion.button
            className={styles.headerAction}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            + Add Movie
          </motion.button>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className={styles.statsGrid}
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {stats.map((stat) => (
            <motion.div key={stat.label} variants={staggerItem}>
              <GlassCard className={styles.statCardInner} tilt={false} glow={false}>
                <div className={styles.statHeader}>
                  <div>
                    <p className={styles.statLabel}>
                      {stat.label}
                    </p>
                    <p className={styles.statValue}>{stat.value}</p>
                  </div>
                  <span className={styles.statIcon}>{stat.icon}</span>
                </div>
                <div className={styles.statChangeRow}>
                  <span
                    className={`${styles.statChangeBadge} ${stat.isPositive ? styles.statChangePos : styles.statChangeNeg}`}
                  >
                    {stat.change}
                  </span>
                  <span className={styles.statChangeText}>vs last month</span>
                </div>
                {/* Mini chart */}
                <div className="mt-3">
                  <MiniChart
                    data={[3, 5, 4, 7, 6, 8, 9, 7, 10, 8, 11, 12]}
                    color={stat.color}
                  />
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>

        {/* Two-column layout */}
        <div className={styles.twoColLayout}>
          {/* Views Chart Area */}
          <div className={styles.colSpan2}>
            <GlassCard className={styles.statCardInner} tilt={false} glow={false}>
              <div className={styles.chartHeader}>
                <h2 className={styles.sectionTitle}>Views Overview</h2>
                <div className={styles.periodGroup}>
                  {["7d", "30d", "90d", "1y"].map((period) => (
                    <button
                      key={period}
                      className={`${styles.periodBtn} ${period === "30d" ? styles.periodBtnActive : styles.periodBtnInactive}`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>

              {/* Simulated chart */}
              <div>
                <MiniChart
                  data={[20, 35, 28, 45, 40, 55, 48, 62, 58, 70, 65, 78, 72, 85, 80, 92, 88, 95, 90, 98, 94, 102, 98, 108, 105, 115, 110, 120, 116, 125]}
                  color="#2563EB"
                />
              </div>
            </GlassCard>
          </div>

          {/* Recent Activity */}
          <GlassCard className={styles.statCardInner} tilt={false} glow={false}>
            <h2 className={`${styles.sectionTitle} mb-4`}>Recent Activity</h2>
            <div className={styles.activityList}>
              {recentActivity.map((activity, i) => (
                <motion.div
                  key={i}
                  className={styles.activityItem}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  <span className={styles.activityIcon}>{activity.icon}</span>
                  <div className={styles.activityInfo}>
                    <p className={styles.activityAction}>
                      {activity.action}
                    </p>
                    <p className={styles.activityDetail}>
                      {activity.detail}
                    </p>
                  </div>
                  <span className={styles.activityTime}>
                    {activity.time}
                  </span>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
