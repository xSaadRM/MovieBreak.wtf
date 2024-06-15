import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/MovieDescription.css";
import PlayIcon from "../assets/play.svg";
import Navbar from "../components/Navbar";
import Carousel from "../components/Carousel";
import HLSPlayer from "../components/movie-player/HLSPlayer";
import {
  setSeasonDetails,
  setShahid4uEpisodes,
  setSlug,
} from "../reducer/reducer";
import { shahid4uFetch } from "../components/movie-player/providers/shahid4u";
import { getSlug } from "../components/movie-player/providers/ridotv";
import Skeleton from "@mui/material/Skeleton";
import "../styles/MUISkeleton.css";
import LazyImage from "../components/LazyImage";
import { ArrowBack, Star } from "@mui/icons-material";
import Overview from "../components/Overview";
import Clips from "../components/Clips";
import MovieCard from "../components/MovieCard";
const MovieDescription = ({ state, dispatch }) => {
  const navigate = useNavigate();
  const { mediaType, movieID, season } = useParams();
  const [seasons, setSeasons] = useState([]);
  const [showWatchPage, setShowWatchPage] = useState(false);
  const [movieInfos_, setMovieInfos_] = useState(null);
  const releaseDate = /(\d+)-\d+-\d+/g.exec(movieInfos_?.first_air_date);
  const [seasonDetails_, setSeasonDetails_] = useState(null);
  const ep = new URLSearchParams(window.location.search).get("ep");
  const epToWatchDetails = seasonDetails_?.episodes[ep - 1] || null;

  const getShahid4uEpisodes = async () => {
    try {
      const data = await shahid4uFetch(
        mediaType,
        mediaType === "tv" ? movieInfos_.name : movieInfos_.title,
        season,
        releaseDate[1]
      );
      dispatch(setShahid4uEpisodes(data));
    } catch (error) {}
  };

  useEffect(() => {
    const getMovieInfos = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/${mediaType}/${movieID}?api_key=d0e6107be30f2a3cb0a34ad2a90ceb6f&language=en-US&append_to_response=videos,credits,images,external_ids,release_dates&include_image_language=en`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch movie info");
        }
        const movieInfosResponse = await response.json();
        setMovieInfos_(movieInfosResponse);
        dispatch({ type: "SET_MOVIE_INFOS", payload: movieInfosResponse });
        if (mediaType === "tv") {
          const numberOfSeasons = movieInfosResponse.number_of_seasons;
          if (numberOfSeasons > 0) {
            const seasonsArray = [];
            for (let i = 1; i <= numberOfSeasons; i++) {
              seasonsArray.push(i);
            }
            setSeasons(seasonsArray);
          }
        }
      } catch (error) {
        console.error("Error fetching movie info:", error.message);
        // Handle error gracefully, e.g., show a message to the user
      }
    };
    getMovieInfos();
  }, []);

  useEffect(() => {
    const fetchSeasonDetails = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/tv/${movieID}/season/${season}?api_key=d0e6107be30f2a3cb0a34ad2a90ceb6f&language=en-US`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch season details");
        }
        const seasonDetailsResponse = await response.json();
        dispatch(setSeasonDetails(seasonDetailsResponse));
        setSeasonDetails_(seasonDetailsResponse);
      } catch (error) {
        console.error("Error fetching season details:", error.message);
        // Handle error gracefully, e.g., show a message to the user
      }
    };
    if (season) {
      fetchSeasonDetails();
    } else if (mediaType === "tv") {
      handleSeasonChange(1);
    }

    if (movieInfos_ && season) {
      if (movieInfos_) {
        getShahid4uEpisodes();
      }
    }
  }, [season]);

  useEffect(() => {
    const getSlugResponse = async (id, movieName) => {
      try {
        const data = await getSlug(id, movieName);
        dispatch(setSlug(data));
      } catch (e) {
        console.error(e);
      }
    };

    if (movieInfos_ && mediaType === "tv") {
      getShahid4uEpisodes();
      getSlugResponse(
        movieInfos_.id,
        mediaType === "tv" ? movieInfos_.name : movieInfos_.title
      );
    } else if (mediaType === "movie") {
      dispatch(setSlug({ status: 0 }));
    }
  }, [movieInfos_]);

  const handleEpisodeClick = (episodeDetails) => {
    const newUrl = `/${mediaType}/${movieID}/${season}/${episodeDetails.episode_number}`;

    navigate(newUrl);
  };

  const handleWatchClick = () => {
    setShowWatchPage(true);
  };
  const handleSeasonChange = (season) => {
    navigate(`/${mediaType}/${movieID}/${season}`, { replace: true });
  };

  return (
    <>
      {seasonDetails_ && ep && (
        <div className="watchEpisode">
          <div
            className="allEpisodesButton"
            onClick={() => {
              navigate(`/${mediaType}/${movieID}/${ep}`, { replace: true });
            }}
          >
            <ArrowBack />
            <p>All Episodes</p>
          </div>
          <div className="container">
            <MovieCard movie={movieInfos_} />
            <div
              key={epToWatchDetails.id}
              className="episode"
              onClick={() => {
                handleEpisodeClick(
                  epToWatchDetails,
                  movieInfos_.title || movieInfos_.name
                );
              }}
            >
              {/* Episode image */}

              {epToWatchDetails.still_path ? (
                <LazyImage
                  ratio={"16/9"}
                  src={`https://image.tmdb.org/t/p/w400/${epToWatchDetails.still_path}`}
                  alt={`Episode ${epToWatchDetails.episode_number} Still`}
                  className="episode-image"
                />
              ) : (
                <LazyImage
                  ratio={"16/9"}
                  src={
                    "https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-38-picture-grey-c2ebdbb057f2a7614185931650f8cee23fa137b93812ccb132b9df511df1cfac.svg"
                  }
                  alt={`Episode ${epToWatchDetails.episode_number} Still`}
                  className="episode-image"
                  style={{ aspectRatio: "16/9" }}
                />
              )}

              {/* Episode details */}
              <div className="episode-details">
                {epToWatchDetails.episode_number ? (
                  <>
                    <p className="badge topLeft">
                      E{epToWatchDetails.episode_number}
                    </p>
                    <h3 className="text">
                      <p>{epToWatchDetails.name}</p>
                    </h3>
                  </>
                ) : (
                  <Skeleton className="text" variant="text" />
                )}
                {epToWatchDetails.air_date ? (
                  <p className="airdate">{epToWatchDetails.air_date}</p>
                ) : (
                  <Skeleton className="text" variant="text" />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="movie-description-page">
        {movieInfos_ && (
          <div
            className="blured-backdrop"
            style={{
              backgroundImage: `url(https://image.tmdb.org/t/p/original/${movieInfos_.backdrop_path})`,
            }}
          ></div>
        )}
        <div className="movie-description-container">
          {showWatchPage ? (
            <HLSPlayer state={state} />
          ) : (
            <div className="backdrop">
              <LazyImage
                ratio={"16/9"}
                src={`https://image.tmdb.org/t/p/original/${movieInfos_?.backdrop_path}`}
                alt="Backdrop"
              />
              {movieInfos_ && (
                <>
                  <div className="movie-infos">
                    <div className="movie-ids">
                      <h3>{movieInfos_.title || movieInfos_.name}</h3>
                    </div>
                  </div>
                  <p className="badge topLeft rating">
                    <Star htmlColor="yellow" fontSize="auto" />
                    {(
                      movieInfos_.vote_average || movieInfos_.popularity
                    ).toFixed(1)}
                  </p>
                  <p className="releaseDate">
                    {(
                      movieInfos_.first_air_date || movieInfos_.release_date
                    ).split("-")[0] +
                      " / " +
                      (
                        movieInfos_.first_air_date || movieInfos_.release_date
                      ).split("-")[1]}
                  </p>
                </>
              )}
              {mediaType === "movie" && (
                <div
                  className="watch-button"
                  onClick={() => handleWatchClick()}
                >
                  <img src={PlayIcon} alt="Play" />
                  <p>Watch</p>
                </div>
              )}
            </div>
          )}
          <Overview
            overviewText={movieInfos_?.overview}
            genres={movieInfos_?.genres}
          />
          <Clips videos={movieInfos_?.videos?.results} />
          {mediaType === "tv" && (
            <>
              <div className="select-season">
                <select
                  value={season}
                  onChange={(e) => handleSeasonChange(e.target.value)}
                >
                  {seasons.map((season) => (
                    <option key={season} value={season}>
                      Season {season}
                    </option>
                  ))}
                </select>
              </div>
              {seasonDetails_ && (
                <div className="season-details">
                  <div className="episodes-list">
                    {seasonDetails_ &&
                      seasonDetails_.episodes &&
                      seasonDetails_.episodes.map((episode) => (
                        <div
                          key={episode.id}
                          className="episode"
                          onClick={() => {
                            handleEpisodeClick(
                              episode,
                              movieInfos_.title || movieInfos_.name
                            );
                          }}
                        >
                          {/* Episode image */}

                          {episode.still_path ? (
                            <LazyImage
                              ratio={"16/9"}
                              src={`https://image.tmdb.org/t/p/w400/${episode.still_path}`}
                              alt={`Episode ${episode.episode_number} Still`}
                              className="episode-image"
                            />
                          ) : (
                            <LazyImage
                              ratio={"16/9"}
                              src={
                                "https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-38-picture-grey-c2ebdbb057f2a7614185931650f8cee23fa137b93812ccb132b9df511df1cfac.svg"
                              }
                              alt={`Episode ${episode.episode_number} Still`}
                              className="episode-image"
                              style={{ aspectRatio: "16/9" }}
                            />
                          )}

                          {/* Episode details */}
                          <div className="episode-details">
                            {episode.episode_number ? (
                              <>
                                <p className="badge topLeft">
                                  E{episode.episode_number}
                                </p>
                                <h3 className="text">
                                  <p>{episode.name}</p>
                                </h3>
                              </>
                            ) : (
                              <Skeleton className="text" variant="text" />
                            )}
                            {episode.air_date ? (
                              <p className="airdate">{episode.air_date}</p>
                            ) : (
                              <Skeleton className="text" variant="text" />
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        {movieInfos_ && movieInfos_.credits && (
          <div className="cast">
            <Carousel
              movies={movieInfos_.credits.cast}
              media_type={"person"}
              className={"active"}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default MovieDescription;
