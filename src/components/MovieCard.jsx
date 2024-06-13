import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Card.css";
import LazyImage from "./LazyImage";
import { Star } from "@mui/icons-material";
import noProfile from "../assets/noProfilePicture.png";
import noPoster from "../assets/noPoster.jpeg";

const MovieCard = ({ movie, isCategorized, media_type }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const mediaType = movie.media_type || media_type;

  const handleMouseOver = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleClick = () => {
    if (mediaType !== "person") {
      if (isHovered) {
        navigate(`/${mediaType}/${movie.id}/`);
      }
    }
  };

  return (
    <>
      <div
        className={"movie" + (mediaType === "person" ? " round" : "")}
        onMouseOver={handleMouseOver}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        <div>_CSS</div>
        <div className="the-card-image">
          <>
            {movie.profile_path || movie.poster_path ? (
              <LazyImage
                ratio={"185/278"}
                src={`https://image.tmdb.org/t/p/w370_and_h556_bestv2${
                  movie.profile_path || movie.poster_path
                }`}
                alt={movie.name}
              />
            ) : (
              <LazyImage
                src={mediaType === "person" ? noProfile : noPoster}
                alt={movie.name || "no-picture"}
              />
            )}
          </>
        </div>

        {movie.first_air_date || movie.release_date ? (
          <p className="releaseDate">
            {(movie.first_air_date || movie.release_date).split("-")[0]}
          </p>
        ) : null}
        {!isCategorized ? (
          <p className="badge_topLeft">{movie.media_type.toUpperCase()}</p>
        ) : (
          <p className="badge_topLeft">
            <Star htmlColor="yellow" fontSize="auto" />
            {(movie.vote_average || movie.popularity).toFixed(1)}
          </p>
        )}
      </div>
      <div className="movieTitle">
        <span>{movie.title || movie.name}</span>
      </div>
    </>
  );
};

export default MovieCard;
