import "../styles/home.css";
import { createSignal } from "solid-js";

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
      {carousels().map((item) => (
        <>
        <h5>Trending Today</h5>
          <div class="carousel flex">
            {item.results.map((movie) => {
              return (
                <div class="movie flex">
                  <img
                    alt={movie.title || movie.name || "untitled"}
                    src={
                      "https://image.tmdb.org/t/p/original" + movie.poster_path
                    }
                  />
                  <div className="title">
                    <p className="text">{movie.title || movie.name}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ))}
    </div>
  );
};

export default Home;
