/* ═══════════════════════════════════════════
   CineVault — TypeScript Types
   ═══════════════════════════════════════════ */

export interface Movie {
  id: string;
  title: string;
  tagline?: string;
  description: string;
  poster: string;
  backdrop: string;
  logo?: string;
  year: number;
  rating: string;
  score: number;
  duration: number;
  genres: string[];
  accentColor?: string;
  trailerUrl?: string;
  videoUrl?: string;
  cast?: CastMember[];
  director?: string;
  language?: string;
  seasons?: number;
  episodes?: number;
  languages?: string[];
  recommendations?: Movie[];
  isBookmarked?: boolean;
  progress?: number;
  createdAt?: string;
}

export interface Series extends Omit<Movie, "duration" | "seasons"> {
  seasons: Season[];
  totalEpisodes: number;
  status: "ongoing" | "completed" | "upcoming";
}

export interface Season {
  id: string;
  number: number;
  title: string;
  episodes: Episode[];
  year: number;
}

export interface Episode {
  id: string;
  number: number;
  title: string;
  description: string;
  duration: number;
  thumbnail: string;
  videoUrl: string;
  progress?: number;
}

export interface CastMember {
  id: string;
  name: string;
  character: string;
  photo: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: "user" | "admin";
  watchlist: string[];
  watchHistory: WatchHistoryItem[];
  createdAt: string;
}

export interface WatchHistoryItem {
  movieId: string;
  episodeId?: string;
  progress: number;
  duration: number;
  lastWatched: string;
}

export interface Genre {
  id: number;
  name: string;
  icon: string;
  color: string;
}

export interface SearchResult {
  movies: Movie[];
  series: Series[];
  query: string;
  total: number;
}

export interface PlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isFullscreen: boolean;
  isCinemaMode: boolean;
  isPiP: boolean;
  playbackSpeed: number;
  quality: string;
  subtitle: string | null;
  isBuffering: boolean;
  buffered: number;
}

export interface UploadProgress {
  id: string;
  filename: string;
  progress: number;
  status: "uploading" | "processing" | "transcoding" | "complete" | "error";
  resolution?: string;
  error?: string;
}

export interface AdminStats {
  totalUsers: number;
  totalMovies: number;
  totalViews: number;
  totalRevenue: number;
  activeUsers: number;
  newSignups: number;
  viewsChart: ChartData[];
  revenueChart: ChartData[];
  genreDistribution: { genre: string; count: number }[];
}

export interface ChartData {
  label: string;
  value: number;
}

// ── API Response Types ──
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}
