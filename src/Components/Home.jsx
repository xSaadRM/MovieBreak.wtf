import "../styles/home.css";
import { createSignal, For } from "solid-js";
import LazyImage from "./LazyImage";
import "../styles/carousel.css";
import { Star } from "@suid/icons-material";

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
            <h5 class="label">Trending Today</h5>
            <div class="carousel flex">
              <For each={item.results}>
                {(movie, index) => (
                  <div class="movie flex">
                    <div className="poster">
                      <div class="badge mediaType">
                        {movie.media_type.toUpperCase()}
                      </div>
                      <div className="badge rating">
                        <Star fontSize="x-small"/>
                        {movie.vote_average.toFixed(2)}
                      </div>
                      <LazyImage
                        ratio="135/202"
                        alt={movie.title || movie.name || "untitled"}
                        src={
                          "https://image.tmdb.org/t/p/original" +
                          movie.poster_path
                        }
                      />
                    </div>

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
