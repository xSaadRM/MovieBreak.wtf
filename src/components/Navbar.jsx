import HomeIcon from "../assets/home.svg";
import MenuIcon from "../assets/menu.svg";
import "../styles/Navbar.css";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <>
      <header>
        <div className="site-name">
          <h1>MovieBreak</h1>
        </div>
        <div className="navbar">
          <div className="main-navbar">
            {window.location.pathname !=="/" && (
                <img src={HomeIcon} alt="home" onClick={() => navigate("/")} />
              )}
            {/* <img src={MenuIcon} alt="menu" /> */}
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
