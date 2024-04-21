import React from "react";
import ScaleLoader from "react-spinners/ScaleLoader";

const LoadingAnimation = ({ loading }) => {
  return (
    loading && (
      <div className="loading-animation">
        <ScaleLoader
          color="blue"
          size={150}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    )
  );
};

export default LoadingAnimation;
