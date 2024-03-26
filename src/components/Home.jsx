import Carousel from "./Carousel";
import SearchIcon from "../assets/search.svg";
import { useEffect, useState } from "react";
import  { useNavigate } from "react-router-dom";
import DisableDevtool from "disable-devtool";

const HomePage = () => {
  const navigate = useNavigate();
  const [seachTerm, setSearchTerm] = useState("");
  const [trendingTV, setTrendingTV] = useState("");
  const [trendingMovie, setTrendingMovie] = useState("");
  const [topTV, setTopTV] = useState("");
  const [topMovie, setTopMovie] = useState("");

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
        window.location.href = "/sonic.html";
      },
    });
  }, []);

  useEffect(() => {
    fetchTrendingData();
  }, []);

  return (
    <>
      <div className="app">
        <h1>MovieBreak</h1>
        <form
          className="search"
          onSubmit={(e) => {
            e.preventDefault();
            navigate(`/search?title=${seachTerm}`);
          }}
        >
          <input
            placeholder="Seach for movies"
            value={seachTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
            <img src={SearchIcon} alt="seach" />
          </button>
        </form>
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
