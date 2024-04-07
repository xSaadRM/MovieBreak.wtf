import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Card.css";
const MovieCard = ({ movie, isCategorized, media_type }) => {
  const navigate = useNavigate();

  const [isHovered, setIsHovered] = useState(false);

  // Check if movie is defined
  if (!movie) {
    return <div>Loading...</div>;
  }

  const handleMouseOver = () => {
    setIsHovered(true);
    // Do something when the movie card is hovered
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Do something when the mouse leaves the movie card
  };

  const handleClick = (movie) => {
    if (isHovered) {
      navigate(`/${media_type ? media_type : movie.media_type}/${movie.id}`);
    }
  };

  return (
    <div
      className="movie"
      onMouseOver={handleMouseOver}
      onMouseLeave={handleMouseLeave}
      onClick={() => handleClick(movie)}
    >
      <div>
        {movie && (
          <p>
            {movie.vote_average
              ? `Rating: ${movie.vote_average.toFixed(1)}`
              : movie.popularity
              ? `Popularity: ${movie.popularity.toFixed(1)}`
              : "N/A"}
          </p>
        )}
      </div>
      <div className="the-card-image">
        {(movie && movie.poster_path) || movie.profile_path ? (
          <img
            src={`https://image.tmdb.org/t/p/w370_and_h556_bestv2${
              movie.poster_path || movie.profile_path
            }`}
            alt={movie.original_title || movie.original_name} // Add alt attribute for accessibility
          />
        ) : (
          <>
            <img src="https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-4-user-grey-d8fe957375e70239d6abdd549fd7568c89281b2179b5f4470e2e12895792dfa5.svg"></img>
            <div className="placeholder-content">No Poster Available</div>
          </>
        )}
      </div>
      <div>
        <span>{movie.original_title || movie.original_name}</span>
        {isCategorized === false ? (
          <h3>
            {movie.media_type}
            {movie.first_air_date
              ? " - " + movie.first_air_date
              : movie.release_date
              ? " - " + movie.release_date
              : ""}
          </h3>
        ) : null}
      </div>
    </div>
  );
};

export default MovieCard;
