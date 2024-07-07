import "./App.css";
import logo from "./assets/logo.png";
import NightsStayIcon from "@suid/icons-material/NightsStay";
import LightMode from "@suid/icons-material/LightMode";
import MenuSharp from "./Components/MenuSharp";
import { createSignal } from "solid-js";

const tmdbAPIKey = import.meta.env.tmdbAPIKey;

function App() {
  const [movies, setMovies] = createSignal({ popularMovies: {} });

  const fetchMovies = async () => {
    const res = await fetch(
      "https://api.themoviedb.org/3/trending/all/day?language=en-US" +
        "&api_key=" +
        tmdbAPIKey
    );

    const jwiyson = await res.json();
    setMovies((prev) => ({ ...prev, popularMovies: jwiyson }));
  };
  fetchMovies();

  const toggleMenu = (event) => {
    console.log(movies());
    const menuSharp = event.target.closest(".MenuSharpIcon");

    if (menuSharp) {
      menuSharp.classList.toggle("active");
    }
  };

  return (
    <div>
      <header class="flex">
        <div class="brand flex">
          <div class="siteLogo">
            <img src={logo} />
          </div>
          <p class="siteName">MovieBreak</p>
        </div>
        <div class="headerLeftSide flex">
          <div
            class="themeSwitcher glow"
            onclick={() => {
              const nextTheme =
                document.documentElement.getAttribute("data-theme") === "dark"
                  ? "light"
                  : "dark";
              document.documentElement.setAttribute("data-theme", nextTheme);
            }}
          >
            <LightMode class="lightButton" />
            <NightsStayIcon class="darkButton" />
          </div>
          <div className="leftMenuWrapper flex">
            <MenuSharp class="MenuSharpIcon" onclick={toggleMenu} />
            <div class="leftMenu flex">
              <a>about</a>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
