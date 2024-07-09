import "../styles/home.css";
import { createSignal, For } from "solid-js";
import Carousel from "./Caousel";

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
            <Carousel list={item.results}/>
          </div>
        )}
      </For>
    </div>
  );
};

export default Home;
