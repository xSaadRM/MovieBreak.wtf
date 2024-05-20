import React, { useState } from "react";
import SubtitlesIcon from "@mui/icons-material/Subtitles";
import SubtitlesOffIcon from "@mui/icons-material/SubtitlesOff";

const SubtitleSwitcher = ({ hlsRef, subtitlesManagerRef }) => {
  const [isSubtitleMenuShown, setIsSubtitleMenuShown] = useState(false);
  const [subtitleTrack, setSubtitleTrack] = useState(
    hlsRef.current.subtitleTrack
  );

  const handleSubtitleTrackChange = (index) => {
    hlsRef.current.subtitleTrack = index;
    setSubtitleTrack(index);
  };

  return (
    <>
      <div
        className="subtitleIcon"
        onClick={() => {
          setIsSubtitleMenuShown((prev) => !prev);
        }}
      >
        {hlsRef.current.subtitleTrack === -1 ? (
          <SubtitlesOffIcon />
        ) : (
          <SubtitlesIcon />
        )}{" "}
      </div>
      <div className={`optionSwitcher ${isSubtitleMenuShown ? "show" : ""}`}>
        <div
          className={`option ${subtitleTrack === -1 ? "active" : ""}`}
          onClick={() => {
            handleSubtitleTrackChange(-1);
          }}
        >
          {subtitleTrack === -1 ? "Disabled" : "Disable"}
        </div>
        {hlsRef.current.subtitleTracks[0]
          ? hlsRef.current.subtitleTracks.map((subTrack, index) => {
              return (
                <div
                  key={index}
                  className={`option ${
                    subtitleTrack === index ? "active" : ""
                  }`}
                  onClick={() => {
                    handleSubtitleTrackChange(index);
                  }}
                >
                  {subTrack.name}
                </div>
              );
            })
          : subtitlesManagerRef.current?.subtitleArray.map(
              (subTrack, index) => {
                return (
                  <div
                    key={index}
                    className="option"
                    onClick={() => {
                      subtitlesManagerRef.current.switchTrack(index);
                    }}
                  >
                    {subTrack.name}
                  </div>
                );
              }
            )}
      </div>
    </>
  );
};

export default SubtitleSwitcher;
