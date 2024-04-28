import { Suspense, useEffect, useReducer, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DisableDevtool from "disable-devtool";
import "../styles/MovieDescription.css";
import PlayIcon from "../assets/play.svg";
import Navbar from "../components/Navbar";
import Carousel from "../components/Carousel";
import WatchPage from "./WatchPage";
import LoadingAnimation from "../components/LoadingAnimation";
import { reducer, initialState } from "../reducer/reducer";

const MovieDescription = () => {
  const navigate = useNavigate();
  const { mediaType, movieID, season } = useParams();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { movieInfos } = state;
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState("");
  const [isOverviewAllShowed, setIsOverviewAllShowed] = useState(false);
  const [wordsInOverview, setWordsInOverview] = useState(13);
  const [currentSection, setCurrentSection] = useState("overview");
  const [seasonDetails, setSeasonDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showWatchPage, setShowWatchPage] = useState(false);
  const [devtoolsDetected, setDevtoolsDetected] = useState(false);

  useEffect(() => {
    // DisableDevtool({
    //   ondevtoolopen: () => {
    //     if (!devtoolsDetected) {
    //       setDevtoolsDetected(true);
    //       window.location.href = "/sonic.html";
    //     }
    //   },
    // });
  }, [devtoolsDetected]);

  const handleSeasonChange = (season) => {
    setSelectedSeason(season);
  };
  useEffect(() => {
    if (window.innerWidth >= 800) {
      setWordsInOverview(50);
    }

    const getMovieInfos = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/${mediaType}/${movieID}?api_key=d0e6107be30f2a3cb0a34ad2a90ceb6f&language=en-US&append_to_response=videos,credits,images,external_ids,release_dates&include_image_language=en`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch movie info");
        }
        const movieInfosResponse = await response.json();
        dispatch({ type: "SET_MOVIE_INFOS", payload: movieInfosResponse });
        console.log(movieInfosResponse);
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
    if (mediaType === "tv") {
      if (season) {
        setSelectedSeason(season);
      }
    }
  }, [mediaType, movieID, season]);

  const handleSectionClick = (name) => {
    if (name !== currentSection) {
      setCurrentSection(name);
    }
  };

  useEffect(() => {
    const fetchSeasonDetails = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/tv/${movieID}/season/${selectedSeason}?api_key=d0e6107be30f2a3cb0a34ad2a90ceb6f&language=en-US`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch season details");
        }
        const seasonDetailsResponse = await response.json();
        setSeasonDetails(seasonDetailsResponse);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching season details:", error.message);
        // Handle error gracefully, e.g., show a message to the user
      }
    };

    if (selectedSeason) {
      setLoading(true);
      navigate(`/${mediaType}/${movieID}/${selectedSeason}`);
      fetchSeasonDetails();
    }
  }, [selectedSeason]);

  const handleEpisodeClick = (episodeDetails, movieName) => {
    setLoading(true);
    const newUrl = `/${mediaType}/${movieID}/${selectedSeason}/${episodeDetails.episode_number}`;
    navigate(newUrl, {
      state: { episodeDetails, movieName },
    });
  };

  const handleWatchClick = () => {
    setShowWatchPage(true);
  };

  return (
    <div className="movie-description-page">
      <Navbar />
      <LoadingAnimation loading={loading} />
      <div
        className="blured-backdrop"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original/${movieInfos.backdrop_path})`,
        }}
      ></div>
      <div className="movie-description-container">
        <div className="backdrop">
          <img
            src={`https://image.tmdb.org/t/p/original/${movieInfos.backdrop_path}`}
            alt="Backdrop"
          />
          <div className="movie-infos">
            <div className="movie-ids">
              <h3>{movieInfos.original_title || movieInfos.original_name}</h3>
              <p>{movieInfos.first_air_date || movieInfos.release_date}</p>
            </div>
          </div>
          {mediaType === "movie" && (
            <div className="watch-button" onClick={() => handleWatchClick()}>
              <img src={PlayIcon} alt="Play" />
              <p>Watch</p>
            </div>
          )}
        </div>
        {movieInfos && (
          <>
            <div className="sections-container">
              <div className="sections">
                <div
                  onClick={() => handleSectionClick("overview")}
                  className={
                    currentSection === "overview" ? "section active" : "section"
                  }
                >
                  <h4>Overview</h4>
                </div>
                <div
                  onClick={() => handleSectionClick("clips")}
                  className={
                    currentSection === "clips" ? "section active" : "section"
                  }
                >
                  <h4>Clips</h4>
                </div>
              </div>
              {currentSection === "overview" && (
                <div className="overview">
                  <p>
                    {!isOverviewAllShowed
                      ? movieInfos.overview
                          .split(" ")
                          .slice(0, wordsInOverview)
                          .join(" ") + "...."
                      : movieInfos.overview}
                    {!isOverviewAllShowed ? (
                      <span
                        className="show-more-toggle"
                        onClick={setIsOverviewAllShowed}
                      >
                        Show more
                      </span>
                    ) : null}
                  </p>
                </div>
              )}
              {currentSection === "clips" && (
                <div className="clips">
                  {movieInfos.videos.results.map((clip) => (
                    <div className="clip" key={clip.id}>
                      <a
                        href={`https://www.youtube.com/watch?v=${clip.key}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={`https://img.youtube.com/vi/${clip.key}/mqdefault.jpg`}
                          alt={clip.name}
                        />
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
        <Suspense fallback={<LoadingAnimation loading={true} />}>
          {showWatchPage && <WatchPage />}
        </Suspense>
        {mediaType === "tv" && (
          <div className="select-season">
            <select
              value={selectedSeason}
              onChange={(e) => handleSeasonChange(e.target.value)}
            >
              <option value="">Select Season</option>
              {seasons.map((season) => (
                <option key={season} value={season}>
                  Season {season}
                </option>
              ))}
            </select>
          </div>
        )}
        {seasonDetails && (
          <div className="season-details">
            <div className="episodes-list">
              {seasonDetails.episodes &&
                seasonDetails.episodes.map((episode) => (
                  <div
                    key={episode.id}
                    className="episode"
                    onClick={() => {
                      handleEpisodeClick(
                        episode,
                        movieInfos.title || movieInfos.name
                      );
                    }}
                  >
                    {/* Episode image */}
                    <img
                      src={`https://image.tmdb.org/t/p/w400/${episode.still_path}`}
                      alt={`Episode ${episode.episode_number} Still`}
                      className="episode-image"
                    />

                    {/* Episode details */}
                    <div className="episode-details">
                      <h3>
                        E{episode.episode_number} - {episode.name}
                      </h3>
                      <p className="airdate">{episode.air_date}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
      {movieInfos && movieInfos.credits && (
        <div className="cast">
          <Carousel
            movies={movieInfos.credits.cast}
            type={"Cast"}
            media_type={"cast"}
            category={"Credits"}
          />
        </div>
      )}
    </div>
  );
};

export default MovieDescription;
