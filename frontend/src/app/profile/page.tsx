"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/sections/Footer";
import { GradientText, Badge } from "@/components/ui/Primitives";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";

/* ═══════════════════════════════════════════
   CineVault — User Profile Page
   Subscription status, active devices, settings,
   and visual watch stats.
   ═══════════════════════════════════════════ */

export default function ProfilePage() {
  const [activePlan] = useState({
    name: "Ultra 4K + HDR",
    price: "$15.99/mo",
    nextBilling: "August 5, 2026",
    status: "Active",
  });

  const [devices] = useState([
    { name: "LG WebOS OLED TV", location: "Living Room", active: true, icon: "📺" },
    { name: "MacBook Pro 16\"", location: "Workplace", active: true, icon: "💻" },
    { name: "iPhone 15 Pro Max", location: "Mobile", active: false, icon: "📱" },
  ]);

  const [watchStats] = useState([
    { label: "Hours Watched", value: "324 hrs", icon: "⏱️" },
    { label: "Favorite Genre", value: "Sci-Fi", icon: "🚀" },
    { label: "Completed Titles", value: "48", icon: "🏆" },
  ]);

  return (
    <main className="relative min-h-screen bg-cv-primary text-white flex flex-col justify-between">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cv-accent/5 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none z-0" />

      <div>
        <Navbar />

        {/* Top spacer for navbar */}
        <div className="h-20 lg:h-24" />

        <div className="section-container py-10 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-10"
          >
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight">
              My <GradientText>Profile</GradientText>
            </h1>
            <p className="text-sm text-white/40 mt-2">
              Manage your subscription, active devices, and personal preferences.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Column 1: User Info & Plan */}
            <div className="lg:col-span-1 space-y-6">
              {/* User Identity Card */}
              <GlassCard className="p-6 text-center flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cv-accent to-purple-600 flex items-center justify-center text-4xl font-bold border-4 border-white/[0.08] shadow-lg mb-4">
                  S
                </div>
                <h3 className="text-xl font-bold text-white">Sagar</h3>
                <p className="text-xs text-white/40 mt-1">sagar@example.com</p>
                <div className="mt-4 flex gap-2">
                  <Badge variant="premium">Premium Member</Badge>
                  <Badge variant="success">Active</Badge>
                </div>
              </GlassCard>

              {/* Plan Card */}
              <GlassCard className="p-6">
                <h4 className="text-xs uppercase tracking-widest text-white/30 font-semibold mb-4">
                  Subscription Details
                </h4>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-lg font-bold text-white">{activePlan.name}</span>
                  <span className="text-sm font-semibold text-cv-highlight">{activePlan.price}</span>
                </div>
                <p className="text-xs text-white/40 mb-5">
                  Next renewal date: <span className="text-white/80 font-medium">{activePlan.nextBilling}</span>
                </p>
                <div className="flex gap-2">
                  <Button variant="primary" size="sm" className="w-full">
                    Change Plan
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    Cancel
                  </Button>
                </div>
              </GlassCard>
            </div>

            {/* Column 2: Watch Stats & Active Devices */}
            <div className="lg:col-span-2 space-y-6">
              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-4">
                {watchStats.map((stat, i) => (
                  <GlassCard key={i} className="p-5 flex flex-col items-center justify-center text-center">
                    <span className="text-3xl mb-2">{stat.icon}</span>
                    <span className="text-[10px] text-white/30 uppercase tracking-widest font-semibold">
                      {stat.label}
                    </span>
                    <span className="text-lg font-extrabold text-white mt-1">{stat.value}</span>
                  </GlassCard>
                ))}
              </div>

              {/* Active Devices */}
              <GlassCard className="p-6">
                <h4 className="text-xs uppercase tracking-widest text-white/30 font-semibold mb-4">
                  Active Devices ({devices.filter(d => d.active).length} connected)
                </h4>
                <div className="space-y-4">
                  {devices.map((device, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.04]">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{device.icon}</span>
                        <div>
                          <p className="text-sm font-bold text-white">{device.name}</p>
                          <p className="text-xs text-white/40">{device.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {device.active ? (
                          <>
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-xs text-emerald-400 font-semibold">Stream Active</span>
                          </>
                        ) : (
                          <span className="text-xs text-white/30">Offline</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Security Preferences */}
              <GlassCard className="p-6">
                <h4 className="text-xs uppercase tracking-widest text-white/30 font-semibold mb-4">
                  Profile Preferences
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.04]">
                    <div>
                      <p className="text-xs font-semibold text-white">Autoplay next episode</p>
                      <p className="text-[10px] text-white/30">Instantly play the next series episode</p>
                    </div>
                    <input type="checkbox" defaultChecked className="accent-cv-accent h-4 w-4" />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.04]">
                    <div>
                      <p className="text-xs font-semibold text-white">Autoplay previews</p>
                      <p className="text-[10px] text-white/30">Show mini clips on hover cards</p>
                    </div>
                    <input type="checkbox" defaultChecked className="accent-cv-accent h-4 w-4" />
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
