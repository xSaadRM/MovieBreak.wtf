import HomeIcon from "../assets/home.svg";
import "../styles/Navbar.css";
import { useNavigate } from "react-router-dom";

const Navbar = ({ isHomePage }) => {
  const navigate = useNavigate();
  return (
    <>
      {!isHomePage && (
        <div className="navbar">
          <div className="main-navbar">
            <img src={HomeIcon} onClick={() => navigate("/")} alt="Home" />
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
