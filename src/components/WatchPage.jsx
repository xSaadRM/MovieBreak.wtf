import { useEffect, useState } from "react";
import "../styles/WatchPage.css";
import React from "react";
import { useParams, useLocation } from "react-router-dom";
import ScaleLoader from "react-spinners/ScaleLoader";
import Playerjs from "../Player"; // Import Playerjs library
import Navbar from "./Navbar";
import DisableDevtool from "disable-devtool";

const WatchPage = () => {
  const location = useLocation();
  const { episodeDetails, movieName } = location.state || {};
  const [sources, setSources] = useState();
  const [activeServer, setActiveServer] = useState(null);
  const [streamVideo, setStreamVideo] = useState("");
  const [subtitles, setSubtitles] = useState("");
  const [loading, setLoading] = useState(false);
  const { mediaType, movieID, season, ep } = useParams();

  useEffect(() => {
    DisableDevtool({
      ondevtoolopen: () => {
        window.location.href = "/sonic.html";
      },
    });
  }, []);

  const handleServerSwitch = async (serverURl) => {
    try {
      setActiveServer(serverURl);
      setLoading(true);
      const response = await fetch(serverURl);
      const data = await response.json();
      setStreamVideo(data.sourceUrls[0]);
      setSubtitles(data.subtitles);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    const fetchStreamURL = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://embed.smashystream.com/data.php?tmdb=${movieID}${
            mediaType === "tv" && season
              ? `&season=${season}&episode=${ep}`
              : ""
          }`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch stream URL");
        }
        const data = await response.json();
        const streamURLArray = data.url_array; // Assuming the response directly provides the stream URL
        setSources(streamURLArray);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching stream URL:", error.message);
      }
      setLoading(false);
    };
    fetchStreamURL();
  }, [mediaType, movieID, season, ep]);
  useEffect(() => {
    if (streamVideo && subtitles) {
      console.log(streamVideo);
      var player = new Playerjs({
        id: "player",
        file: `${streamVideo}`,
        subtitle: subtitles,
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
  }, [streamVideo, subtitles]);

  return (
    <div className="watch-page">
      {loading && (
        <div className="loading-animation">
          <ScaleLoader
            color="blue"
            size={150}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      )}
      <Navbar />
      <div className="movie-description-container">
        {mediaType === "tv" && episodeDetails && (
          <>
            <div className="season-details watch-page">
              <h1>{episodeDetails.name}</h1>
            </div>
            <div
              className="blured-backdrop"
              style={{
                backgroundImage: `url(https://image.tmdb.org/t/p/original/${episodeDetails.still_path})`,
              }}
            ></div>
            <div className="backdrop">
              <img
                src={`https://image.tmdb.org/t/p/original/${episodeDetails.still_path}`}
                alt="Backdrop"
              />
            </div>
          </>
        )}
        {sources && (
          <>
            <div id="player"></div>
            <div className="sources-list">
              <h3>Servers List</h3>
              <div className="sources-container">
                {sources.map((source, index) => {
                  const isActive = source.url === activeServer;
                  return (
                    <div
                      className={isActive ? "active" : ""}
                      key={source.name}
                      onClick={() => handleServerSwitch(source.url)}
                    >
                      {source.name.replace(/Player/g, `${index + 1} -`)}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default WatchPage;
