export class SubtitlesManager {
  constructor(videoElement, plainSubtitles) {
    this.index = 0;
    this.subtitles = null;
    this.videoElement = videoElement;
    this.handleTimeupdate = this.handleTimeupdate.bind(this);
    this.plainSubtitles = plainSubtitles;
    this.subtitleArray = [];
  }

  async init(subtitleContainer, index) {
    this.subtitleContainer = subtitleContainer;
    if (this.plainSubtitles) {
      let subtitleList = this.plainSubtitles.split(",");
      subtitleList.forEach((subtitle) => {
        if (subtitle !== "") {
          const formattedSub = subtitle.split("]");
          this.subtitleArray.push({
            name: formattedSub[0].replace("[", ""),
            url: formattedSub[1],
          });
        }
      });
      this.subtitles = await this.fetchSubtitles(
        this.subtitleArray[index || this.index].url
      );
      this.updateSubtitleDisplay();
      this.videoElement.addEventListener("timeupdate", this.handleTimeupdate);
    } else {
      console.log("No subtitles found");
    }
  }

  async fetchSubtitles(subtitleUrl) {
    try {
      const response = await fetch(subtitleUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch subtitles: " + response.status);
      }
      const subsFile = await response.text();
      if (subsFile.trim() === "") {
        throw new Error("Subtitle file is empty");
      }
      const parsedSubtitles = this.parseSubtitles(subsFile);
      return parsedSubtitles;
    } catch (error) {
      console.error("Error fetching subtitles:", error);
      return null;
    }
  }

  parseSubtitles(subsFile) {
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
        cueStart = this.parseTime(startTime);
        cueEnd = this.parseTime(endTime);
      } else {
        cueText += line + " ";
      }
    }

    return parsedSubtitles;
  }

  parseTime(timeString) {
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
  }

  handleTimeupdate(event) {
    this.currentPlaybackTime = event.target.currentTime;
    this.updateSubtitleDisplay();
  }

  updateSubtitleDisplay() {
    if (this.subtitles) {
      const currentSubtitle = this.getCurrentSubtitle();
      this.subtitleContainer.textContent = currentSubtitle;
    }
  }

  getCurrentSubtitle() {
    for (let i = 0; i < this.subtitles.length; i++) {
      const subtitle = this.subtitles[i];
      if (
        this.currentPlaybackTime >= subtitle.start &&
        this.currentPlaybackTime <= subtitle.end
      ) {
        return subtitle.text;
      }
    }
    return "";
  }

  async switchTrack(index) {
    this.index = index;
  }
  destroy() {
    if (this.subtitleContainer) {
      this.subtitleContainer.textContent = "";
    }
    this.subtitleArray = [];
    this.videoElement.removeEventListener("timeupdate", this.handleTimeupdate);
  }
}
