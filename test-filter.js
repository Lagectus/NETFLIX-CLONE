const TMDB_API_KEY = "dd9e1b8d8e37735e79648fd34e2979c6";

const genreMap = {
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
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
};

function mapTMDBToMovie(item) {
  const mediaType = item.media_type || (item.name ? 'tv' : 'movie');
  
  let year = 0;
  if (item.release_date) {
    year = new Date(item.release_date).getFullYear();
  } else if (item.first_air_date) {
    year = new Date(item.first_air_date).getFullYear();
  }
  if (isNaN(year)) year = 0;

  return {
    id: `${mediaType}-${item.id}`,
    title: item.title || item.name || "Untitled Production",
    year
  };
}

async function test() {
  const url = `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&query=India's%20Got%20Latent`;
  const res = await fetch(url);
  const data = await res.json();
  
  console.log("TMDB total_pages:", data.total_pages);
  
  const mappedResults = (data.results || []).map(mapTMDBToMovie);
  console.log("Mapped results:", mappedResults);
  
  const endpoint = "search";
  const validResults = mappedResults.filter((movie) => {
    return movie.year > 2000 || (endpoint === "search" && movie.year === 0);
  });
  
  console.log("Valid results:", validResults);
}

test();
