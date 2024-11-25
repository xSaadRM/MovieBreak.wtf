const tmdbAPIKey = import.meta.env.VITE_TMDB_API_KEY;
const lang = "en-US";
const baseUrl = "https://api.themoviedb.org/3";

export const getFullAPIUrl = (path) => {
  return `${baseUrl}${path}?language=${lang}&api_key=${tmdbAPIKey}`;
};
