import React from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "videojs-hls-quality-selector";

export const VideoJS = (props) => {
  const videoRef = React.useRef(null);
  const playerRef = React.useRef(null);
  const { options, onReady } = props;

  React.useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current) {
      // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode.
      const videoElement = document.createElement("video-js");

      videoElement.classList.add("vjs-big-play-centered");
      videoRef.current.appendChild(videoElement);

      const player = (playerRef.current = videojs(videoElement, options, () => {
        videojs.log("player is ready");
        onReady && onReady(player);
      }));
      player.hlsQualitySelector({
        displayCurrentQuality: true,
      });

      // Log the file that is playing
      player.on("loadstart", () => {
        console.log("loading")
        // const currentSource = player.currentSource();
        // if (currentSource) {
        //   console.log("Playing file:", currentSource.src);
        // }
      });
    } else {
      const player = playerRef.current;

      // Update the sources
      player.src(options.sources);

      // Optionally, you may want to trigger other changes here based on prop changes
      // For example, setting autoplay:
      player.autoplay(options.autoplay);
    }
  }, [options, videoRef]);

  // Dispose the Video.js player when the functional component unmounts
  React.useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  return (
    <div data-vjs-player>
      <div ref={videoRef} />
    </div>
  );
};

export default VideoJS;
