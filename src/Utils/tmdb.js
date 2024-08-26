const tmdbAPIKey = import.meta.env.VITE_TMDB_API_KEY;
const lang = "en-US";

export const getFullAPIUrl = (baseUrl) => {
  return `${baseUrl}?language=${lang}&api_key=${tmdbAPIKey}`;
};
