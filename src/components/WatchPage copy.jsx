import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/WatchPage.css";
import Navbar from "./Navbar";
import React from "react";
import VideoJS from "./HLSPlayer";
import videojs from "video.js";
import DisableDevtool from "disable-devtool";
import ScaleLoader from "react-spinners/ScaleLoader";

const WatchPage = () => {
  const location = useLocation();
  const hrefDetails = window.location.pathname.split("/");

  const { episodeDetails, movieName } = location.state;
  const [dataIDs, setDataIDs] = useState([]);
  const [iFrameURL, setIFrameUrl] = useState("");
  const [slug, setSlug] = useState("");
  const [streamUrl, setStreamURL] = useState("");
  const [movieNotFound, setMovieNotFound] = useState(false);


  useEffect(() => {
    DisableDevtool({
      ondevtoolopen: () => {
        window.location.href = "/sonic.html";
      },
    });
  }, []);
  useEffect(() => {
    const getSlug = async () => {
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
            setSlug(item.slug);
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

    if (hrefDetails) {
      getSlug();
    }
  }, []);

  useEffect(() => {
    const getEpisodes = async () => {
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
          const cleanJson = matches[1].replace(/\\"/g, `"`).replace(/\\\\"/g, "`");
          // Parse the cleaned JSON string
          const episodesData = JSON.parse(`[${cleanJson}]`);

          // Extract ID and episodeNumber of each episode
          const episodeInfo = episodesData.map((episode) => ({
            id: episode.id,
            episodeNumber: episode.episodeNumber,
          }));

          setDataIDs(episodeInfo);
        } else {
          console.log("No episodes found in the HTML content.");
        }
      } catch (error) {
        setMovieNotFound(true);
        console.log(error);
      }
    };
    if (slug) {
      getEpisodes();
    }
  }, [slug]);

  useEffect(() => {
    const getIFrame = async () => {
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
          setIFrameUrl(dataSrcValue);
        } else {
          console.log("No data-src attribute found in the URL.");
        }
      } else {
        // Handle the case where dataIDs or episodeId is not available
      }
    };

    if (dataIDs) {
      getIFrame();
    }
  }, [hrefDetails, dataIDs]);

  useEffect(() => {
    const getM3U8 = async () => {
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
              setStreamURL(fileUrl);
              break;
            }
          }
        }
      } else {
        console.error("No script tags found");
      }
    };
    if (iFrameURL) {
      getM3U8();
    }
  }, [iFrameURL]);

  const playerRef = React.useRef(null);

  const videoJsOptions = {
    autoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
    sources: [
      {
        src: streamUrl,
        type: "application/x-mpegURL",
      },
    ],
  };

  const handlePlayerReady = (player) => {
    playerRef.current = player;

    // You can handle player events here, for example:
    player.on("waiting", () => {
      videojs.log("player is waiting");
    });

    player.on("dispose", () => {
      videojs.log("player will dispose");
    });
  };

  return (
    <>
      <Navbar isHomePage={false} />
      <div className="movie-description-container">
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
        {streamUrl ? (
          <div className="player-container">
            <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
          </div>
        ) : movieNotFound === true ? (
          <div className="movie-not-found">
            <p>this ressource is not found on any server</p>
          </div>
        ) : (
          <div className="loading-animation">
            <ScaleLoader
              color="blue"
              loading={!movieNotFound || !streamUrl}
              size={150}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div>
        )}
        <h3>Overview:</h3>
        <p>{episodeDetails.overview}</p>
      </div>
    </>
  );
};
export default WatchPage;
