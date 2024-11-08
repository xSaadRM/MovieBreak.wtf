const getDoodSource = async (embedUrl) => {
  function makePlay() {
    for (
      var a = "",
        t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
        n = t.length,
        o = 0;
      10 > o;
      o++
    )
      a += t.charAt(Math.floor(Math.random() * n));
    return a + "?token=nkvg1dk34s840c1sokyoo4y5&expiry=" + Date.now();
  }

  const response = await fetch(
    `https://rv.lil-hacker.workers.dev/proxy?mirror=dood&url=${embedUrl}`
  );
  const doc = await response.text();
  const pass_md5 = /'(\/pass_md5[\S]*)'/g.exec(doc);
  const passResponse = await fetch(`https://d000d.com/${pass_md5[1]}`);
  const passResponseText = await passResponse.text();
  const sourceUrl = `https://rv.lil-hacker.workers.dev/proxy?mirror=dood&url=${passResponseText}${makePlay()}`;
  return sourceUrl;
};
export const shahid4uFetch = async (
  mediaType,
  movieTitle,
  season,
  releaseYear
) => {
  const formatedTitle = movieTitle.replace(/[\s]/g, "-").toLowerCase();
  const fetchSeries = async () => {
    try {
      const arabicOrdinals = [
        "الاول",
        "الثاني",
        "الثالث",
        "الرابع",
        "الخامس",
        "السادس",
        "السابع",
        "الثامن",
        "التاسع",
        "العاشر",
      ];

      const response = await fetch(
        `https://rv.lil-hacker.workers.dev/proxy?mirror=shahid&url=https://shiid4u.com/season/%D9%85%D8%B3%D9%84%D8%B3%D9%84-${formatedTitle}-%D8%A7%D9%84%D9%85%D9%88%D8%B3%D9%85-${
          arabicOrdinals[season - 1]
        }-%D9%85%D8%AA%D8%B1%D8%AC%D9%85`
      );
      let responseText = await response.text();
      const responseMovieReleaseYear = /release-year\/(\d+)/g.exec(
        responseText
      );
      if (responseMovieReleaseYear[1] !== releaseYear) {
        const response = await fetch(
          `https://rv.lil-hacker.workers.dev/proxy?mirror=shahid&url=https://shiid4u.com/season/%D9%85%D8%B3%D9%84%D8%B3%D9%84-${formatedTitle}-%D8%A7%D9%84%D9%85%D9%88%D8%B3%D9%85-${
            arabicOrdinals[season - 1]
          }-%D9%85%D8%AA%D8%B1%D8%AC%D9%85-1`
        );
        if (response.status === 200) {
          responseText = await response.text();
        }
      }

      const targetedURL = `<a href="(https:\\/\\/[\\S]*\\/episode\\/[\\S]*-(\\d+)[\\S]*)"`;
      const episodeRegex = new RegExp(targetedURL + `[\\s]*class="epss">`, "g");
      const episodes = responseText.matchAll(episodeRegex);
      const episodesUrls = Array.from(episodes, (episode) => ({
        url: episode[1].replace("/episode/", "/watch/"),
        episodeNumber: episode[2],
      })).sort((a, b) => a.episodeNumber - b.episodeNumber);
      return episodesUrls;
    } catch (error) {
      return [];
    }
  };

  if (mediaType === "tv") {
    const episodesUrls = await fetchSeries();
    return episodesUrls;
  }
};

export const shahid4uFetchServers = async (episodeUrl) => {
  try {
    const response = await fetch(
      `https://rv.lil-hacker.workers.dev/proxy?mirror=shahid&url=${episodeUrl.url}`
    );
    const responseText = await response.text();
    const servers =
      /let[\s]+servers[\s]*=[\s]*JSON.parse\('(\[{[\s\S]*}])'\)/g.exec(
        responseText
      );
    const workingServers = JSON.parse(servers[1]).filter((server) => {
      if (
        server.name !== "fdewsdc" &&
        // server.name !== "luluvdo" &&
        server.name !== "hexload" &&
        server.name !== "doodstream" &&
        server.name !== "uqload"
        // server.name !== "fsdcmo"
      ) {
        return server;
      }
    });
    return workingServers;
  } catch (e) {
    return 404;
  }
};

export const shahid4uGetM3U8 = async (server) => {
  let response;
  try {
    response = await fetch(server.url);
  } catch (error) {
    response = await fetch(
      `https://rv.lil-hacker.workers.dev/proxy?mirror=shahid&url=${server.url}`
    );
  }
  try {
    const responseText = await response.text();
    const sourceFile =
      /sources:[\s]*\[[\s]*{[\s]*file[\s]*:[\s]*"([\S]*)"[\s]*}[\s]*]/g.exec(
        responseText
      );
    if (server.server === "vdbtm" || server.server === "vadbam") {
      return {
        status: 200,
        type: "mp4",
        url: `https://corsproxy.io/?${sourceFile[1]}`,
      };
    } else {
      return {
        status: 200,
        type: "m3u8",
        url: `${sourceFile[1]}`,
      };
    }
  } catch (error) {
    return { status: 404, url: server.url };
  }
};

/* 

servers with mp4 files:
"uqload";
"vudeo";

servers that needs reverse engineering :
"bembed"


servers with cors:
"fdewsdc"
"luluvdo"

*/
