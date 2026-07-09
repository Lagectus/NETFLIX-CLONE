"use client";

import React from "react";
import { LenisProvider } from "@/providers/LenisProvider";
import { QueryProvider } from "@/providers/QueryProvider";
import { LoadingScreen } from "@/components/shared/LoadingScreen";
import { SearchOverlay } from "@/components/search/SearchOverlay";

/* ═══════════════════════════════════════════
   CineVault — Client Providers
   Wraps app with all client-side providers
   ═══════════════════════════════════════════ */

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <LenisProvider>
        <LoadingScreen />
        <SearchOverlay />
        {children}
      </LenisProvider>
    </QueryProvider>
  );
}
