import React, { useRef, useEffect } from "react";

const SubtitlesLoader = ({ subtitlesManagerRef }) => {
  const subtitleContainerRef = useRef(null);

  useEffect(() => {
    const subtitleContainerElement = subtitleContainerRef.current;

    if (subtitlesManagerRef && subtitleContainerElement) {
      subtitlesManagerRef.current.init(subtitleContainerElement);
    }

    return () => {
      if (subtitlesManagerRef) {
        subtitlesManagerRef.current.destroy();
      }
    };
  }, [subtitlesManagerRef]);

  return <p className="subtitleText" ref={subtitleContainerRef}></p>;
};

export default SubtitlesLoader;
