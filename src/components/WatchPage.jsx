import { useEffect, useState } from "react";
import "../styles/WatchPage.css";
import React from "react";
import { useParams, useLocation } from "react-router-dom";
import ScaleLoader from "react-spinners/ScaleLoader";
import Playerjs from "../Player";
import VideoJS from "./HLSPlayer";
import videojs from "video.js";
import Navbar from "./Navbar";
import DisableDevtool from "disable-devtool";

const WatchPage = () => {
  const location = useLocation();
  const { episodeDetails } = location.state || {};
  const [sources, setSources] = useState();
  const [activeServer, setActiveServer] = useState(null);
  const [streamVideo, setStreamVideo] = useState("");
  const [subtitles, setSubtitles] = useState("");
  const [loading, setLoading] = useState(false);
  const { mediaType, movieID, season, ep } = useParams();
  const [isOverviewAllShowed, setIsOverviewAllShowed] = useState(false);
  const [movieNotFound, setMovieNotFound] = useState(false);
  const hrefDetails = window.location.pathname.split("/");
  const [selectedMirror, setSelectedMirror] = useState("smashy");
  const [devtoolsDetected, setDevtoolsDetected] = useState(false);
  const [streamVideo2, setStreamVideo2] = useState("");
  useEffect(() => {
    DisableDevtool({
      ondevtoolopen: () => {
        if (!devtoolsDetected) {
          setDevtoolsDetected(true);
          window.location.href = "/sonic.html";
        }
      },
    });
  }, [devtoolsDetected]);

  const handleServerSwitch = async (serverURl) => {
    if (activeServer !== serverURl) {
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
    }
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
    const getSlug = async () => {
      const { movieName } = location.state;

      setLoading(true);
      // Manual encoding for characters that aren't encoded in the standard encodeURIComponent function
      const manualEncode = (str) => {
        return Array.from(str)
          .map((char) => {
            const charCode = char.charCodeAt(0);
            // If the character is not alphanumeric or one of these: - _ . ! ~ * ' ( )
            if (
              (charCode >= 0x30 && charCode <= 0x39) || // 0-9
              (charCode >= 0x41 && charCode <= 0x5a) || // A-Z
              (charCode >= 0x61 && charCode <= 0x7a) || // a-z
              char === "-" ||
              char === "_" ||
              char === "." ||
              char === "!" ||
              char === "~" ||
              char === "*" ||
              char === "'" ||
              char === "(" ||
              char === ")"
            ) {
              return char;
            } else {
              return encodeURIComponent(char).replace(/%/g, "%25");
            }
          })
          .join("");
      };

      const encodedMovieName = manualEncode(movieName);

      try {
        const response = await fetch(
          `https://rough.isra.workers.dev/?destination=https%3A%2F%2Fridomovies.tv%2Fcore%2Fapi%2Fsearch%3Fq%3D${encodedMovieName}`,
          {
            headers: {
              accept: "*/*",
              "accept-language": "en-US,en;q=0.9",
              "sec-ch-ua":
                '"Microsoft Edge";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
              "sec-ch-ua-mobile": "?0",
              "sec-ch-ua-platform": '"Windows"',
              "sec-fetch-dest": "empty",
              "sec-fetch-mode": "cors",
              "sec-fetch-site": "cross-site",
            },
            referrerPolicy: "no-referrer",
            body: null,
            method: "GET",
          }
        );
        const data = await response.json();
        let found = false;
        for (const item of data.data.items) {
          if (item.contentable.tmdbId == hrefDetails[2]) {
            getEpisodes(item.slug);
            found = true;
          }
        }
        if (!found) {
          setMovieNotFound(true);
        }
      } catch (error) {
        console.error("Error fetching", error);
      }
    };
    if (selectedMirror === "smashy") {
      fetchStreamURL();
    }
    if (mediaType === "tv" && selectedMirror === "ridotv") {
      getSlug();
    }
  }, [selectedMirror]);

  useEffect(() => {
    if (selectedMirror === "smashy" || (streamVideo && subtitles)) {
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
  }, [streamVideo, subtitles, selectedMirror]);

  const getEpisodes = async (slug) => {
    try {
      const response = await fetch(
        `https://rough.isra.workers.dev/?destination=https%3A%2F%2Fridomovies.tv%2Ftv%2F${slug}`,
        {
          headers: {
            accept: "*/*",
            "accept-language": "en-US,en;q=0.9",
            "sec-ch-ua":
              '"Microsoft Edge";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "cross-site",
          },
          referrerPolicy: "no-referrer",
          body: null,
          method: "GET",
        }
      );

      const htmlContent = await response.text();

      // Regular expression to match the episodes JSON data
      const regex = /"episodes\\":\[(.*?)\]/g;
      const matches = regex.exec(htmlContent);
      if (matches) {
        // Replace backslashes with an empty string
        const cleanJson = matches[1]
          .replace(/\\"/g, `"`)
          .replace(/\\\\"/g, "`");
        // Parse the cleaned JSON string
        const episodesData = JSON.parse(`[${cleanJson}]`);

        // Extract ID and episodeNumber of each episode
        const episodeInfo = episodesData.map((episode) => ({
          id: episode.id,
          episodeNumber: episode.episodeNumber,
        }));

        getIFrame(episodeInfo);
      } else {
        console.log("No episodes found in the HTML content.");
      }
    } catch (error) {
      setMovieNotFound(true);
      console.log(error);
    }
  };
  const getIFrame = async (dataIDs) => {
    if (dataIDs.length > 0 && hrefDetails[4] && dataIDs[hrefDetails[3] - 1]) {
      const episodeId = dataIDs[hrefDetails[4] - 1].id;
      const response = await fetch(
        `https://rough.isra.workers.dev/?destination=https%3A%2F%2Fridomovies.tv%2Fcore%2Fapi%2Fepisodes%2F${episodeId}%2Fvideos`,
        {
          headers: {
            accept: "*/*",
            "accept-language": "en-US,en;q=0.9",
            "sec-ch-ua":
              '"Microsoft Edge";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "cross-site",
          },
          referrerPolicy: "no-referrer",
          body: null,
          method: "GET",
        }
      );
      const data = await response.json();
      const dataIFrameSrc = data.data[0].url.match(/data-src="([^"]+)"/);

      if (dataIFrameSrc) {
        const dataSrcValue = dataIFrameSrc[1];
        getM3U8(dataSrcValue);
      } else {
        console.log("No data-src attribute found in the URL.");
      }
    } else {
    }
  };
  const getM3U8 = async (iFrameURL) => {
    const response = await fetch(
      `https://rough.isra.workers.dev/?destination=${iFrameURL}`,
      {
        headers: {
          accept: "*/*",
          "accept-language": "en-US,en;q=0.9",
          "sec-ch-ua":
            '"Microsoft Edge";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "cross-site",
          "x-referer": "https://ridomovies.tv/",
        },
        referrerPolicy: "no-referrer",
        body: null,
        method: "GET",
      }
    );
    const data = await response.text();
    const scriptTagRegex = /<script[^>]*>(.*?)<\/script>/gs;
    const scriptTags = data.match(scriptTagRegex);
    if (scriptTags) {
      for (const scriptTag of scriptTags) {
        if (scriptTag.includes("jwplayer")) {
          const regex = /file:\s*"(.*?)"/;
          const match = regex.exec(scriptTag);
          if (match) {
            const fileUrl = match[1];
            setStreamVideo2(fileUrl);
            // splitSubtitles(fileUrl);
            break;
          }
        }
      }
    } else {
      console.error("No script tags found");
    }
    setLoading(false);
  };

  const splitSubtitles = async (m3u8) => {
    const response = await fetch(m3u8);
    const blob = await response.blob();
    const reader = new FileReader();

    // Define a function to handle the onload event
    reader.onload = function () {
      const data = reader.result; // This contains the data as a string
      const regex = /#EXT-X-MEDIA:TYPE=SUBTITLES.*?NAME="(.*?)".*?URI="(.*?)"/g;
      let match;
      let subtitlesArray = [];
      const baseurl = m3u8.split("/");

      while ((match = regex.exec(data))) {
        baseurl[baseurl.length - 1] = match[2];
        const label = `[${match[1]}]`;

        // Encode the file URL
        const encodedFileUrl = encodeURIComponent(baseurl);

        subtitlesArray.push(`${label}${encodedFileUrl}`);
      }
      setSubtitles(subtitlesArray.toString());
    };

    // Read the blob as text
    reader.readAsText(blob);
  };

  return (
    <div className="watch-page">
      {movieNotFound === true && (
        <div className="movie-not-found">
          <p>this ressource is not found on any server</p>
        </div>
      )}
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
      {mediaType === "tv" && <Navbar />}
      <div className="movie-description-container">
        {mediaType === "tv" && episodeDetails && (
          <>
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
              <div className="movie-infos">
                <div className="movie-ids">
                  <h3>{episodeDetails.title || episodeDetails.name}</h3>
                  <p>
                    {episodeDetails.air_date || episodeDetails.release_date}
                  </p>
                </div>
              </div>
            </div>
            <div className="sections-container">
              <div className="sections">
                <div className="section active">
                  <h4>Episode Overview</h4>
                </div>
              </div>
              <div className="overview">
                <p>
                  {!isOverviewAllShowed
                    ? episodeDetails.overview
                        .split(" ")
                        .slice(0, 13)
                        .join(" ") + "...."
                    : episodeDetails.overview}
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
            </div>
          </>
        )}
        <>
          {selectedMirror === "smashy" && streamVideo && subtitles ? (
            <div id="player"></div>
          ) : null}
          {selectedMirror === "ridotv" && streamVideo2 ? (
            <VideoJS src={streamVideo2} />
          ) : null}
          <div className="sources-container">
            <div className="sources-list">
              <div className="sections mirrors">
                <div
                  onClick={() => {
                    if (selectedMirror !== "smashy") {
                      setSelectedMirror("smashy");
                    }
                  }}
                  className={
                    selectedMirror === "smashy"
                      ? "mirror section active"
                      : "mirror section"
                  }
                >
                  <h4>Main Mirror</h4>
                </div>
                <div
                  onClick={() => {
                    if (selectedMirror !== "ridotv") {
                      setSelectedMirror("ridotv");
                    }
                  }}
                  className={
                    selectedMirror === "ridotv"
                      ? "mirror section active"
                      : "mirror section"
                  }
                >
                  <h4>Backup Mirror</h4>
                </div>
              </div>
              {sources && selectedMirror === "smashy" && (
                <>
                  <div className="sources-label">Choose Server :</div>
                  {sources.map((source, index) => {
                    const isActive = source.url === activeServer;
                    return (
                      <div
                        className={
                          isActive ? "source-link active" : "source-link"
                        }
                        key={source.name}
                        onClick={() => handleServerSwitch(source.url)}
                      >
                        <p>{`Server - ${index + 1}`}</p>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </div>
        </>
      </div>
    </div>
  );
};
export default WatchPage;
