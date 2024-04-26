import { useEffect, useState } from "react";
import "../styles/WatchPage.css";
import React from "react";
import { useParams, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import DisableDevtool from "disable-devtool";
import LoadingAnimation from "../components/LoadingAnimation";
import HLSPlayer from "../components/movie-player/HLSPlayer";
import SmashyCaptcha from "../components/movie-player/SmashyCaptcha";

const WatchPage = () => {
  const location = useLocation();
  const { episodeDetails, movieName } = location.state || {};
  const [sources, setSources] = useState();
  const [activeServer, setActiveServer] = useState(null);
  const [streamVideo, setStreamVideo] = useState("");
  const [subtitles, setSubtitles] = useState("");
  const [loading, setLoading] = useState(false);
  const { mediaType, movieID, season, ep } = useParams();
  const [isOverviewAllShowed, setIsOverviewAllShowed] = useState(false);
  const [movieNotFound, setMovieNotFound] = useState(false);
  const [selectedMirror, setSelectedMirror] = useState("");
  const [devtoolsDetected, setDevtoolsDetected] = useState(false);
  const [smashyUnverified, setSmashyUnverified] = useState(false);

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

  useEffect(() => {
    if (!movieName || !episodeDetails) {
      if (mediaType === "tv") {
        document.location.pathname = `${mediaType}/${movieID}/${
          season ? season : ""
        }`;
      }
    }
  });

  const handleServerSwitch = async (serverURL) => {
    if (activeServer !== serverURL) {
      try {
        setLoading(true);

        const response = await fetch(serverURL);
        const data = await response.json();
        if (data.sourceUrls[0] !== "Verification needed") {
          setActiveServer(serverURL);
          setStreamVideo(data.sourceUrls[0]);
          const subtitles = data.subtitles.split(",");
          const formattedSubtitles = subtitles
            .map((subtitle) => {
              const index = subtitle.indexOf("]");
              if (index !== -1) {
                const lang = subtitle.substring(1, index);
                const url = subtitle.substring(index + 1);
                return { lang, url };
              }
              return null; // Return null for invalid subtitles
            })
            .filter((subtitle) => subtitle !== null); // Filter out null values
          setSubtitles(formattedSubtitles);
        } else {
          setSmashyUnverified(true);
        }
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
          `https://rv.lil-hacker.workers.dev/?url=https://ridomovies.tv/core/api/search?q=${movieName}&mirror=rido`,
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
          if (item.contentable.tmdbId == movieID) {
            getEpisodes(item.slug);
            found = true;
          }
        }
        if (!found) {
          setMovieNotFound(true);
        }
      } catch (error) {
        console.error("Error fetching", error);
        setLoading(false);
      }
    };
    if (selectedMirror === "smashy") {
      fetchStreamURL();
    }
    if (mediaType === "tv" && selectedMirror === "ridotv") {
      getSlug();
    }
  }, [selectedMirror]);

  const getEpisodes = async (slug) => {
    try {
      const response = await fetch(
        `https://rv.lil-hacker.workers.dev?url=https://ridomovies.tv/tv/${slug}&mirror=rido`
      );

      const htmlContent = await response.text();
      // Regular expression to match the episodes JSON data
      const regex = /"episodes\\":\[(.*?)\]/g;
      let matches;
      const seasons = [];
      let seasonNumber = 1; // Counter for labeling seasons
      while ((matches = regex.exec(htmlContent)) !== null) {
        // matches[1] contains the captured group inside the parentheses
        const cleanJson = matches[1]
          .replace(/\\"/g, `"`)
          .replace(/\\\\"/g, "`");
        // Parse the cleaned JSON string
        const episodesData = JSON.parse(`[${cleanJson}]`);

        // Extract ID and episodeNumber of each episode and assign season number
        const episodes = episodesData.map((episode) => ({
          id: episode.id,
          episodeNumber: episode.episodeNumber,
          season: seasonNumber, // Add season number to each episode
        }));

        // Store episodes in the corresponding season
        seasons.push(episodes);

        seasonNumber++; // Increment season number
      }
      // Now seasons object contains episodes grouped by season
      // Call getIFrame with seasons object
      getIFrame(seasons);
    } catch (error) {
      console.log(error);
    }
  };

  const getIFrame = async (seasons) => {
    if (seasons.length > 0) {
      const episodeId = seasons[season - 1][ep - 1].id;
      const response = await fetch(
        `https://rv.lil-hacker.workers.dev/?url=https%3A%2F%2Fridomovies.tv%2Fcore%2Fapi%2Fepisodes%2F${episodeId}%2Fvideos&mirror=rido`,
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
      `https://rv.lil-hacker.workers.dev/?url=${iFrameURL}&mirror=rido`
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
            setStreamVideo(fileUrl);
            break;
          }
        }
      }
    } else {
      console.error("No script tags found");
    }
    setLoading(false);
  };

  return (
    <div className="watch-page">
      {movieNotFound === true && (
        <div className="movie-not-found">
          <p>this ressource is not found on any server</p>
        </div>
      )}
      <LoadingAnimation loading={loading} />
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
          {streamVideo ? (
            <HLSPlayer
              mirror={selectedMirror}
              url={streamVideo}
              subtitles={subtitles}
            />
          ) : null}
          {smashyUnverified ? <SmashyCaptcha /> : null}
          <div className="sources-container">
            <div className="sources-list">
              <div className="sections mirrors">
                <div
                  onClick={() => {
                    if (selectedMirror !== "smashy") {
                      setActiveServer("");
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
