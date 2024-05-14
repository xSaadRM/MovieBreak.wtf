export const fetchRidoTV = async (slug, ep, season) => {
  try {
    const getEpisodes = async (slug) => {
      try {
        const response = await fetch(
          `https://rv.lil-hacker.workers.dev?url=https://ridomovies.tv/tv/${slug}&mirror=rido`
        );

        const htmlContent = await response.text();
        // Regular expression to match the episodes JSON data
        const regex = /"episodes\\":\[(.*?)\]/g;
        let matches;
        const seasons = [];
        let seasonNumber = 1; // Counter for labeling seasons
        while ((matches = regex.exec(htmlContent)) !== null) {
          // matches[1] contains the captured group inside the parentheses
          const cleanJson = matches[1]
            .replace(/\\"/g, `"`)
            .replace(/\\\\"/g, "`");
          // Parse the cleaned JSON string
          const episodesData = JSON.parse(`[${cleanJson}]`);

          // Extract ID and episodeNumber of each episode and assign season number
          const episodes = episodesData.map((episode) => ({
            id: episode.id,
            episodeNumber: episode.episodeNumber,
            season: seasonNumber, // Add season number to each episode
          }));

          // Store episodes in the corresponding season
          seasons.push(episodes);

          seasonNumber++; // Increment season number
        }
        // Now seasons object contains episodes grouped by season
        // Call getIFrame with seasons object
        return getIFrame(seasons);
      } catch (error) {
        console.log(error);
      }
    };

    const getIFrame = async (seasons) => {
      if (seasons.length > 0) {
        const episodeId = seasons[season - 1][ep - 1].id;
        const response = await fetch(
          `https://rv.lil-hacker.workers.dev/?url=https%3A%2F%2Fridomovies.tv%2Fcore%2Fapi%2Fepisodes%2F${episodeId}%2Fvideos&mirror=rido`,
          {
            headers: {
              accept: "*/*",
              "accept-language": "en-US,en;q=0.9",
              "sec-ch-ua":
                '"Microsoft Edge";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
              "sec-ch-ua-mobile": "?0",
              "sec-ch-ua-platform": '"Windows"',
              "sec-fetch-dest": "empty",
              "sec-fetch-mode": "cors",
              "sec-fetch-site": "cross-site",
            },
            referrerPolicy: "no-referrer",
            body: null,
            method: "GET",
          }
        );
        const data = await response.json();
        const dataIFrameSrc = data.data[0].url.match(/data-src="([^"]+)"/);

        if (dataIFrameSrc) {
          const dataSrcValue = dataIFrameSrc[1];
          return getM3U8(dataSrcValue);
        } else {
          console.log("No data-src attribute found in the URL.");
        }
      } else {
      }
    };
    const getM3U8 = async (iFrameURL) => {
      const response = await fetch(
        `https://rv.lil-hacker.workers.dev/?url=${iFrameURL}&mirror=rido`
      );
      const data = await response.text();
      const scriptTagRegex = /<script[^>]*>(.*?)<\/script>/gs;
      const scriptTags = data.match(scriptTagRegex);
      if (scriptTags) {
        for (const scriptTag of scriptTags) {
          if (scriptTag.includes("jwplayer")) {
            const regex = /file:\s*"(.*?)"/;
            const match = regex.exec(scriptTag);
            if (match) {
              const fileUrl = match[1];
              return fileUrl;
            }
          }
        }
      } else {
        console.error("No script tags found");
      }
    };
    return getEpisodes(slug);
  } catch (error) {
    return error;
  }
};

export const getSlug = async (movieID, movieName) => {
  // Manual encoding for characters that aren't encoded in the standard encodeURIComponent function
  const manualEncode = (str) => {
    return Array.from(str)
      .map((char) => {
        const charCode = char.charCodeAt(0);
        // If the character is not alphanumeric or one of these: - _ . ! ~ * ' ( )
        if (
          (charCode >= 0x30 && charCode <= 0x39) || // 0-9
          (charCode >= 0x41 && charCode <= 0x5a) || // A-Z
          (charCode >= 0x61 && charCode <= 0x7a) || // a-z
          char === "-" ||
          char === "_" ||
          char === "." ||
          char === "!" ||
          char === "~" ||
          char === "*" ||
          char === "'" ||
          char === "(" ||
          char === ")"
        ) {
          return char;
        } else {
          return encodeURIComponent(char).replace(/%/g, "%25");
        }
      })
      .join("");
  };

  const encodedMovieName = manualEncode(movieName);

  try {
    const response = await fetch(
      `https://rv.lil-hacker.workers.dev/?url=https://ridomovies.tv/core/api/search?q=${encodedMovieName}&mirror=rido`,
      {
        headers: {
          accept: "*/*",
          "accept-language": "en-US,en;q=0.9",
          "sec-ch-ua":
            '"Microsoft Edge";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "cross-site",
        },
        referrerPolicy: "no-referrer",
        body: null,
        method: "GET",
      }
    );
    const data = await response.json();
    let found = false;
    for (const item of data.data.items) {
      if (item.contentable.tmdbId == movieID) {
        found = true;
        return { status: 200, data: item.slug };
      }
    }
    if (!found) {
      return { status: 404 };
    }
  } catch (error) {
    console.error("Error fetching", error);
  }
};
