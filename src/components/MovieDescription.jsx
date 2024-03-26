import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ScaleLoader from "react-spinners/ScaleLoader";

import Playerjs from "../Player"; // Import Playerjs library
import DisableDevtool from "disable-devtool";
import "../styles/MovieDescription.css";

const MovieDescription = () => {
  const navigate = useNavigate();

  const { mediaType, movieID, season } = useParams();
  const [movieInfos, setMovieInfos] = useState("");
  const [streamVideo, setStreamVideo] = useState("");
  const [subtitles, setSubtitles] = useState("");
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState("");
  const [seasonDetails, setSeasonDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [allServersFailed, setAllServersFailed] = useState(false);
  const [PlaybackError, setPlaybackError] = useState(false);

  useEffect(() => {
    DisableDevtool({
      ondevtoolopen: () => {
        window.location.href = "/sonic";
      },
    });
  }, []);

  const fetchStreamURL = async (episodeNumber) => {
    try {
      const response = await fetch(
        `https://embed.smashystream.com/data.php?tmdb=${movieID}${
          selectedSeason && `&season=${selectedSeason}&episode=${episodeNumber}`
        }`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch stream URL");
      }
      const data = await response.json();
      const streamURLArray = data.url_array; // Assuming the response directly provides the stream URL
      fetchFromServers(streamURLArray);
    } catch (error) {
      console.error("Error fetching stream URL:", error.message);
      // Handle error gracefully, e.g., show a message to the user
    }
  };
  // Handle episode click
  const handleEpisodeClick = (episodeNumber) => {
    setLoading(true);
    const newUrl = `/${mediaType}/${movieID}/${selectedSeason}/${episodeNumber}`;
    // Push the new URL to the history stack
    navigate(newUrl);
    fetchStreamURL(episodeNumber);
  };

  const fetchFromServers = async (urlArray) => {
    let failedAttempts = 0;
    let videoSet = false;
    let subtitlesSet = false;

    for (let i = 0; i < urlArray.length; i++) {
      try {
        const streamResponse = await fetch(urlArray[i].url);

        if (streamResponse.ok) {
          const streamData = await streamResponse.json();
          const sourceUrls = streamData.sourceUrls;
          const subtitleUrls = streamData.subtitleUrls;

          if (sourceUrls && sourceUrls.length > 0 && !videoSet) {
            const streamURL = sourceUrls[0];
            setStreamVideo(streamURL);
            videoSet = true; // Mark video as set
          }

          if (subtitleUrls && subtitleUrls.length > 0 && !subtitlesSet) {
            setSubtitles(subtitleUrls);
            subtitlesSet = true; // Mark subtitles as set
          }

          // If both video and subtitles are set, break the loop
          if (videoSet && subtitlesSet) {
            break;
          }
        }
      } catch (error) {
        console.error("Error fetching stream URL:", error.message);
        failedAttempts++;
      }

    }

    if (failedAttempts === urlArray.length) {
      setAllServersFailed(true);
    }
  };

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
    } catch (error) {
      console.error("Error fetching season details:", error.message);
      // Handle error gracefully, e.g., show a message to the user
    }
  };

  const getMovieInfos = async () => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/${mediaType}/${movieID}?api_key=d0e6107be30f2a3cb0a34ad2a90ceb6f&language=en-US&append_to_response=videos,images&include_adult=false`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch movie info");
      }
      const movieInfosResponse = await response.json();
      setMovieInfos(movieInfosResponse);
      if (mediaType === "tv") {
        const numberOfSeasons = movieInfosResponse.number_of_seasons;
        if (numberOfSeasons > 0) {
          const seasonsArray = [];
          for (let i = 1; i <= numberOfSeasons; i++) {
            seasonsArray.push(i);
          }
          setSeasons(seasonsArray);
        }
        if (season) {
          setSelectedSeason(season);
        }
      }
    } catch (error) {
      console.error("Error fetching movie info:", error.message);
      // Handle error gracefully, e.g., show a message to the user
    }
  };

  const handleSeasonChange = (event) => {
    setSelectedSeason(event.target.value);
    navigate(`/${mediaType}/${movieID}/${event.target.value}`);
  };
  useEffect(() => {
    if (selectedSeason !== "") {
      fetchSeasonDetails();
    }
  }, [selectedSeason]);

  useEffect(() => {
    if (mediaType === "movie") {
      setLoading(true);
      fetchStreamURL();
    }
  }, []); // Run useEffect only once after component mounts

  useEffect(() => {
    getMovieInfos();
  }, []);

  useEffect(() => {
    if (streamVideo) {
      setLoading(false);
      var player = new Playerjs({
        id: "player",
        file: streamVideo,
        subtitle: subtitles,
      });

      const playerElement = document.getElementById("player");
      if (playerElement) {
        playerElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }

      // Function to handle player events
      function handlePlayerEvents(event, id, data) {
        // Handle different events
        switch (event) {
          case "play":
            console.log("Playback started");
            break;
          case "pause":
            console.log("Playback paused");
            // You can perform actions when playback is paused
            break;
          case "error":
            console.error("Playback error:", data);
            setPlaybackError(true);

            // Handle playback errors
            break;

          // Add more cases for other events as needed
          default:
            // Handle other events
            break;
        }
      }

      // Listen for player events
      window.PlayerjsEvents = handlePlayerEvents;
    }
  }, [streamVideo, subtitles]);

  return (
    <div className="movie-desc-container">
      <div className="backdrop">
        {/* Background image */}
        <img
          src={`https://image.tmdb.org/t/p/original/${movieInfos.backdrop_path}`}
          alt="Backdrop"
        />

        {/* Movie information */}
        <div className="movie-infos">
          <h3>{movieInfos.first_air_date || movieInfos.release_date}</h3>
          <div className="movie-ids">
            <p>{movieInfos.original_title || movieInfos.original_name}</p>
            {mediaType === "tv" &&
              movieInfos.created_by &&
              movieInfos.created_by.length > 0 && (
                <span>by {movieInfos.created_by[0].name}</span>
              )}
          </div>
        </div>
      </div>

      {/* Select season */}
      {mediaType === "tv" && (
        <div className="select-season">
          <select value={selectedSeason} onChange={handleSeasonChange}>
            <option value="">Select Season</option>
            {seasons.map((season) => (
              <option key={season} value={season}>
                Season {season}
              </option>
            ))}
          </select>
        </div>
      )}
      <>
        {loading ? (
          <div className="loading-animation">
            <ScaleLoader
              color="blue"
              loading={loading}
              size={150}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div>
        ) : (
          allServersFailed && (
            <div>
              <p>this ressource is not found on any server</p>
            </div>
          )
        )}
      </>
      <div id="player"></div>
      {/* Season details */}
      {seasonDetails && (
        <div className="season-details">
          <h2>{seasonDetails.name}</h2>
          <p>{seasonDetails.overview}</p>
          <div className="episodes-list">
            {seasonDetails.episodes.map((episode) => (
              <div
                key={episode.id}
                className="episode"
                onClick={() => handleEpisodeClick(episode.episode_number)}
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
                    Episode {episode.episode_number} - {episode.name}
                  </h3>
                  <p className="overview">{episode.overview}</p>
                  <p className="airdate">Air Date: {episode.air_date}</p>
                  {/* Add more details if needed */}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDescription;
