import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import "../styles/SearchPage.css";
import SearchIcon from "../assets/search.svg";
import MovieCard from "./MovieCard";

const SearchPage = ({isHomePage}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(
    localStorage.getItem("searchTerm") || ""
  );
  const [movies, setmovies] = useState([]);

  const searchMovie = async (title) => {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/multi?query=${title}&include_adult=false&api_key=d0e6107be30f2a3cb0a34ad2a90ceb6f`
    );
    const data = await response.json();
    setmovies(data.results);
  };

  useEffect(() => {
    localStorage.setItem("searchTerm", searchTerm);
    if (document.location.pathname === "/search") {
      if (searchTerm) {
        searchMovie(searchTerm);
      }
    }
  }, [searchTerm]);

  return (
    <>
      {document.location.pathname === "/search" && <Navbar />}
      <div className="search-container">
        <form
          className="search"
          onSubmit={async (e) => {
            e.preventDefault();
            navigate("/search");
          }}
        >
          <input
            placeholder="Seach for movies"
            value={!isHomePage ? searchTerm : undefined}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
          />
          <button>
            <img src={SearchIcon} alt="search" />
          </button>
        </form>
      </div>

      <div className="container">
        {movies ? (
          movies.map((movie) => (
            <MovieCard movie={movie} key={movie.id} isCategorized={false} />
          ))
        ) : (
          <p>No movie found</p>
        )}
      </div>
    </>
  );
};

export default SearchPage;
