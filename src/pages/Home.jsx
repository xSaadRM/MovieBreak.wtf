import Carousel from "../components/Carousel";
import { useEffect, useReducer, useState } from "react";
import DisableDevtool from "disable-devtool";
import SearchPage from "../components/SearchPage";
import Navbar from "../components/Navbar";
import {
  initialState,
  reducer,
  setTrendingMovies,
  setTopMovies,
  setTrendingShows,
  setTopShows,
} from "../reducer/reducer";

const HomePage = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { trendingMovies, topMovies, trendingShows, topShows } = state;
  const [devtoolsDetected, setDevtoolsDetected] = useState(false);
  const getTrending = async (type) => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/trending/${type}/week?include_adult=false&api_key=d0e6107be30f2a3cb0a34ad2a90ceb6f&language=en-US&page=1`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch trending movies");
      }
      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error("Error fetching trending movies:", error.message);
      // Handle error gracefully, e.g., show a message to the user
    }
  };

  const getTop = async (type) => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/${type}/top_rated?api_key=d0e6107be30f2a3cb0a34ad2a90ceb6f&language=en-US&include_adult=false`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch trending movies");
      }
      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error("Error fetching trending movies:", error.message);
      // Handle error gracefully, e.g., show a message to the user
    }
  };

  const fetchTrendingData = async () => {
    const trendingMovies = await getTrending("movie");
    dispatch(setTrendingMovies(trendingMovies));

    const trendingTVShows = await getTrending("tv");
    dispatch(setTrendingShows(trendingTVShows));

    const topMovie = await getTop("movie");
    dispatch(setTopMovies(topMovie));

    const topTVResponse = await getTop("tv");
    dispatch(setTopShows(topTVResponse));
  };

  useEffect(() => {
    fetchTrendingData();
  }, []);

  useEffect(() => {
    // DisableDevtool({
    //   ondevtoolopen: () => {
    //     if (!devtoolsDetected) {
    //       setDevtoolsDetected(true);
    //       window.location.href = "/sonic.html";
    //     }
    //   },
    // });
  }, [devtoolsDetected]);

  return (
    <>
      <div className="app">
        <Navbar />
        <SearchPage isHomePage={true} />
        <Carousel
          movies={trendingShows}
          media_type={"tv"}
          type="TV Shows"
          category={"Trending"}
        />
        <Carousel
          movies={trendingMovies}
          media_type={"movie"}
          type="Movies"
          category={"Trending"}
        />
        <Carousel
          movies={topShows}
          media_type={"tv"}
          type="TV Shows"
          category={"Top Rated"}
        />
        <Carousel
          movies={topMovies}
          media_type={"movie"}
          type="Movies"
          category={"Top Rated"}
        />
      </div>
    </>
  );
};

export default HomePage;
