import "../styles/home.css";
import { createSignal, For } from "solid-js";
import Carousel from "./Caousel";

const tmdbAPIKey = import.meta.env.VITE_TMDB_API_KEY;

const Home = () => {
  const [carousels, setCarousels] = createSignal([]);
  const lang = "en-US";

  const fetchMovies = async () => {
    const list = [
      {
        url: "https://api.themoviedb.org/3/trending/all/day",
        label: "Trending Today",
      },
      {
        url: "https://api.themoviedb.org/3/movie/popular",
        label: "Popular Movies",
      },
    ];
    list.forEach(async (item) => {
      const res = await fetch(
        `${item.url}?language=${lang}&api_key=${tmdbAPIKey}`
      );
      const jwiyson = await res.json();
      setCarousels([...carousels(), { label: item.label, data: jwiyson }]);
    });
  };

  fetchMovies();

  return (
    <div class="homePage">
      <For each={carousels()}>
        {(item, index) => (
          <div class="movieSection">
            <h5 class="label">{item.label}</h5>
            <Carousel list={item.data.results} />
          </div>
        )}
      </For>
    </div>
  );
};

export default Home;
