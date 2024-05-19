import React, { useState, useEffect } from "react";
import { formatTime } from "./formatTime";
const PlaybackTime = ({ videoRef }) => {
  const [timeStamp, setTimeStamp] = useState(0);

  useEffect(() => {
    const video = videoRef;

    const handleTimeupdate = (event) => {
      setTimeStamp(event.target.currentTime);
    };
    video.current.addEventListener("timeupdate", handleTimeupdate);

    return () => {
      if (video.current) {
        video.current.removeEventListener("timeupdate", handleTimeupdate);
      }
    };
  }, [videoRef]);

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
