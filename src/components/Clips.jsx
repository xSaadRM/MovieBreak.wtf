import React from "react";
import Slider from "react-slick";
import LazyImage from "./LazyImage";

const Clips = ({ videos }) => {
  const sortedVideos = videos?.sort((a, b) => {
    if (a.type === "Trailer" && b.type !== "Trailer") {
      return -1; // a comes before b
    } else if (a.type !== "Trailer" && b.type === "Trailer") {
      return 1; // b comes before a
    } else {
      return 0; // no change in order
    }
  });

  return (
    <div className="clips">
      {videos && videos[0] ? (
        <Slider
          lazyLoad={true}
          slidesToShow={2.2}
          slidesToScroll={2}
          infinite={false}
        >
          {sortedVideos.map((clip) => (
            <div
              className={`clip ${clip.type}`}
              key={clip.id}
              onClick={() => {
                window.open(`https://www.youtube.com/watch?v=${clip.key}`);
              }}
            >
              <span className="type">{clip.type}</span>
              <LazyImage
                className={"img"}
                ratio={"16/9"}
                src={`https://img.youtube.com/vi/${clip.key}/mqdefault.jpg`}
                alt={clip.name}
              />
            </div>
          ))}
        </Slider>
      ) : !videos ? (
        <Slider
          lazyLoad={true}
          slidesToShow={2.2}
          slidesToScroll={2}
          infinite={false}
        >
          <div className="clip">
            <LazyImage className={"img"} ratio={"16/9"} src={``} alt={"none"} />
          </div>
          <div className="clip">
            <LazyImage className={"img"} ratio={"16/9"} src={``} alt={"none"} />
          </div>
          <div className="clip">
            <LazyImage className={"img"} ratio={"16/9"} src={``} alt={"none"} />
          </div>
        </Slider>
      ) : null}
    </div>
  );
};

export default Clips;
