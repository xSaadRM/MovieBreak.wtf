import Carousel from "./Carousel";
import { useEffect, useState } from "react";
import DisableDevtool from "disable-devtool";
import SearchPage from "./SearchPage";
import Navbar from "./Navbar";

const HomePage = () => {
  const [trendingTV, setTrendingTV] = useState("");
  const [trendingMovie, setTrendingMovie] = useState("");
  const [topTV, setTopTV] = useState("");
  const [topMovie, setTopMovie] = useState("");
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
    setTrendingMovie(trendingMovies);

    const trendingTVShows = await getTrending("tv");
    setTrendingTV(trendingTVShows);

    const topMovie = await getTop("movie");
    setTopMovie(topMovie);

    const topTV = await getTop("tv");
    setTopTV(topTV);
  };

  useEffect(() => {
    DisableDevtool({
      ondevtoolopen: () => {
        if (!devtoolsDetected) {
          setDevtoolsDetected(true);
          window.location.href = "/sonic.html";
        }
      },
    });
  }, [devtoolsDetected]);

  useEffect(() => {
    fetchTrendingData();
  }, []);

  return (
    <>
      <div className="app">
        <Navbar />
        <SearchPage isHomePage={true}/>
        <Carousel
          movies={trendingTV}
          media_type={"tv"}
          type="TV Shows"
          category={"Trending"}
        />
        <Carousel
          movies={trendingMovie}
          media_type={"movie"}
          type="Movies"
          category={"Trending"}
        />
        <Carousel
          movies={topTV}
          media_type={"tv"}
          type="TV Shows"
          category={"Top Rated"}
        />
        <Carousel
          movies={topMovie}
          media_type={"movie"}
          type="Movies"
          category={"Top Rated"}
        />
      </div>
    </>
  );
};

export default HomePage;
