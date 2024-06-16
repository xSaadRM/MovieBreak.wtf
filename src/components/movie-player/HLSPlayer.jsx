import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import "./playerStyles.css";
import Cloud from "@mui/icons-material/Cloud";
import RedoIcon from "@mui/icons-material/Redo";
import UndoIcon from "@mui/icons-material/Undo";
import { fetchRidoTV } from "./providers/ridotv";

import Fullscreen from "@mui/icons-material/Fullscreen";
import NavigateBefore from "@mui/icons-material/NavigateBefore";
import SeekBar from "./utils/SeekBar";
import PlaybackTime from "./utils/PlaybackTime";
import QualitySwitcher from "./utils/QualitySwitcher";
import SubtitleSwitcher from "./utils/SubtitleSwitcher";
import SubtitlesLoader from "./utils/SubtitlesLoader";

import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useNavigate, useParams } from "react-router-dom";
import { shahid4uFetchServers, shahid4uGetM3U8 } from "./providers/shahid4u";
import PlayButton from "./utils/PlayButton";
import { setSlug } from "../../reducer/reducer";
import { fetchAutoEmbedCC } from "./providers/autoembed";
import {
  getM3U8,
  getWorkingPlayers,
} from "./providers/smashy-stream/smashyFetch";
import { SubtitlesManager } from "./utils/SubtitlesManager";
import SmashyStreamDecoder from "./providers/smashy-stream/decoder";
import { indexedDBInit } from "../../utils/indexedDB";
import AudioSwitcher from "./utils/AudioSwitcher";

