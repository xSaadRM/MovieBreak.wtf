import { hotMovies } from "../schemas/movieSchemas/hotMovies";
import { movieInfos } from "../schemas/movieSchemas/movieInfos";

// Action types
const SET_TRENDING_SHOWS = "SET_TRENDING_SHOWS";
const SET_TOP_SHOWS = "SET_TOP_SHOWS";
const SET_TRENDING_MOVIES = "SET_TRENDING_MOVIES";
const SET_TOP_MOVIES = "SET_TOP_MOVIES";
const SET_MOVIE_INFOS = "SET_MOVIE_INFOS";

// Action creators
export const setTrendingShows = (shows) => ({
  type: SET_TRENDING_SHOWS,
  payload: shows,
});
export const setTopShows = (shows) => ({
  type: SET_TOP_SHOWS,
  payload: shows,
});
export const setTrendingMovies = (movies) => ({
  type: SET_TRENDING_MOVIES,
  payload: movies,
});
export const setTopMovies = (movies) => ({
  type: SET_TOP_MOVIES,
  payload: movies,
});
export const setMovieInfos = (infos) => ({
  type: SET_MOVIE_INFOS,
  payload: infos,
});

export const initialState = {
  movieInfos: movieInfos,
  trendingShows: hotMovies,
  trendingMovies: hotMovies,
  topShows: hotMovies,
  topMovies: hotMovies,
};

// Reducer function
export const reducer = (state, action) => {
  switch (action.type) {
    case SET_MOVIE_INFOS:
      return {
        ...state,
        movieInfos: action.payload,
      };
    case SET_TRENDING_SHOWS:
      return {
        ...state,
        trendingShows: action.payload,
      };
    case SET_TOP_SHOWS:
      return {
        ...state,
        topShows: action.payload,
      };
    case SET_TRENDING_MOVIES:
      return {
        ...state,
        trendingMovies: action.payload,
      };
    case SET_TOP_MOVIES:
      return {
        ...state,
        topMovies: action.payload,
      };
    default:
      return state;
  }
};
