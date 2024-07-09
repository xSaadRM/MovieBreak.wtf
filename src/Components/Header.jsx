import "../styles/header.css";
import logo from "../assets/logo.png";
import NightsStayIcon from "@suid/icons-material/NightsStay";
import LightMode from "@suid/icons-material/LightMode";
import MenuSharp from "../Components/MenuSharp";

const Header = () => {
  const toggleMenu = (event) => {
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
            <div class="anim2 leftMenu flex glowContain">
              <a>Home</a>
              <a>TV Shows</a>
              <a>Movies</a>
              <a>Watchlist</a>
              <a>History</a>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
