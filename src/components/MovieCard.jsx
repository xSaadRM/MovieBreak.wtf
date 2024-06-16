import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Card.css";
import LazyImage from "./LazyImage";
import Star from "@mui/icons-material/Star";
import WatchLater from "@mui/icons-material/WatchLater";
import noProfile from "../assets/noProfilePicture.png";
import noPoster from "../assets/noPoster.jpeg";

const MovieCard = ({ movie, isCategorized, media_type }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const mediaType = movie?.media_type || media_type;
  const [tmdbID, season, ep] = movie?.uid
    ? movie?.uid.split("-").concat([null, null, null])
    : [null, null, null];

  const handleMouseOver = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleClick = () => {
    if (mediaType !== "person") {
      if (isHovered) {
        navigate(
          `/${mediaType}/${movie.id}/${season ? season : ""}${
            ep ? `?ep=${ep}` : ""
          }`
        );
      }
    }
  };

  return (
    <>
      {movie && (
        <div
          className={"movie" + (mediaType === "person" ? " round" : "")}
          onMouseOver={handleMouseOver}
          onMouseLeave={handleMouseLeave}
        >
          <div className="the-card-image" onClick={handleClick}>
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
                ratio={"185/278"}
                src={mediaType === "person" ? noProfile : noPoster}
                alt={movie.name || "no-picture"}
              />
            )}
            <p className="badge topLeft">
              {!movie?.uid ? (
                <>
                  <Star htmlColor="yellow" fontSize="auto" />
                  {(movie.vote_average || movie.popularity)?.toFixed(1)}
                </>
              ) : (
                <WatchLater fontSize="auto" />
              )}
            </p>

            {!isCategorized && movie.media_type && mediaType !== "person" && (
              <p className="badge bottomRight">
                {movie.media_type.toUpperCase()}
              </p>
            )}

            {!movie?.uid && (movie.first_air_date || movie.release_date) ? (
              <p className="releaseDate">
                {(movie.first_air_date || movie.release_date).split("-")[0]}
              </p>
            ) : season || ep ? (
              <p className="releaseDate">{"S" + season + " E" + ep}</p>
            ) : null}
            {movie.playbackTime ? (
              <div className="progressBar">
                <div
                  style={{
                    width: ((movie.movieDuration / movie.playbackTime) / 100) + "%",
                  }}
                ></div>
              </div>
            ) : null}
          </div>
          <div className="movieTitle">
            <span>{movie.title || movie.name}</span>
          </div>
        </div>
      )}
    </>
  );
};

export default MovieCard;
