import React, { useState } from "react";
import { Settings } from "@mui/icons-material";

const QualitySwitcher = ({ hlsRef }) => {
  const [isSettingsShown, setisSettingsShown] = useState(false);

  return (
    <>
      <div
        className="settings-icon"
        onClick={() => setisSettingsShown((prev) => !prev)}
      >
        <Settings />
      </div>
      <div className={`optionSwitcher ${isSettingsShown ? "show" : ""}`}>
        <div
          className={`option ${
            hlsRef.current.autoLevelEnabled ? "active" : ""
          }`}
          onClick={() => {
            setisSettingsShown(false);
            hlsRef.current.nextLevel = -1;
          }}
        >
          <p>auto</p>
          <p className="current">
            {hlsRef.current.autoLevelEnabled &&
              hlsRef.current.levels[hlsRef.current.currentLevel] &&
              "(" +
                hlsRef.current.levels[hlsRef.current.currentLevel].height +
                "p)"}
          </p>
        </div>
        {hlsRef.current?.levels.map((level, index) => (
          <div
            className={`option ${
              hlsRef.current.currentLevel === index &&
              !hlsRef.current.autoLevelEnabled
                ? "active"
                : ""
            }`}
            key={level.height}
            onClick={() => {
              setisSettingsShown(false);
              hlsRef.current.currentLevel = index;
            }}
          >
            {level.height}p
          </div>
        ))}
      </div>
    </>
  );
};

export default QualitySwitcher;
