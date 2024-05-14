import React, { useState, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Card.css";
import fallbackImage from "../assets/noPoster.jpeg";

const MovieCard = ({ movie, isCategorized, media_type }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseOver = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleClick = () => {
    if (isHovered) {
      navigate(
        `/${media_type ? media_type : movie.media_type}/${movie.id}/${
          (media_type || movie.media_type) == "tv" ? "1" : ""
        }`
      );
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
        <img
          src={
            movie.poster_path || movie.profile_path
              ? `https://image.tmdb.org/t/p/w370_and_h556_bestv2${
                  movie.poster_path || movie.profile_path
                }`
              : fallbackImage
          }
          alt={movie.original_title || movie.original_name}
        />
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
};

export default MovieCard;
