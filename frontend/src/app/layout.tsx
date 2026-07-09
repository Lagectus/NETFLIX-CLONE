import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { ClientProviders } from "./providers";
import "./globals.css";

/* ═══════════════════════════════════════════
   CineVault — Root Layout
   Premium typography, metadata, providers
   ═══════════════════════════════════════════ */

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CineVault — Next-Generation Streaming",
  description:
    "Experience the future of streaming. CineVault delivers cinematic content with stunning visual quality, immersive interactions, and a premium viewing experience.",
  keywords: [
    "streaming",
    "movies",
    "series",
    "cinema",
    "CineVault",
    "premium",
  ],
  openGraph: {
    title: "CineVault — Next-Generation Streaming",
    description:
      "Experience the future of streaming with cinematic interactions and premium content.",
    type: "website",
    locale: "en_US",
    siteName: "CineVault",
  },
  twitter: {
    card: "summary_large_image",
    title: "CineVault — Next-Generation Streaming",
    description:
      "Experience the future of streaming with cinematic interactions and premium content.",
  },
  robots: "index, follow",
};

export const viewport = {
  themeColor: "#0B0F19",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} antialiased`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
