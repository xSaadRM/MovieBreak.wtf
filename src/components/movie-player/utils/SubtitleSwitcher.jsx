import React, { useState } from "react";
import SubtitlesIcon from "@mui/icons-material/Subtitles";
import SubtitlesOffIcon from "@mui/icons-material/SubtitlesOff";

const SubtitleSwitcher = ({ hlsRef }) => {
  const [isSubtitleMenuShown, setIsSubtitleMenuShown] = useState(false);
  let hls = hlsRef.current;
  return (
    <>
      <div
        className="subtitleIcon"
        onClick={() => {
          setIsSubtitleMenuShown((prev) => !prev);
        }}
      >
        {hls.subtitleTrack == -1 ? <SubtitlesOffIcon /> : <SubtitlesIcon />}{" "}
      </div>
      <div className={`optionSwitcher ${isSubtitleMenuShown ? "show" : ""}`}>
        <div
          className="option"
          onClick={() => {
            hls.subtitleTrack = -1;
          }}
        >
          {hls.subtitleTrack == -1 ? "Disabled" : "Disable"}
        </div>
        {hls?.subtitleTracks?.map((subTrack, index) => {
          return (
            <div
              className="option"
              onClick={() => {
                hls.subtitleTrack = index;
              }}
            >
              {subTrack.name}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default SubtitleSwitcher;
