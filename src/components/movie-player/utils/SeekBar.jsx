import React, { useEffect, useRef, useState } from "react";
import { formatTime } from "./formatTime";

const SeekBar = ({ videoRef }) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const inputRef = useRef(null);

  const handleSeekChange = (e) => {
    setCurrentTime(e.target.value);
  };

  const handleSeekMouseDown = () => {
    setIsSeeking(true);
    videoRef.current.pause();
  };

  const handleSeekMouseUp = () => {
    setIsSeeking(false);
    videoRef.current.currentTime = inputRef.current.value;
    videoRef.current.play();
  };

  useEffect(() => {
    const video = videoRef;
    const handleTimeUpdate = () => {
      setCurrentTime(video.current?.currentTime);
    };

    video.current.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      if (video.current) {
        video.current.removeEventListener("timeupdate", handleTimeUpdate);
      }
    };
  }, [videoRef]);

  return (
    <div className="seek-bar">
      {inputRef.current ? (
        <span
          style={{
            visibility: isSeeking ? "visible" : "hidden",
            right: `-${
              (inputRef.current.value / videoRef.current.duration) * 100
            }%`,
          }}
        >
          {formatTime(inputRef.current.value)}
        </span>
      ) : null}
      <input
        ref={inputRef}
        type="range"
        min={0}
        max={videoRef.current.duration.toString()}
        step={1}
        value={isSeeking ? currentTime : videoRef.current.currentTime}
        onChange={handleSeekChange}
        onMouseDown={handleSeekMouseDown}
        onMouseUp={handleSeekMouseUp}
        onPointerDown={handleSeekMouseDown}
        onPointerUp={handleSeekMouseUp}
      />
    </div>
  );
};

export default SeekBar;
