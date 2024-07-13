import "../styles/home.css";
import { createSignal, For } from "solid-js";
import Carousel from "../Components/Caousel";
import HeroCarousel from "../Components/HeroCarousel";

const tmdbAPIKey = import.meta.env.VITE_TMDB_API_KEY;
const lang = "en-US";

const Home = () => {
  const [carousels, setCarousels] = createSignal([]);
  const [hero, setHero] = createSignal([]);
  const getFullAPIUrl = (baseUrl) => {
    return `${baseUrl}?language=${lang}&api_key=${tmdbAPIKey}`;
  };

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
      const res = await fetch(getFullAPIUrl(item.url));
      const jwiyson = await res.json();
      setCarousels([...carousels(), { label: item.label, data: jwiyson }]);
    });

    const heroRes = await fetch(
      getFullAPIUrl("https://api.themoviedb.org/3/movie/now_playing")
    );
    const heroJson = await heroRes.json();
    setHero(heroJson.results);
  };

  fetchMovies();

  return (
    <div class="homePage">
      <HeroCarousel list={hero()} />
      <For each={carousels()}>
        {(item) => (
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
