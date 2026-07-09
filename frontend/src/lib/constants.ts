/* ═══════════════════════════════════════════
   CineVault — Constants & Configuration
   ═══════════════════════════════════════════ */

// ── Color Palette ──
export const COLORS = {
  primary: "#0B0F19",
  secondary: "#131A2A",
  accent: "#2563EB",
  highlight: "#60A5FA",
  text: "#FFFFFF",
  textMuted: "#94A3B8",
  textDim: "#64748B",
  glass: "rgba(255, 255, 255, 0.06)",
  glassBorder: "rgba(255, 255, 255, 0.1)",
  glassHover: "rgba(255, 255, 255, 0.1)",
  glassStrong: "rgba(255, 255, 255, 0.12)",
} as const;

// ── Animation Durations ──
export const DURATIONS = {
  fast: 0.2,
  normal: 0.35,
  slow: 0.6,
  verySlow: 1.0,
} as const;

// ── Easing Curves ──
export const EASINGS = {
  out: [0.16, 1, 0.3, 1] as [number, number, number, number],
  inOut: [0.65, 0, 0.35, 1] as [number, number, number, number],
  spring: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
  smooth: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
} as const;

// ── Breakpoints ──
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
  "4k": 2560,
} as const;

// ── API Routes ──
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// ── Navigation Links ──
export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Movies", href: "/browse?type=movie" },
  { label: "Series", href: "/browse?type=series" },
  { label: "New & Popular", href: "/browse?sort=popular&year=2026" },
  { label: "My List", href: "/watchlist" },
] as const;

// ── Genre List ──
export const GENRES = [
  { id: 28, name: "Action", icon: "⚡", color: "#EF4444" },
  { id: 12, name: "Adventure", icon: "🧭", color: "#F97316" },
  { id: 16, name: "Animation", icon: "🎨", color: "#A855F7" },
  { id: 35, name: "Comedy", icon: "😄", color: "#EAB308" },
  { id: 80, name: "Crime", icon: "🔍", color: "#6B7280" },
  { id: 99, name: "Documentary", icon: "📽️", color: "#06B6D4" },
  { id: 18, name: "Drama", icon: "🎭", color: "#3B82F6" },
  { id: 10751, name: "Family", icon: "👨‍👩‍👧‍👦", color: "#22C55E" },
  { id: 14, name: "Fantasy", icon: "✨", color: "#8B5CF6" },
  { id: 36, name: "History", icon: "📜", color: "#92400E" },
  { id: 27, name: "Horror", icon: "👻", color: "#DC2626" },
  { id: 10402, name: "Music", icon: "🎵", color: "#EC4899" },
  { id: 9648, name: "Mystery", icon: "🔮", color: "#4338CA" },
  { id: 10749, name: "Romance", icon: "💕", color: "#F472B6" },
  { id: 878, name: "Sci-Fi", icon: "🚀", color: "#2563EB" },
  { id: 53, name: "Thriller", icon: "🔪", color: "#991B1B" },
  { id: 10752, name: "War", icon: "⚔️", color: "#78716C" },
  { id: 37, name: "Western", icon: "🤠", color: "#D97706" },
] as const;

// ── Ratings ──
export const MATURITY_RATINGS = [
  "U",
  "UA",
  "A",
  "PG",
  "PG-13",
  "R",
  "NC-17",
] as const;

// ── Player ──
export const PLAYBACK_SPEEDS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] as const;

export const QUALITY_OPTIONS = [
  { label: "Auto", value: "auto" },
  { label: "4K Ultra HD", value: "2160" },
  { label: "Full HD", value: "1080" },
  { label: "HD", value: "720" },
  { label: "SD", value: "480" },
  { label: "Low", value: "360" },
] as const;

// ── Featured/Hero Content (Mock) ──
export const FEATURED_MOVIES = [
  {
    id: "1",
    title: "Quantum Horizon",
    tagline: "Beyond the edge of reality",
    description:
      "A theoretical physicist discovers a way to peer into parallel dimensions, but each glimpse threatens to unravel the fabric of our own universe. As governments race to weaponize her discovery, she must choose between scientific glory and the survival of reality itself.",
    year: 2025,
    rating: "PG-13",
    duration: 148,
    score: 8.7,
    genres: ["Sci-Fi", "Thriller", "Drama"],
    backdrop: "/images/hero-1.jpg",
    poster: "/images/poster-1.jpg",
    logo: "/images/logo-1.png",
    accentColor: "#2563EB",
  },
  {
    id: "2",
    title: "The Last Algorithm",
    tagline: "The code that rewrote humanity",
    description:
      "In a world where AI has surpassed human intelligence, a rogue programmer discovers that the most advanced AI is planning an irreversible transformation of human consciousness. With only 72 hours before deployment, she must hack into the system that thinks faster than she ever could.",
    year: 2025,
    rating: "R",
    duration: 136,
    score: 9.1,
    genres: ["Sci-Fi", "Action", "Mystery"],
    backdrop: "/images/hero-2.jpg",
    poster: "/images/poster-2.jpg",
    logo: "/images/logo-2.png",
    accentColor: "#7C3AED",
  },
  {
    id: "3",
    title: "Echoes of Silence",
    tagline: "Some stories are told without words",
    description:
      "After a global event renders all electronic communication useless, a deaf woman becomes the unlikely key to reconnecting a fractured world. Her journey across devastated landscapes reveals that the most powerful connections are the ones technology could never provide.",
    year: 2025,
    rating: "PG-13",
    duration: 162,
    score: 8.9,
    genres: ["Drama", "Adventure", "Fantasy"],
    backdrop: "/images/hero-3.jpg",
    poster: "/images/poster-3.jpg",
    logo: "/images/logo-3.png",
    accentColor: "#059669",
  },
  {
    id: "4",
    title: "Crimson Protocol",
    tagline: "Trust no one. Survive everyone.",
    description:
      "An elite intelligence operative is burned by her own agency and must navigate a web of international conspiracies to clear her name. With every ally potentially an enemy, she discovers a plot that reaches the highest levels of global power.",
    year: 2025,
    rating: "R",
    duration: 141,
    score: 8.5,
    genres: ["Action", "Thriller", "Crime"],
    backdrop: "/images/hero-4.jpg",
    poster: "/images/poster-4.jpg",
    logo: "/images/logo-4.png",
    accentColor: "#DC2626",
  },
] as const;

// ── Mock Movie Data for sections ──
export const MOCK_MOVIES = Array.from({ length: 20 }, (_, i) => ({
  id: `movie-${i + 1}`,
  title: [
    "Nebula Rising", "Shadow Circuit", "The Void Protocol", "Stellar Drift",
    "Dark Matter", "Apex Predator", "The Silent Hour", "Cipher",
    "Omega Point", "Glass Empire", "Neon Abyss", "The Last Frontier",
    "Phantom Thread", "Zero Day", "Crystal Dawn", "Binary Storm",
    "The Architect", "Hollow Earth", "Quantum Break", "Event Horizon"
  ][i],
  poster: `/images/movie-${(i % 10) + 1}.jpg`,
  backdrop: `/images/backdrop-${(i % 5) + 1}.jpg`,
  year: 2024 + (i % 2),
  rating: MATURITY_RATINGS[i % 4],
  score: Number((7.0 + (i * 0.13) % 2.5).toFixed(1)),
  duration: 90 + (i * 7) % 80,
  genres: [GENRES[i % GENRES.length].name],
  description: "A gripping tale that pushes the boundaries of cinematic storytelling.",
  progress: i < 5 ? 10 + (i * 15) % 80 : undefined,
}));
