import "../styles/home.css";
import { createSignal, For } from "solid-js";
import { Carousel, HeroCarousel } from "../Components/carousel";
import { getFullAPIUrl } from "../Utils/tmdb";

const Home = () => {
  const [carousels, setCarousels] = createSignal([]);
  const [hero, setHero] = createSignal([]);

  const fetchMovies = async () => {
    const list = [
      {
        url: "https://api.themoviedb.org/3/trending/all/day",
        label: "Trending Today",
      },
      {
        url: "https://api.themoviedb.org/3/movie/popular",
        label: "Popular Movies",
        type: "movie",
      },
    ];
    list.forEach(async (item) => {
      const res = await fetch(getFullAPIUrl(item.url));
      const jwiyson = await res.json();
      setCarousels([
        ...carousels(),
        { type: item.type, label: item.label, data: jwiyson },
      ]);
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
      <HeroCarousel type={"movie"} list={hero()} />
      <For each={carousels()}>
        {(item) => (
          <div class="movieSection">
            <h5 class="label">{item.label}</h5>
            <Carousel type={item.type} list={item.data.results} />
          </div>
        )}
      </For>
    </div>
  );
};

export default Home;
