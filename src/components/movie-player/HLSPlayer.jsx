import React, { useEffect, useState, useRef } from "react";
import ReactPlayer from "react-player";
import SmashyStreamDecoder from "./decoder";

const HLSPlayer = ({ url, mirror }) => {
  const [videoUrl, setVideoUrl] = useState(url);
  const [qualities, setQualities] = useState([]);
  const playerRef = useRef(null);

  useEffect(() => {
    if (mirror === "smashy") {
      const decodedUrl = SmashyStreamDecoder(url);
      setVideoUrl(decodedUrl);
    } else {
      setVideoUrl(url);
    }
  }, [url]); // Added 'mirror' to the dependency array

  useEffect(() => {
    const player = playerRef.current.getInternalPlayer("hls");
    if (player) {
      player.on("hlsFragLoaded", () => {
        const newQualities = player.levels.map((level, index) => ({
          index,
          label: level.height ? `${level.height}p` : "Auto",
        }));
        setQualities(newQualities);
      });
    }
  }, [videoUrl]);

  const handleQualityChange = (e) => {
    const player = playerRef.current.getInternalPlayer("hls");

    const qualityIndex = parseInt(e.target.value);
    player.currentLevel = qualityIndex;
  };

  return (
    <div>
      <ReactPlayer
        wrapper="div.player-wrapper"
        ref={playerRef}
        url={videoUrl}
        controls={true}
        width="100%"
        height="100%"
        config={{
          hls: {
            hlsOptions: {
              // This enables quality switching
              enableWorker: true,
              fragLoadingTimeOut: 20000,
              fragLoadingMaxRetry: 10,
            },
          },
        }}
      />
      <select onChange={handleQualityChange} defaultValue={-1}>
        <option key={-1} value={-1}>
          AUTO
        </option>
        {qualities &&
          qualities.map((quality) => (
            <option key={quality.index} value={quality.index}>
              {quality.label}
            </option>
          ))}
      </select>
    </div>
  );
};

export default HLSPlayer;
