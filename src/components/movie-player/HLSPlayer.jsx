import React, { useEffect, useState, useRef } from "react";
import ReactPlayer from "react-player";
import SmashyStreamDecoder from "./decoder";

const HLSPlayer = ({ url, mirror }) => {
  const [videoUrl, setVideoUrl] = useState(url);
  const playerRef = useRef(null);

  useEffect(() => {
    if (mirror === "smashy") {
      const decodedUrl = SmashyStreamDecoder(url);
      setVideoUrl(decodedUrl);
    } else {
      setVideoUrl(url);
    }
  }, [url]);

  return (
    <div>
      <div className="player-wrapper">
        <ReactPlayer
          ref={playerRef}
          url={videoUrl}
          controls={true}
          width="100%"
          height="100%"
        />
      </div>
    </div>
  );
};

export default HLSPlayer;