const VideoPlayer = ({ state, dispatch }) => {
  const navigate = useNavigate();
  const { mediaType, movieID, season, ep } = useParams();
  const { movieInfos, seasonDetails, shahid4uEpisodes, slug } = state;
  const episodeDetails =
    mediaType === "tv" ? seasonDetails.episodes[ep - 1] : null;
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const playerRef = useRef(null);
  const subtitlesManagerRef = useRef(null);
  const [isproviderListShown, setisproviderListShown] = useState(true);
  const initialActiveProvider = { name: null, url: null, index: null };
  const [activeProvider, setactiveProvider] = useState(initialActiveProvider);
  const prevActiveProvider = useRef(initialActiveProvider);
  const [src, setSrc] = useState({ type: null, url: null });
  const [isControlsShown, setisControlsShown] = useState(true);
  const [subtitles, setsubtitles] = useState(null);
  const [shahid4uServers, setshahid4uServers] = useState({ status: "loading" });
  const [smashyPlayers, setSmashyPlayers] = useState([]);
  const [autoEmbedServers, setAutoEmbedServers] = useState([]);
  const uid = season && ep ? `${movieID}-${season}-${ep}` : movieID;
  const movieToDBData = {
    uid: uid,
    id: movieID,
    title: movieInfos.name || movieInfos.title,
    poster_path: movieInfos.poster_path,
    release_date: movieInfos.first_air_date || movieInfos.release_date,
    vote_average: movieInfos.vote_average,
    media_type: mediaType,
    playbackTime: videoRef.current?.currentTime,
    movieDuration: videoRef.current?.duration,
  };

  useEffect(() => {
    const video = videoRef;

    const getProviders = async () => {
      const fetchAutoEmbed = async () => {
        setAutoEmbedServers({ status: "loading" });
        try {
          fetchAutoEmbedCC(
            movieInfos.id,
            episodeDetails?.season_number,
            episodeDetails?.episode_number,
            setAutoEmbedServers
          );
        } catch (e) {
          console.error(e);
        }
      };
      const getSmashyPlayers = async () => {
        setSmashyPlayers({ status: "loading" });
        try {
          const data = await getWorkingPlayers(
            movieInfos.id,
            episodeDetails?.season_number,
            episodeDetails?.episode_number
          );
          setSmashyPlayers(data);
        } catch (error) {
          console.error(error);
        }
      };

      const getShahid4uServers = async () => {
        setshahid4uServers({ status: "loading" });
        try {
          const data = await shahid4uFetchServers(
            shahid4uEpisodes[episodeDetails?.episode_number - 1]
          );
          setshahid4uServers(data);
        } catch (error) {
          console.error(error);
        }
      };

      getShahid4uServers();
      fetchAutoEmbed();
      getSmashyPlayers();
    };

    getProviders();

    const hls = new Hls();
    hlsRef.current = hls;
    if (Hls.isSupported()) {
      hls.attachMedia(video.current);
    }

    return () => {
      if (hlsRef.current) {
        hls.destroy();
      }
    };
  }, [episodeDetails, movieInfos, shahid4uEpisodes]);

  useEffect(() => {
    const hls = hlsRef.current;

    const mbLoadSource = () => {
      try {
        hls.loadSource(src.url);
      } catch (error) {
        hls.loadSource(`https://corsproxy.io/?` + src.url);
      }
    };
    const hlsErrorE = (event, data) => {
      if (data.fatal === true && data.details === "internalException") {
        mbLoadSource();
      }
    };
    if (src && src.url) {
      if (src.type === "m3u8") {
        hls.attachMedia(videoRef.current);
        setisproviderListShown(false);
        mbLoadSource();
        hls.on(Hls.Events.ERROR, hlsErrorE);
      } else {
        videoRef.current.src = src.url;
        setisproviderListShown(false);
      }
    }

    return () => {
      if (hls) {
        hls.off(Hls.Events.ERROR, hlsErrorE);
      }
    };
  }, [src]);

  useEffect(() => {
    const video = videoRef.current;
    let updatePlayback;
    const getMovieById = async () => {
      const db = await indexedDBInit();
      const tx = db.transaction("movies", "readonly");
      const store = tx.objectStore("movies");

      const movie = await store.get(uid);
      return movie;
    };

    const addMovie = async (movie) => {
      const db = await indexedDBInit();
      const tx = db.transaction("movies", "readwrite");
      const store = tx.objectStore("movies");

      await store.put(movie);
      await tx.done;
    };
    const handleLoadedMetaData = async () => {
      const fetchedMovieDB = await getMovieById();
      const playbackTime = fetchedMovieDB?.playbackTime || 0;
      video.currentTime = playbackTime;
      updatePlayback = setInterval(() => {
        if (!video.paused) {
          movieToDBData.playbackTime = video.currentTime;
          movieToDBData.movieDuration = video.duration;
          addMovie(movieToDBData);
        }
      }, 15000);
    };

    video.addEventListener("ended", () => {
      clearInterval(updatePlayback);
    });
    video.addEventListener("loadedmetadata", handleLoadedMetaData);

    return () => {
      if (video) {
        video.removeEventListener("ended", () => {
          clearInterval(updatePlayback);
        });
        video.removeEventListener("loadedmetadata", handleLoadedMetaData);
      }
    };
  }, [videoRef?.current]);

  useEffect(() => {
    const getSRC = async () => {
      if (activeProvider.name === "ridotv") {
        if (slug && slug.status === 200) {
          const m3u8 = await fetchRidoTV(
            slug.data,
            episodeDetails?.episode_number,
            episodeDetails?.season_number
          );
          if (m3u8 === 404) {
            dispatch(setSlug({ status: 404 }));
          } else {
            setSrc({ type: "m3u8", url: m3u8 });
          }
        }
      } else if (activeProvider.name === "shahid") {
        const data = await shahid4uGetM3U8(activeProvider);
        if (data.status === 404) {
          const updatedServers = shahid4uServers?.map((server) => {
            if (server.url === data.url) {
              return { ...server, name: server.name + " [Not Working]" };
            }
            return server;
          });
          setshahid4uServers(updatedServers);
        } else {
          if (data.type === "mp4") {
            setSrc({ type: "mp4", url: data.url });
          } else {
            setSrc({ type: "m3u8", url: data.url });
          }
        }
      } else if (activeProvider.name === "smashy") {
        const data = await getM3U8(activeProvider.url);
        setsubtitles(data.subtitles);
        setSrc({ type: "m3u8", url: SmashyStreamDecoder(data.sourceUrls[0]) });
        subtitlesManagerRef.current = new SubtitlesManager(
          videoRef.current,
          data.subtitles
        );
      } else if (activeProvider.name === "autoEmbed") {
        setSrc({ type: "m3u8", url: activeProvider.url });
      }
    };

    if (
      activeProvider.name !== prevActiveProvider.current.name ||
      activeProvider.index !== prevActiveProvider.current.index
    ) {
      prevActiveProvider.current = activeProvider;
      getSRC();
    }
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
  return (
    <>
      {ep || mediaType === "movie" ? (
        <div
          ref={playerRef}
          className={`moviebreak-player ${
            isControlsShown ? "showcontrols" : "hidecontrols"
          }`}
          onClick={playerTap}
          onDoubleClick={handleDoubleClick}
        >
          <video
            autoPlay
            ref={videoRef}
            poster={`https://image.tmdb.org/t/p/original/${
              episodeDetails?.still_path || movieInfos.backdrop_path
            }`}
          ></video>
          <div className="movie-infos">
            <div className="movie-ids">
              <h3>
                {mediaType === "tv" ? movieInfos.name : movieInfos.title}
                {episodeDetails
                  ? `- S${episodeDetails.season_number} E
            ${episodeDetails.episode_number}`
                  : ""}
              </h3>
            </div>
          </div>
          {src && src.url ? (
            <div className="moviebreak-controls">
              <div className="centerControls">
                <div
                  className="icon seekBackward seek"
                  onClick={(e) => {
                    e.stopPropagation();
                    videoRef.current.currentTime -= 10;
                  }}
                >
                  <UndoIcon />
                  <p>10</p>
                </div>
                <PlayButton videoRef={videoRef} hlsRef={hlsRef} />
                <div
                  className="icon seekForward seek"
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
                  {mediaType === "tv" ? (
                    <>
                      {+ep !== "1" ? (
                        <div
                          className="icon previousEpisode-button"
                          onClick={() => {
                            navigate(
                              `/${mediaType}/${movieID}/${season}/${ep - 1}`,
                              { replace: true }
                            );
                          }}
                        >
                          <NavigateBefore />
                        </div>
                      ) : null}
                      {+ep !== seasonDetails.episodes.length ? (
                        <div
                          className="icon nextEpisode-button"
                          onClick={() => {
                            navigate(
                              `/${mediaType}/${movieID}/${season}/${+ep + 1}`,
                              { replace: true }
                            );
                          }}
                        >
                          <NavigateNextIcon />
                        </div>
                      ) : null}
                    </>
                  ) : null}
                  <div className="right-controls">
                    {isControlsShown && (
                      <>
                        {src.type === "m3u8" && (
                          <>
                            <SubtitleSwitcher
                              subtitlesManagerRef={subtitlesManagerRef}
                              hlsRef={hlsRef}
                            />
                            {src && <QualitySwitcher hlsRef={hlsRef} />}
                            <AudioSwitcher hlsRef={hlsRef} />
                          </>
                        )}
                      </>
                    )}
                    <div
                      className="icon fullscreen-toggle"
                      onClick={handleDoubleClick}
                    >
                      <Fullscreen />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
          {subtitles ? (
            <SubtitlesLoader subtitlesManagerRef={subtitlesManagerRef} />
          ) : null}
          <div
            className="icon cloud"
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
              {slug.status === "loading" ? (
                <div>Loading RidoTV Servers...</div>
              ) : slug && slug.status === 200 ? (
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
              ) : slug && slug.status === 404 ? (
                <div style={{ margin: "0 auto" }}>RidoTV Unavailable</div>
              ) : null}
              {shahid4uServers.status === "loading" ? (
                <div>Loading Backup Servers...</div>
              ) : shahid4uServers[0] ? (
                shahid4uServers?.map((server, index) => {
                  return (
                    <div
                      key={`autoEmbed${index}`}
                      className={`provider ${
                        activeProvider.name === "shahid" &&
                        activeProvider.index === index
                          ? "active"
                          : ""
                      }`}
                      onClick={() => {
                        if (isproviderListShown) {
                          setactiveProvider({
                            name: "shahid",
                            url: server.url,
                            index: index,
                            server: server.name,
                          });
                        }
                      }}
                    >
                      {server.name} {server.name === "vdbtm" ? "(slow)" : null}
                    </div>
                  );
                })
              ) : null}
              {slug.status === 404 &&
              !shahid4uServers.status === "loading" &&
              !shahid4uServers[0] ? (
                <div style={{ margin: "auto", color: "black" }}>
                  Oops! Video Unavailable
                </div>
              ) : null}

              {autoEmbedServers.status !== "loading" ? (
                autoEmbedServers?.map((server, index) => {
                  return (
                    <div
                      key={`autoEmbed${server.title}`}
                      className={`provider ${
                        activeProvider.name === "autoEmbed" &&
                        activeProvider.index === index
                          ? "active"
                          : ""
                      }`}
                      onClick={() => {
                        if (isproviderListShown) {
                          setactiveProvider({
                            name: "autoEmbed",
                            url: server.file,
                            index: index,
                          });
                        }
                      }}
                    >
                      AutoEmbed - {server.title}
                    </div>
                  );
                })
              ) : (
                <div>Loading AutoEmbed Servers...</div>
              )}
              {smashyPlayers && smashyPlayers.status !== "loading" ? (
                smashyPlayers?.map((player, index) => {
                  return (
                    <div
                      key={player.name}
                      className={`provider ${
                        activeProvider.name === "smashy" &&
                        activeProvider.index === index
                          ? "active"
                          : ""
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
                })
              ) : (
                <div>Loading Smashy Servers...</div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div>Missing EP or MediaType</div>
      )}
    </>
  );
};

export default VideoPlayer;
