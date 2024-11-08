import React, { useRef, useEffect } from "react";

const SubtitlesLoader = ({ subtitlesManagerRef }) => {
  const subtitleContainerRef = useRef(null);

  useEffect(() => {
    const subtitleContainerElement = subtitleContainerRef.current;

    if (subtitlesManagerRef.current && subtitleContainerElement) {
      subtitlesManagerRef.current.init(subtitleContainerElement);
      console.log("init");
    }

    return () => {
      if (subtitlesManagerRef.current) {
        console.log("destroy");
        subtitlesManagerRef.current.destroy();
      }
    };
  }, [subtitlesManagerRef]);

  return <p className="subtitleText" ref={subtitleContainerRef}></p>;
};

export default SubtitlesLoader;
