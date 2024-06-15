import React, { useEffect, useState } from "react";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import LoadingAnimation from "../../LoadingAnimation";

const PlayButton = ({ videoRef, hlsRef }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setisPlaying] = useState(false);

  useEffect(() => {
    const videoEventHandlers = {
      seeking: () => {
        setIsLoading(true);
      },
      seeked: () => {
        setIsLoading(false);
      },
      play: () => {
        setisPlaying(true);
      },
      pause: () => {
        setisPlaying(false);
      },
      canplaythrough: () => {
        setIsLoading(false);
      },
      waiting: () => {
        setIsLoading(true);
      },
    };
    const hlsEventHandlers = {
      manifestLoading: () => {
        isLoading(true);
      },
    };

    const video = videoRef.current;
    const hls = hlsRef.current;

    video.addEventListener("seeking", videoEventHandlers.seeking);
    video.addEventListener("seeked", videoEventHandlers.seeked);
    video.addEventListener("play", videoEventHandlers.play);
    video.addEventListener("pause", videoEventHandlers.pause);
    video.addEventListener("waiting", videoEventHandlers.waiting);
    video.addEventListener("canplaythrough", videoEventHandlers.canplaythrough);

    return () => {
      if (hls) {
        hls.off("manifestLoading", hlsEventHandlers.manifestLoading);
      }
      if (video) {
        video.removeEventListener("waiting", videoEventHandlers.waiting);
        video.removeEventListener("seeking", videoEventHandlers.seeking);
        video.removeEventListener("seeked", videoEventHandlers.seeked);
        video.removeEventListener("play", videoEventHandlers.play);
        video.removeEventListener("pause", videoEventHandlers.pause);
        video.removeEventListener(
          "canplaythrough",
          videoEventHandlers.canplaythrough
        );
      }
    };
  }, [videoRef]);

  const togglePlay = (e) => {
    e.stopPropagation();
    if (videoRef.current.paused) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  };

  return (
    <>
      {!isLoading ? (
        <div className="icon play-button" onClick={togglePlay}>
          {isPlaying ? <PauseCircleIcon /> : <PlayCircleIcon />}
        </div>
      ) : (
        <LoadingAnimation loading={true} />
      )}
    </>
  );
};

export default PlayButton;
