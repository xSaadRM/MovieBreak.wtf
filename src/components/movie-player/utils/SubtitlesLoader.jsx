import React, { useEffect, useState } from "react";

const SubtitlesLoader = ({ subtitleUrl, videoTime }) => {
  const [subtitles, setSubtitles] = useState([]);

  useEffect(() => {
    const fetchSubtitles = async () => {
      try {
        const response = await fetch(subtitleUrl);
        if (!response.ok) {
          throw new Error("Failed to fetch subtitles: " + response.status);
        }
        const subsFile = await response.text();
        if (subsFile.trim() === "") {
          throw new Error("Subtitle file is empty");
        }
        const parsedSubtitles = parseSubtitles(subsFile);
        setSubtitles(parsedSubtitles);
      } catch (error) {
        console.error("Error fetching subtitles:", error);
      }
    };

    fetchSubtitles();
  }, [subtitleUrl]);

  const parseSubtitles = (subsFile) => {
    const lines = subsFile.split(/\r?\n/);
    const parsedSubtitles = [];
    let cueStart = null;
    let cueEnd = null;
    let cueText = "";

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (line === "") {
        if (cueStart !== null && cueEnd !== null && cueText !== "") {
          parsedSubtitles.push({
            start: cueStart,
            end: cueEnd,
            text: cueText.trim(),
          });
          cueStart = null;
          cueEnd = null;
          cueText = "";
        }
      } else if (line.includes("-->")) {
        const [startTime, endTime] = line.split(" --> ");
        cueStart = parseTime(startTime);
        cueEnd = parseTime(endTime);
      } else {
        cueText += line + " ";
      }
    }

    return parsedSubtitles;
  };

  const parseTime = (timeString) => {
    if (!timeString) {
      return 0; // Return 0 if timeString is undefined or empty
    }

    const timeParts = timeString.split(/[:,]/);
    if (timeParts.length < 2 || timeParts.length > 3) {
      console.error("Invalid time format:", timeString);
      return 0; // Return 0 if timeString does not have the expected format
    }

    let hours = 0;
    let minutes = parseInt(timeParts[0], 10);
    let seconds = parseInt(timeParts[1], 10);
    let milliseconds = 0;

    // If there are three parts, parse hours, minutes, and seconds/milliseconds
    if (timeParts.length === 3) {
      hours = parseInt(timeParts[0], 10);
      minutes = parseInt(timeParts[1], 10);
      const secondsAndMillis = timeParts[2];
      seconds = parseInt(secondsAndMillis, 10);
      milliseconds = secondsAndMillis.includes(".")
        ? parseFloat(secondsAndMillis.split(".")[1])
        : 0;
    }

    return hours * 3600 + minutes * 60 + seconds + milliseconds / 1000;
  };

  const getCurrentSubtitle = () => {
    for (let i = 0; i < subtitles.length; i++) {
      const subtitle = subtitles[i];
      if (videoTime >= subtitle.start && videoTime <= subtitle.end) {
        return subtitle.text;
      }
    }
    return "";
  };

  return (
    <div className="subtitles-text">
      <p>{subtitleUrl != -1 && getCurrentSubtitle()}</p>
    </div>
  );
};

export default SubtitlesLoader;
