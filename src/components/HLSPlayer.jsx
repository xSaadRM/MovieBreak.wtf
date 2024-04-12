import React from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "videojs-hls-quality-selector";
import "../styles/VideoJS.css"; // Import CSS file for custom styles

export const VideoJS = (props) => {
  const videoRef = React.useRef(null);
  const playerRef = React.useRef(null);
  const { src } = props;

  const options = {
    autoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
    sources: [
      {
        src: src,
        type: "application/x-mpegURL",
      },
    ],
  };

  const onReady = (player) => {
    playerRef.current = player;

    // You can handle player events here, for example:
    player.on("waiting", () => {
      videojs.log("player is waiting");
    });

    player.on("dispose", () => {
      videojs.log("player will dispose");
    });
  };

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

      // Add double-click event listeners to track double clicks
      const vdjsVid = document.getElementsByTagName("video-js")[0];
      const trackerContainer = document.createElement("div");
      trackerContainer.classList.add("double-click-tracker");
      vdjsVid.appendChild(trackerContainer);

      const child1 = document.createElement("div");
      const child2 = document.createElement("div");
      const child3 = document.createElement("div");
      child1.classList.add("tracker-child", "seek-backward");
      child2.classList.add("tracker-child", "middle-child");
      child3.classList.add("tracker-child", "seek-forward");
      trackerContainer.appendChild(child1);
      trackerContainer.appendChild(child2);
      trackerContainer.appendChild(child3);

      // Double click event handlers for each child
      child1.addEventListener("dblclick", () => {
        player.currentTime(player.currentTime() - 30);
      });
      child1.addEventListener("click", () => {
        if (player.paused()) {
          player.play();
        } else {
          player.pause();
        }
      });
      child2.addEventListener("dblclick", () => {
        if (player.isFullscreen()) {
          player.exitFullscreen();
        } else {
          player.requestFullscreen();
        }
      });
      child2.addEventListener("click", () => {
        if (player.paused()) {
          player.play();
        } else {
          player.pause();
        }
      });
      child3.addEventListener("dblclick", () => {
        player.currentTime(player.currentTime() + 30);
      });
      child3.addEventListener("click", () => {
        if (player.paused()) {
          player.play();
        } else {
          player.pause();
        }
      });
      player.hlsQualitySelector({
        displayCurrentQuality: true,
      });

      player.on("loadstart", () => {
        console.log("loading");
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
