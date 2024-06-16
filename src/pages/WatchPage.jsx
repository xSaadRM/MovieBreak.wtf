import { useEffect, useState } from "react";
import "../styles/WatchPage.css";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import HLSPlayer from "../components/movie-player/HLSPlayer";
import Overview from "../components/Overview";
import Carousel from "../components/Carousel";
const WatchPage = ({ state, dispatch }) => {
  const { seasonDetails, movieInfos } = state;
  const { mediaType, movieID, season, ep } = useParams();
  const episodeNumber = ep - 1;
  const episodeDetails = seasonDetails.episodes[episodeNumber];
  const navigate = useNavigate();

  useEffect(() => {
    if (!movieInfos || movieInfos?.default) {
      const url = `/${mediaType}/${movieID}/${season}/?ep=${ep}`;
      navigate(url, { replace: true });
    }
  }, []);

  return (
    <div className="watch-page">
      <div className="movie-description-container">
        <>
          {movieInfos && !movieInfos.default && (
            <HLSPlayer
              key={window.location.pathname}
              dispatch={dispatch}
              state={state}
              episodeDetails={episodeDetails}
            />
          )}
          <div className="sources-container"></div>
        </>
        <>
          <div
            className="blured-backdrop"
            style={{
              backgroundImage: `url(https://image.tmdb.org/t/p/original/${episodeDetails?.still_path})`,
            }}
          ></div>
          <Overview overviewText={episodeDetails?.overview} genres={[" "]} />
          <div className="cast">
            <Carousel
              movies={episodeDetails?.guest_stars}
              media_type={"person"}
              category={"Credits"}
              className={"active"}
            />
          </div>
        </>
      </div>
    </div>
  );
};
export default WatchPage;
