import { NextResponse } from "next/server";

/* ═══════════════════════════════════════════
   CineVault — TMDB Proxy API Route
   Securely fetches and maps real movie data from TMDB
   ═══════════════════════════════════════════ */

const TMDB_API_KEY = process.env.TMDB_API_KEY || "dd9e1b8d8e37735e79648fd34e2979c6";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

const genreMap: Record<number, string> = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Sci-Fi",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
};

// Maps TMDB movie object to CineVault Movie model
function mapTMDBToMovie(item: any): any {
  const mediaType = item.media_type || (item.name ? 'tv' : 'movie');
  
  let year = 0;
  if (item.release_date) {
    year = new Date(item.release_date).getFullYear();
  } else if (item.first_air_date) {
    year = new Date(item.first_air_date).getFullYear();
  }
  if (isNaN(year)) year = 0;

  const genres = item.genre_ids
    ? Array.from(new Set(item.genre_ids.map((id: number) => genreMap[id] || "Drama").filter(Boolean)))
    : ["Drama"];

  let mappedLanguages = item.spoken_languages 
    ? item.spoken_languages.map((l: any) => l.english_name || l.name) 
    : ["English"];
  
  mappedLanguages = mappedLanguages.filter((l: string) => l !== "Hindi");
  mappedLanguages.unshift("Hindi");
  
  if (!mappedLanguages.includes("Japanese")) mappedLanguages.push("Japanese");

  return {
    id: `${mediaType}-${item.id}`,
    title: item.title || item.name || "Untitled Production",
    description: item.overview || "No synopsis available for this title.",
    poster: item.poster_path
      ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
      : "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=500",
    backdrop: item.backdrop_path
      ? `https://image.tmdb.org/t/p/original${item.backdrop_path}`
      : "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1280",
    year,
    rating: item.adult ? "R" : "PG-13",
    score: Number((item.vote_average || 7.0).toFixed(1)),
    duration: item.runtime || 120, // use runtime if available, else 120
    genres: genres.length > 0 ? genres : (item.genres ? item.genres.map((g: any) => g.name) : ["Sci-Fi"]),
    seasons: item.number_of_seasons,
    episodes: item.number_of_episodes,
    languages: mappedLanguages,
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get("endpoint") || "trending";
    const query = searchParams.get("query") || "";
    const genreId = searchParams.get("genre") || "";
    const typeParam = searchParams.get("type") || "movie";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "24");
    const originalLanguage = searchParams.get("originalLanguage") || "";
    const exactYear = searchParams.get("year");
    const seasonNumber = searchParams.get("season") || "1";
    
    // Map CineVault types to TMDB types
    const mediaType = typeParam === "series" ? "tv" : typeParam === "all" ? "movie" : typeParam;

    let url = "";

    switch (endpoint) {
      case "trending":
        url = `${TMDB_BASE_URL}/trending/${typeParam === 'all' ? 'all' : mediaType}/week?api_key=${TMDB_API_KEY}`;
        break;
      case "popular":
        url = `${TMDB_BASE_URL}/${mediaType}/popular?api_key=${TMDB_API_KEY}`;
        break;
      case "top_rated":
        url = `${TMDB_BASE_URL}/${mediaType}/top_rated?api_key=${TMDB_API_KEY}`;
        break;
      case "upcoming":
        url = `${TMDB_BASE_URL}/${mediaType}/${mediaType === 'tv' ? 'on_the_air' : 'upcoming'}?api_key=${TMDB_API_KEY}`;
        break;
      case "now_playing":
        url = `${TMDB_BASE_URL}/${mediaType}/${mediaType === 'tv' ? 'airing_today' : 'now_playing'}?api_key=${TMDB_API_KEY}`;
        break;
      case "discover":
        url = `${TMDB_BASE_URL}/discover/${mediaType}?api_key=${TMDB_API_KEY}`;
        if (genreId) url += `&with_genres=${genreId}`;
        if (originalLanguage) url += `&with_original_language=${originalLanguage}`;
        break;
      case "search":
        // Search should default to 'multi' so both movies and TV shows appear
        const searchType = searchParams.has("type") && typeParam !== "all" ? mediaType : "multi";
        url = `${TMDB_BASE_URL}/search/${searchType}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`;
        break;
      case "details":
        if (!query) return NextResponse.json({ success: false, error: "Missing ID" }, { status: 400 });
        
        let detailsMediaType = "movie";
        let actualId = query;
        let fallbackMediaType = "tv";
        
        if (query.startsWith("tv-")) {
          detailsMediaType = "tv";
          actualId = query.replace("tv-", "");
          fallbackMediaType = "movie";
        } else if (query.startsWith("movie-")) {
          detailsMediaType = "movie";
          actualId = query.replace("movie-", "");
          fallbackMediaType = "tv";
        }

        // Details bypasses the pagination loop entirely
        let res = await fetch(`${TMDB_BASE_URL}/${detailsMediaType}/${actualId}?api_key=${TMDB_API_KEY}&append_to_response=credits,recommendations`, { next: { revalidate: 3600 } });
        let data = await res.json();
        
        // If not found, try the fallback
        if (data.status_code === 34) {
          res = await fetch(`${TMDB_BASE_URL}/${fallbackMediaType}/${actualId}?api_key=${TMDB_API_KEY}&append_to_response=credits,recommendations`, { next: { revalidate: 3600 } });
          data = await res.json();
        }
        
        if (data.status_code === 34) {
          return NextResponse.json({ success: false, error: "Title not found" }, { status: 404 });
        }
        
        let detailsMovie = mapTMDBToMovie(data);
        
        // Enhance with cast and recommendations
        if (data.credits && data.credits.cast) {
          detailsMovie.cast = data.credits.cast.slice(0, 10).map((c: any) => ({
            id: String(c.id),
            name: c.name,
            character: c.character,
            photo: c.profile_path ? `https://image.tmdb.org/t/p/w200${c.profile_path}` : "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200"
          }));
        }
        if (data.recommendations && data.recommendations.results) {
          detailsMovie.recommendations = data.recommendations.results
            .map(mapTMDBToMovie)
            .filter((m: any) => m.poster && m.backdrop && m.year > 2000)
            .slice(0, 15);
        }
        
        return NextResponse.json({
          success: true,
          data: detailsMovie
        });

      case "season":
        if (!query) return NextResponse.json({ success: false, error: "Missing ID" }, { status: 400 });
        
        let sActualId = query;
        if (query.startsWith("tv-")) {
          sActualId = query.replace("tv-", "");
        }
        
        const seasonRes = await fetch(`${TMDB_BASE_URL}/tv/${sActualId}/season/${seasonNumber}?api_key=${TMDB_API_KEY}`, { next: { revalidate: 86400 } });
        const seasonData = await seasonRes.json();
        
        if (seasonData.status_code === 34) {
          return NextResponse.json({ success: false, error: "Season not found" }, { status: 404 });
        }
        
        // Return episodes array
        return NextResponse.json({
          success: true,
          data: seasonData.episodes || []
        });

      default:
        url = `${TMDB_BASE_URL}/trending/all/week?api_key=${TMDB_API_KEY}`;
    }

    // Global filter constraint
    const minYear = 2000;
    
    // Abstract TMDB limits into customizable frontend limit with global filtering
    const startIdx = (page - 1) * limit;
    const endIdx = startIdx + limit;
    
    let allValidResults: any[] = [];
    let tmdbPage = 1;
    let totalTmdbPages = 1;
    const seenIds = new Set();

    // Loop until we have enough valid results to fulfill 'endIdx'
    while (allValidResults.length < endIdx && tmdbPage <= totalTmdbPages) {
      const pageUrl = `${url}&page=${tmdbPage}`;
      const res = await fetch(pageUrl, { next: { revalidate: 3600 } });
      if (!res.ok) {
        throw new Error(`TMDB error status: ${res.status}`);
      }
      
      const data = await res.json();
      totalTmdbPages = data.total_pages || 1;
      
      const mappedResults = (data.results || []).map(mapTMDBToMovie);
      const validResults = mappedResults.filter((movie: any) => {
        if (exactYear) return movie.year === parseInt(exactYear);
        // Allow if year > 2000, OR if we are actively searching and TMDB is missing the release date (year === 0)
        return movie.year > 2000 || (endpoint === "search" && movie.year === 0);
      });
      
      for (const movie of validResults) {
        if (!seenIds.has(movie.id)) {
          seenIds.add(movie.id);
          allValidResults.push(movie);
        }
      }
      
      tmdbPage++;
      
      // Safety break to prevent infinite loops if a category is extremely sparse
      if (tmdbPage > 40) break;
    }

    // Slice the exact items we need from the aggregated valid results
    const slicedResults = allValidResults.slice(startIdx, endIdx);

    // Calculate total pages for our custom limit
    // We add 1 to allow 'Load More' if we haven't exhausted TMDB pages yet
    const totalCustomPages = Math.ceil(allValidResults.length / limit) + (tmdbPage <= totalTmdbPages ? 1 : 0);

    if (endpoint === 'search') {
      console.log(`[TMDB API] Search query: "${query}", valid results found: ${slicedResults.length}`);
    }

    return NextResponse.json({ 
      success: true, 
      data: slicedResults,
      page: page,
      totalPages: totalCustomPages
    });
  } catch (error: any) {
    console.error("[TMDB API Error]:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
