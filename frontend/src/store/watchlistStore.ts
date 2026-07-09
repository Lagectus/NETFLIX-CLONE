import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Movie } from "@/types";

/* ═══════════════════════════════════════════
   CineVault — Watchlist Store
   Global persisted state for bookmarked movies
   ═══════════════════════════════════════════ */

interface WatchlistState {
  savedMovies: Movie[];
  addMovie: (movie: Movie) => void;
  removeMovie: (id: string) => void;
  toggleMovie: (movie: Movie) => void;
  isBookmarked: (id: string) => boolean;
}

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      savedMovies: [],
      addMovie: (movie) =>
        set((state) => {
          if (state.savedMovies.find((m) => m.id === movie.id)) return state;
          return { savedMovies: [...state.savedMovies, movie] };
        }),
      removeMovie: (id) =>
        set((state) => ({
          savedMovies: state.savedMovies.filter((m) => m.id !== id),
        })),
      toggleMovie: (movie) => {
        const state = get();
        if (state.isBookmarked(movie.id)) {
          state.removeMovie(movie.id);
        } else {
          state.addMovie(movie);
        }
      },
      isBookmarked: (id) => {
        const state = get();
        return state.savedMovies.some((m) => m.id === id);
      },
    }),
    {
      name: "cinevault-watchlist", // name of item in storage (must be unique)
    }
  )
);
