import React, { useState } from "react";
import Skeleton from "@mui/material/Skeleton";

const LazyImage = ({ src, alt, className, style, ratio }) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleImageLoaded = () => {
    setIsLoading(false);
  };

  return (
    <>
      <img
        loading="lazy"
        style={{
          ...style,
          zIndex: isLoading ? "-5" : "",
          position: isLoading ? "absolute" : "static",
          visibility: isLoading ? "hidden" : "visible",
        }}
        src={src}
        alt={alt}
        className={className}
        onLoad={handleImageLoaded}
      />
      {isLoading ? (
        <Skeleton
          animation="wave"
          width={!className && !style ? "100%" : ""}
          height={!className && !style ? "auto" : ""}
          style={{ aspectRatio: ratio }}
          className={className}
          variant="rectangular"
        />
      ) : null}
    </>
  );
};

export default LazyImage;
