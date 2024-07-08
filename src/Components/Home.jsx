import "../styles/home.css";
import { createSignal, For } from "solid-js";
import LazyImage from "./LazyImage";

const tmdbAPIKey = import.meta.env.VITE_TMDB_API_KEY;

const Home = () => {
  const [carousels, setCarousels] = createSignal([]);

  const fetchMovies = async () => {
    const res = await fetch(
      "https://api.themoviedb.org/3/trending/all/day?language=en-US" +
        "&api_key=" +
        tmdbAPIKey
    );

    const jwiyson = await res.json();
    setCarousels((prev) => [...prev, jwiyson]);
  };

  fetchMovies();

  return (
    <div class="homePage">
      <For each={carousels()}>
        {(item, index) => (
          <div class="movieSection">
            <h5>Trending Today</h5>
            <div class="carousel flex">
              <For each={item.results}>
                {(movie, index) => (
                  <div class="movie flex">
                    <LazyImage
                      alt={movie.title || movie.name || "untitled"}
                      src={
                        "https://image.tmdb.org/t/p/original" +
                        movie.poster_path
                      }
                    ><div className="shadow"></div></LazyImage>
                    <div className="title">
                      <p className="text">{movie.title || movie.name}</p>
                    </div>
                    <div className="title">
                      <p className="text">{movie.title || movie.name}</p>
                    </div>
                  </div>
                )}
              </For>
            </div>
          </div>
        )}
      </For>
    </div>
  );
};

export default Home;
