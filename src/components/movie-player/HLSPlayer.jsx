import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import "./playerStyles.css";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import Cloud from "@mui/icons-material/Cloud";
import RedoIcon from "@mui/icons-material/Redo";
import UndoIcon from "@mui/icons-material/Undo";
import { fetchRidoTV, getSlug } from "./providers/ridotv";
import LoadingAnimation from "../LoadingAnimation";
import {
  getM3U8,
  getWorkingPlayers,
} from "./providers/smashy-stream/smashyFetch";
import SmashyStreamDecoder from "./providers/smashy-stream/decoder";
import { Fullscreen } from "@mui/icons-material";
import SeekBar from "./utils/SeekBar";
import PlaybackTime from "./utils/PlaybackTime";
import QualitySwitcher from "./utils/QualitySwitcher";
import SubtitleSwitcher from "./utils/SubtitleSwitcher";
import SubtitlesLoader from "./utils/SubtitlesLoader";
import { SubtitlesManager } from "./utils/SubtitlesManager";

const VideoPlayer = ({ episodeDetails, state }) => {
  const { movieInfos } = state;
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const playerRef = useRef(null);
  const subtitlesManagerRef = useRef(null);
  const [isproviderListShown, setisproviderListShown] = useState(false);
  const [activeProvider, setactiveProvider] = useState({
    name: null,
    url: null,
    index: null,
  });
  const [src, setSrc] = useState("");
  const [isPlaying, setisPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isControlsShown, setisControlsShown] = useState(true);
  const [manifestLoading, setManifestLoading] = useState(false);
  const [levelLoading, setLevelLoading] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  const [slug, setSlug] = useState({});
  const [smashyPlayers, setSmashyPlayers] = useState([]);
  const [subtitles, setsubtitles] = useState(null);
  useEffect(() => {
    const video = videoRef;
    const getProviders = async () => {
      const getSlugResponse = await getSlug(
        movieInfos.id,
        episodeDetails ? movieInfos.name : movieInfos.title
      );
      setSlug(getSlugResponse);
      const getSmashyPlayers = await getWorkingPlayers(
        movieInfos.id,
        episodeDetails?.season_number,
        episodeDetails?.episode_number
      );
      setSmashyPlayers(getSmashyPlayers);
    };
    getProviders();
    const handleSeeking = () => {
      setIsLoading(true);
    };

    const handleSeeked = () => {
      setIsLoading(false);
    };
    const handlePlay = () => {
      setisPlaying(true);
    };
    const handlePause = () => {
      setisPlaying(false);
    };
    const handleReadyState = () => {
      setPlayerReady(true);
    };
    const handleManifestLoading = (event, data) => {
      setManifestLoading(true);
    };
    const handleLevelLoading = (event, data) => {
      setLevelLoading(true);
    };
    const handleManifestLoaded = (event, data) => {
      setManifestLoading(false);
    };
    const handleLevelLoaded = (event, data) => {
      setLevelLoading(false);
    };
    const handleLevelSwitching = (event, data) => {
      if (!hls.autoLevelEnabled) {
        setIsLoading(true);
      }
    };

    const handleLevelSwitched = (event, data) => {
      setIsLoading(false);
    };
    video.current.addEventListener("seeking", handleSeeking);
    video.current.addEventListener("seeked", handleSeeked);
    video.current.addEventListener("play", handlePlay);
    video.current.addEventListener("pause", handlePause);
    video.current.addEventListener("canplaythrough", handleReadyState);
    const hls = new Hls();
    hlsRef.current = hls;
    if (Hls.isSupported()) {
      hls.on(Hls.Events.MANIFEST_LOADING, handleManifestLoading);
      hls.on(Hls.Events.LEVEL_LOADING, handleLevelLoading);
      hls.on(Hls.Events.MANIFEST_LOADED, handleManifestLoaded);
      hls.on(Hls.Events.LEVEL_LOADED, handleLevelLoaded);
      hls.on(Hls.Events.LEVEL_SWITCHING, handleLevelSwitching);
      hls.on(Hls.Events.LEVEL_SWITCHED, handleLevelSwitched);

      hls.attachMedia(video.current);
    }

    return () => {
      if (video.current) {
        video.current.removeEventListener("seeking", handleSeeking);
        video.current.removeEventListener("seeked", handleSeeked);
        video.current.removeEventListener("play", handlePlay);
        video.current.removeEventListener("pause", handlePause);
        video.current.removeEventListener("canplaythrough", handleReadyState);
      }
      if (hlsRef.current) {
        hls.off(Hls.Events.MANIFEST_LOADING, handleManifestLoading);
        hls.off(Hls.Events.LEVEL_LOADING, handleLevelLoading);
        hls.off(Hls.Events.MANIFEST_LOADED, handleManifestLoaded);
        hls.off(Hls.Events.LEVEL_LOADED, handleLevelLoaded);
        hls.off(Hls.Events.LEVEL_SWITCHING, handleLevelSwitching);
        hls.off(Hls.Events.LEVEL_SWITCHED, handleLevelSwitched);

        hls.destroy();
      }
    };
  }, [episodeDetails, movieInfos]);

  useEffect(() => {
    setIsLoading(
      manifestLoading || levelLoading || (playerReady ? false : true)
    );
  }, [manifestLoading, levelLoading, playerReady]);

  useEffect(() => {
    if (src) {
      setisproviderListShown(false);
      hlsRef.current.loadSource(src);
      hlsRef.current.on(Hls.Events.ERROR, function (event, data) {
        if (data.fatal === true && data.details === "internalException") {
          setisPlaying(false);
          setPlayerReady(false);
          hlsRef.current.loadSource(src);
        }
      });
    }
  }, [src]);

  useEffect(() => {
    const getSRC = async () => {
      if (activeProvider && activeProvider.name === "ridotv") {
        if (slug && slug.status === 200) {
          const m3u8 = await fetchRidoTV(
            slug.data,
            episodeDetails?.episode_number,
            episodeDetails?.season_number
          );
          setSrc(m3u8);
        }
      } else if (activeProvider && activeProvider.name === "smashy") {
        const data = await getM3U8(activeProvider.url);
        setsubtitles(data.subtitles);
        setSrc(SmashyStreamDecoder(data.sourceUrls[0]));
        subtitlesManagerRef.current = new SubtitlesManager(
          videoRef.current,
          data.subtitles
        );
      }
    };
    getSRC();
  }, [activeProvider, episodeDetails, slug]);

  const playerTap = () => {
    setisControlsShown((prev) => !prev);
  };

  const handleDoubleClick = () => {
    if (playerRef.current.requestFullscreen) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        playerRef.current.requestFullscreen();
        window.screen.orientation.lock("landscape");
      }
    }
  };

  const togglePlay = (e) => {
    e.stopPropagation();
    if (videoRef.current.paused) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  };

  return (
    <div
      ref={playerRef}
      className={`moviebreak-player ${
        isControlsShown ? "showcontrols" : "hidecontrols"
      }`}
      onClick={playerTap}
      onDoubleClick={handleDoubleClick}
    >
      <video
        ref={videoRef}
        poster={`https://image.tmdb.org/t/p/original/${
          episodeDetails?.still_path || movieInfos.backdrop_path
        }`}
      ></video>
      <div className="movie-infos">
        <div className="movie-ids">
          <h3>
            {episodeDetails ? movieInfos.name : movieInfos.title}
            {episodeDetails
              ? `- S${episodeDetails.season_number} E
            ${episodeDetails.episode_number}`
              : ""}
          </h3>
        </div>
      </div>
      {src ? (
        <div className="moviebreak-controls">
          <div className="centerControls">
            <div
              className="seekBackward seek"
              onClick={(e) => {
                e.stopPropagation();
                videoRef.current.currentTime -= 10;
              }}
            >
              <UndoIcon />
              <p>10</p>
            </div>
            {!isLoading ? (
              <div className="play-button" onClick={togglePlay}>
                {isPlaying ? <PauseCircleIcon /> : <PlayCircleIcon />}
              </div>
            ) : (
              <LoadingAnimation loading={true} />
            )}
            <div
              className="seekForward seek"
              onClick={(e) => {
                e.stopPropagation();
                videoRef.current.currentTime += 30;
              }}
            >
              <RedoIcon />
              <p>30</p>
            </div>
          </div>
          <div
            className="control-bar-container"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <SeekBar videoRef={videoRef} />
            <div className="control-bar">
              <PlaybackTime videoRef={videoRef} />
              <div className="right-controls">
                {isControlsShown && (
                  <>
                    <SubtitleSwitcher
                      subtitlesManagerRef={subtitlesManagerRef}
                      hlsRef={hlsRef}
                    />
                    <QualitySwitcher hlsRef={hlsRef} />
                  </>
                )}
                <div className="fullscreen-toggle" onClick={handleDoubleClick}>
                  <Fullscreen />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {subtitles && !hlsRef.current.subtitleTracks[0] ? (
        <SubtitlesLoader subtitlesManagerRef={subtitlesManagerRef} />
      ) : null}
      <div
        className="cloud-icon"
        onClick={(e) => {
          e.stopPropagation();
          if (isControlsShown) {
            setisproviderListShown((prev) => !prev);
          }
        }}
      >
        <Cloud />
      </div>
      <div
        className={`provider-list ${
          isproviderListShown ? "show-providers" : "hide-providers"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`providers`}>
          {slug.status !== 404 ? (
            <div
              className={`provider ${
                activeProvider.name === "ridotv" ? "active" : ""
              }`}
              key={"ridotv"}
              onClick={() => {
                if (isproviderListShown) {
                  setactiveProvider({ name: "ridotv" });
                }
              }}
            >
              RidoTV (ENG)
            </div>
          ) : null}
          {smashyPlayers.map((player, index) => {
            return (
              <div
                key={player.name}
                className={`provider ${
                  activeProvider.index === index ? "active" : ""
                }`}
                onClick={() => {
                  if (isproviderListShown) {
                    setactiveProvider({
                      name: "smashy",
                      url: player.url,
                      index: index,
                    });
                  }
                }}
              >
                Smashy - {player.name}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
