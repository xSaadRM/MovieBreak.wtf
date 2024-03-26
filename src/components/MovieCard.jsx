import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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
        <p>{`Rating: ${
          movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"
        }`}</p>
      </div>
      <div>
        {movie.poster_path ? (
          <img
            src={`https://image.tmdb.org/t/p/w370_and_h556_bestv2${movie.poster_path}`}
            alt={movie.original_title || movie.original_name} // Add alt attribute for accessibility
          />
        ) : (
          <div className="placeholder-content">No Poster Available</div>
        )}
      </div>
      <div>
        <span>{movie.original_title || movie.original_name}</span>
        {isCategorized === false ? <h3>{movie.media_type}</h3> : null}
      </div>
    </div>
  );
};

export default MovieCard;
