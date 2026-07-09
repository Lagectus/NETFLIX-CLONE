"use client";

import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { Movie } from "@/types";

/* ═══════════════════════════════════════════
   CineVault — useTMDBMovies Hook
   React Query wrapper to fetch mapped TMDB titles
   ═══════════════════════════════════════════ */

export function useTMDBDetails(id: string) {
  return useQuery<Movie>({
    queryKey: ["tmdb", "details", id],
    queryFn: async () => {
      const res = await fetch(`/api/tmdb?endpoint=details&query=${id}`);
      if (!res.ok) {
        throw new Error("Failed to fetch TMDB details");
      }
      const json = await res.json();
      if (!json.success) {
        throw new Error(json.error || "Failed to fetch TMDB details");
      }
      return json.data;
    },
    staleTime: 60 * 60 * 1000, // 1 hour caching
    enabled: !!id,
  });
}

/**
 * Fetch season episodes for a specific TV show
 */
export function useTMDBSeason(tvId: string, seasonNumber: number) {
  return useQuery({
    queryKey: ["tmdb", "season", tvId, seasonNumber],
    queryFn: async () => {
      if (!tvId) return [];
      
      const res = await fetch(`/api/tmdb?endpoint=season&query=${tvId}&season=${seasonNumber}`);
      if (!res.ok) throw new Error("Failed to fetch season details");
      
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to fetch season details");
      
      return json.data;
    },
    enabled: !!tvId && tvId.startsWith("tv-"),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
}

export function useTMDBMovies(endpoint: string, options?: { genre?: string; query?: string; type?: string; originalLanguage?: string; year?: string }) {
  const { genre = "", query = "", type = "movie", originalLanguage = "", year = "" } = options || {};

  return useQuery<Movie[]>({
    queryKey: ["tmdb", endpoint, genre, query, type, originalLanguage, year],
    queryFn: async () => {
      const params = new URLSearchParams({ endpoint });
      if (genre) params.append("genre", genre);
      if (query) params.append("query", query);
      if (type) params.append("type", type);
      if (originalLanguage) params.append("originalLanguage", originalLanguage);
      if (year) params.append("year", year);

      const res = await fetch(`/api/tmdb?${params.toString()}`);
      if (!res.ok) {
        throw new Error("Failed to fetch TMDB data");
      }
      const json = await res.json();
      if (!json.success) {
        throw new Error(json.error || "Failed to fetch TMDB data");
      }
      return json.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes caching
  });
}

export function useTMDBInfiniteMovies(endpoint: string, options?: { genre?: string; query?: string; type?: string; limit?: number; originalLanguage?: string; year?: string }) {
  const { genre = "", query = "", type = "movie", limit = 24, originalLanguage = "", year = "" } = options || {};

  return useInfiniteQuery<{ data: Movie[], page: number, totalPages: number }>({
    queryKey: ["tmdb-infinite", endpoint, genre, query, type, limit, originalLanguage, year],
    queryFn: async ({ pageParam = 1 }) => {
      const params = new URLSearchParams({ 
        endpoint, 
        page: String(pageParam),
        limit: String(limit)
      });
      if (genre) params.append("genre", genre);
      if (query) params.append("query", query);
      if (type) params.append("type", type);
      if (originalLanguage) params.append("originalLanguage", originalLanguage);
      if (year) params.append("year", year);

      const res = await fetch(`/api/tmdb?${params.toString()}`);
      if (!res.ok) {
        throw new Error("Failed to fetch TMDB data");
      }
      const json = await res.json();
      if (!json.success) {
        throw new Error(json.error || "Failed to fetch TMDB data");
      }
      return {
        data: json.data,
        page: json.page,
        totalPages: json.totalPages
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    staleTime: 5 * 60 * 1000,
  });
}
