import "../styles/Navbar.css";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import HomeIcon from "@mui/icons-material/Home";
const Navbar = () => {
  const navigate = useNavigate();
  return (
    <>
      <header>
        <div className="site-name">
          <h1>MovieBreak</h1>
        </div>
        <div className="navbar">
          {window.location.pathname !== "/search" && (
            <div onClick={() => navigate("/search")}>
              <SearchIcon />
            </div>
          )}
          {window.location.pathname !== "/" && (
            <div onClick={() => navigate("/")}>
              <HomeIcon />
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Navbar;
