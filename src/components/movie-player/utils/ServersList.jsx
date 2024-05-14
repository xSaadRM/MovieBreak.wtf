import React, { useEffect, useState } from "react";
import { fetchRidoTV, getSlug } from "../providers/ridotv";
import {
  getM3U8,
  getWorkingPlayers,
} from "../providers/smashy-stream/smashyFetch";
import SmashyStreamDecoder from "../providers/smashy-stream/decoder";
import Cloud from "@mui/icons-material/Cloud";

const ServersList = ({
  playerReady,
  mediaAttached,
  loadSRC,
  episodeDetails,
  movieInfos,
}) => {
  const [isproviderListShown, setisproviderListShown] = useState(false);
  const [smashyPlayers, setSmashyPlayers] = useState([]);
  const [activeProvider, setactiveProvider] = useState({});
  const [slug, setSlug] = useState({});
  const [src, setSrc] = useState("");

  useEffect(() => {
    loadSRC(src);
  }, [src]);

  useEffect(() => {
    const getSRC = async () => {
      if (activeProvider.name === "ridotv") {
        if (slug && slug.status == 200) {
          const m3u8 = await fetchRidoTV(
            slug.data,
            episodeDetails.episode_number,
            episodeDetails.season_number
          );
          setSrc(m3u8);
        }
      } else if (activeProvider.name === "smashy") {
        const data = await getM3U8(activeProvider.url);
        setSrc(SmashyStreamDecoder(data.sourceUrls[0]));
      }
    };
    getSRC();
  }, [activeProvider]);
  useEffect(() => {
    setisproviderListShown(false);
  }, [playerReady]);

  useEffect(() => {
    const showProvidersList = async () => {
      const getSlugResponse = await getSlug(movieInfos.id, movieInfos.name);
      setSlug(getSlugResponse);
      const getSmashyPlayers = await getWorkingPlayers(
        movieInfos.id,
        episodeDetails.season_number,
        episodeDetails.episode_number
      );
      setSmashyPlayers(getSmashyPlayers);
    };
    showProvidersList();
  }, [mediaAttached]);

  return (
    <>
      <div
        className="cloud-icon"
        onClick={(e) => {
          e.stopPropagation();
          setisproviderListShown((prev) => !prev);
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
              className="provider"
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
                  activeProvider.index == index ? "active" : ""
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
    </>
  );
};

export default ServersList;
