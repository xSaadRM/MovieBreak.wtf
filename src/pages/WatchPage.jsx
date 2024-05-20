import { useState } from "react";
import "../styles/WatchPage.css";
import React from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import HLSPlayer from "../components/movie-player/HLSPlayer";

const WatchPage = ({ state }) => {
  const { seasonDetails } = state;
  const { mediaType, ep } = useParams();
  const [isOverviewAllShowed, setIsOverviewAllShowed] = useState(false);
  const episodeNumber = ep - 1;
  const episodeDetails = seasonDetails.episodes[episodeNumber];

  return (
    <div className="watch-page">
      {mediaType === "tv" && <Navbar />}
      <div className="movie-description-container">
        <>
          <HLSPlayer state={state} episodeDetails={episodeDetails} />
          <div className="sources-container"></div>
        </>
        {mediaType === "tv" && (
          <>
            <div
              className="blured-backdrop"
              style={{
                backgroundImage: `url(https://image.tmdb.org/t/p/original/${episodeDetails.still_path})`,
              }}
            ></div>
            <div className="sections-container">
              <div className="sections">
                <div className="section active">
                  <h4>Episode Overview</h4>
                </div>
              </div>
              <div className="overview">
                <p>
                  {!isOverviewAllShowed
                    ? episodeDetails.overview
                        .split(" ")
                        .slice(0, 13)
                        .join(" ") + "...."
                    : episodeDetails.overview}
                  {!isOverviewAllShowed ? (
                    <span
                      className="show-more-toggle"
                      onClick={setIsOverviewAllShowed}
                    >
                      Show more
                    </span>
                  ) : null}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default WatchPage;
