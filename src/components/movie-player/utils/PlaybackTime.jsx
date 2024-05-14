import React, { useState, useEffect } from "react";
import { formatTime } from "./formatTime";
const PlaybackTime = ({ videoRef }) => {
  const [timeStamp, setTimeStamp] = useState(0);

  useEffect(() => {
    const handleTimeupdate = (event) => {
      setTimeStamp(event.target.currentTime);
    };
    videoRef.current.addEventListener("timeupdate", handleTimeupdate);

    return () => {
      videoRef.current.removeEventListener("timeupdate", handleTimeupdate);
    };
  }, []);

  return (
    <p className="current-time">
      {formatTime(timeStamp)} /{" "}
      {videoRef.current.duration
        ? formatTime(videoRef.current.duration)
        : "00:00"}
    </p>
  );
};

export default PlaybackTime;
