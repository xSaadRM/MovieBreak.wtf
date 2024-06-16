import React, { useEffect, useState } from "react";
import Skeleton from "@mui/material/Skeleton";
const Overview = ({ genres, overviewText }) => {
  const [isOverviewAllShowed, setIsOverviewAllShowed] = useState(false);
  const [wordsInOverview, setWordsInOverview] = useState(13);

  useEffect(() => {
    if (window.innerWidth >= 800) {
      setWordsInOverview(50);
    }
  }, []);

  return (
    <div className="overview">
      <div className="genres">
        {/* <p className="title">Genres</p> */}
        {genres ? (
          genres.map((genre) => <p key={genre.name}>{genre.name}</p>)
        ) : (
          <>
            <Skeleton className="text" width={"25%"} />
            <Skeleton className="text" width={"25%"} />
            <Skeleton className="text" width={"25%"} />
          </>
        )}
      </div>
      {overviewText !== "" ? (
        <>
          <p className="title">Overview</p>
          {overviewText ? (
            <p className="text">
              {!isOverviewAllShowed
                ? overviewText.split(" ").slice(0, wordsInOverview).join(" ") +
                  "...."
                : overviewText}
              {!isOverviewAllShowed ? (
                <span
                  className="show-more-toggle"
                  onClick={setIsOverviewAllShowed}
                >
                  Show more
                </span>
              ) : null}
            </p>
          ) : (
            <>
              <Skeleton className="text" />
              <Skeleton className="text" />
              <Skeleton className="text" width="50%" />
            </>
          )}
        </>
      ) : null}
    </div>
  );
};

export default Overview;
