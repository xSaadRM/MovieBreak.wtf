import Carousel from "../components/Carousel";
import { useEffect } from "react";
import {
  setTrendingMovies,
  setTopMovies,
  setTrendingShows,
  setTopShows,
} from "../reducer/reducer";
import { useState } from "react";
import WatchLater from "@mui/icons-material/WatchLater";
import Whatshot from "@mui/icons-material/Whatshot";
import TrendingUp from "@mui/icons-material/TrendingUp";

const HomePage = ({ state, dispatch, groupedMovies, getallMovies }) => {
  const { trendingMovies, topMovies, trendingShows, topShows } = state;
  const [activeSection, setactiveSection] = useState({
    weekTrending: "tv",
    topRated: "tv",
    continueWatch: "tv",
  });
  const [continueWatch, setContinueWatch] = useState({ movies: [], tv: [] });

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

  useEffect(() => {
    getallMovies();
  }, []);
  useEffect(() => {
    let groupedShows = groupedMovies.shows;
    const getLastEpisodes = async () => {
      let lastEpisodes = [];
      Object.keys(groupedShows).forEach((id) => {
        lastEpisodes.push(groupedShows[id][0]);
      });
      lastEpisodes.sort((a, b)=>{
        return b.lastModified - a.lastModified;
      })
      setContinueWatch({ movies: groupedMovies?.movies, tv: lastEpisodes });
    };

    getLastEpisodes();
  }, [groupedMovies]);

  useEffect(() => {
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
    fetchTrendingData();
  }, [dispatch]);

  return (
    <>
      <div className="app">
        {continueWatch.movies || continueWatch.tv ? (
          <>
            <div className="movieSection continueWatch">
              <p>
                <WatchLater />
                Continue Watch
              </p>
              <div className="toggle">
                <span
                  onClick={() => {
                    setactiveSection({
                      ...activeSection,
                      continueWatch: "tv",
                    });
                  }}
                  className={
                    activeSection.continueWatch === "tv" ? "active" : ""
                  }
                >
                  TV
                </span>
                <span
                  onClick={() => {
                    setactiveSection({
                      ...activeSection,
                      continueWatch: "movies",
                    });
                  }}
                  className={
                    activeSection.continueWatch === "movies" ? "active" : ""
                  }
                >
                  Movies
                </span>
              </div>
            </div>
            <Carousel
              movies={continueWatch.tv}
              className={activeSection.continueWatch === "tv" ? "active" : ""}
              type={"continueWatch"}
            />
            <Carousel
              movies={continueWatch.movies}
              className={
                activeSection.continueWatch === "movies" ? "active" : ""
              }
              type={"continueWatch"}
            />
          </>
        ) : null}

        <div className="movieSection">
          <p>
            <Whatshot htmlColor="red" />
            Trending this week
          </p>
          <div className="toggle">
            <span
              onClick={() => {
                setactiveSection({
                  ...activeSection,
                  weekTrending: "tv",
                });
              }}
              className={activeSection.weekTrending === "tv" ? "active" : ""}
            >
              TV
            </span>
            <span
              onClick={() => {
                setactiveSection({
                  ...activeSection,
                  weekTrending: "movies",
                });
              }}
              className={
                activeSection.weekTrending === "movies" ? "active" : ""
              }
            >
              Movies
            </span>
          </div>
        </div>
        <Carousel
          className={activeSection.weekTrending === "tv" ? "active" : ""}
          movies={trendingShows}
        />
        <Carousel
          className={activeSection.weekTrending === "movies" ? "active" : ""}
          movies={trendingMovies}
        />
        <div className="movieSection">
          <p>
            <TrendingUp />
            Top rated
          </p>
          <div className="toggle">
            <span
              onClick={() => {
                setactiveSection({
                  ...activeSection,
                  topRated: "tv",
                });
              }}
              className={activeSection.topRated === "tv" ? "active" : ""}
            >
              TV
            </span>
            <span
              onClick={() => {
                setactiveSection({
                  ...activeSection,
                  topRated: "movies",
                });
              }}
              className={activeSection.topRated === "movies" ? "active" : ""}
            >
              Movies
            </span>
          </div>
        </div>
        <Carousel
          className={activeSection.topRated === "tv" ? "active" : ""}
          movies={topShows}
          media_type={"tv"}
        />
        <Carousel
          className={activeSection.topRated === "movies" ? "active" : ""}
          movies={topMovies}
          media_type={"movie"}
        />
      </div>
    </>
  );
};

export default HomePage;
