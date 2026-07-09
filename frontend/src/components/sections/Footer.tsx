"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { GradientText } from "@/components/ui/Primitives";
import styles from "./Footer.module.css";
import { staggerContainer, staggerItem } from "@/animations/framer/variants";

/* ═══════════════════════════════════════════
   CineVault — Premium Footer
   Staggered link reveals, gradient divider, ambient glow
   ═══════════════════════════════════════════ */

const footerLinks = [
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", href: "/help" },
      { label: "Contact Us", href: "/contact" },
      { label: "Account", href: "/profile" },
      { label: "Devices", href: "/devices" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Use", href: "/terms" },
      { label: "Cookie Preferences", href: "/cookies" },
      { label: "DMCA", href: "/dmca" },
    ],
  },
  {
    title: "Discover",
    links: [
      { label: "Movies", href: "/browse?type=movie" },
      { label: "Series", href: "/browse?type=series" },
      { label: "Originals", href: "/originals" },
      { label: "New & Popular", href: "/browse?sort=popular" },
    ],
  },
];

export function Footer() {
  return (
    <footer className={styles.footer}>
      {/* Gradient divider */}
      <div className={styles.gradientDivider} />

      {/* Ambient glow */}
      <div className={styles.ambientGlow} />

      <div className={`section-container ${styles.footerContainer}`}>
        <motion.div
          className={styles.linksGrid}
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-50px" }}
        >
          {footerLinks.map((group) => (
            <motion.div key={group.title} variants={staggerItem}>
              <h4 className={styles.groupTitle}>
                {group.title}
              </h4>
              <ul className={styles.linkList}>
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={styles.footerLink}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom bar */}
        <div className={styles.bottomBar}>
          {/* Logo */}
          <div className={styles.logoWrapper}>
            <div className={styles.logoIcon}>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
              >
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>
            <span className={styles.logoText}>
              Cine<GradientText>Vault</GradientText>
            </span>
          </div>

          <p className={styles.copyright}>
            © {new Date().getFullYear()} CineVault. All rights reserved. Premium streaming experience.
          </p>

          {/* Social links */}
          <div className={styles.socialRow}>
            {["X", "IG", "YT", "GH"].map((social) => (
              <motion.a
                key={social}
                href="#"
                className={styles.socialBtn}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {social}
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
