import { useEffect, useState } from "react";
import MovieCard from "./MovieCard";

const SearchPage = () => {
  const [movies, setmovies] = useState([]);
  const [query, setQuery] = useState("");

  const searchMovie = async (title) => {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/multi?query=${title}&include_adult=false&api_key=d0e6107be30f2a3cb0a34ad2a90ceb6f`
    );
    const data = await response.json();
    setmovies(data.results);
  };

  useEffect(() => {
    // Get the query parameters from the URL
    const queryParams = new URLSearchParams(window.location.search);

    // Get the value of the 'query' parameter
    const queryValue = queryParams.get("title");

    // Set the query state with the value from the URL
    if (queryValue) {
      setQuery(queryValue);
    }
  }, []);
  useEffect(() => {
    searchMovie(query);
  }, [query]);

  return (
    <div className="container">
      {movies.map((movie) => (
        <MovieCard movie={movie} key={movie.id} isCategorized={false} />
      ))}
    </div>
  );
};

export default SearchPage;
