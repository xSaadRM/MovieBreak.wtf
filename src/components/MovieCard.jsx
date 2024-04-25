import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Card.css";

const MovieCard = React.memo(({ movie, isCategorized, media_type }) => {
  const navigate = useNavigate();

  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Preload image when movie data changes
  useEffect(() => {
    const image = new Image();
    image.src = `https://image.tmdb.org/t/p/w370_and_h556_bestv2${
      movie.poster_path || movie.profile_path
    }`;
    image.onload = () => setImageLoaded(true);
  }, [movie]);

  const handleMouseOver = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleClick = () => {
    if (isHovered) {
      navigate(`/${media_type ? media_type : movie.media_type}/${movie.id}`);
    }
  };

  return (
    <div
      className="movie"
      onMouseOver={handleMouseOver}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
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
        {(imageLoaded || !movie.poster_path) && (
          <img
            src={`https://image.tmdb.org/t/p/w370_and_h556_bestv2${
              movie.poster_path || movie.profile_path
            }`}
            alt={movie.original_title || movie.original_name}
            onLoad={() => setImageLoaded(true)}
          />
        )}
        {!imageLoaded && !movie.poster_path && (
          <>
            <img
              src="https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-4-user-grey-d8fe957375e70239d6abdd549fd7568c89281b2179b5f4470e2e12895792dfa5.svg"
              alt="No Poster Available"
            />
            <div className="placeholder-content">No Poster Available</div>
          </>
        )}
      </div>
      <div>
        <span>{movie.original_title || movie.original_name}</span>
        {!isCategorized && (
          <h3>
            {movie.media_type}
            {movie.first_air_date
              ? " - " + movie.first_air_date
              : movie.release_date
              ? " - " + movie.release_date
              : ""}
          </h3>
        )}
      </div>
    </div>
  );
});

export default MovieCard;
