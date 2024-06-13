export const fetchAutoEmbedCC = async (id, season, ep, setServers) => {
  setServers({ status: "loading" });
  let servers = [];

  try {
    const response = await fetch(
      `https://autoembed.cc/embed/player.php?id=${id}${
        season && ep ? `&s=${season}&e=${ep}` : ""
      }`
    );
    const data = await response.text();
    const matchedData = /"file": (\[{[\S\s]*\},[\s]*])/g.exec(data);
    const validJSONString = matchedData[1].replace(/,]/, "]");
    const parsedData = JSON.parse(validJSONString);
    servers = servers.concat(parsedData);
    setServers(servers);
  } catch (error) {}

  try {
    const response = await fetch(
      `https://cg.autoembed.cc/api/cinego/${
        season && ep ? "tv" : "movie"
      }/UpCloud/${id}${season && ep ? `/${season}/${ep}` : ""}`
    );
    const data = await response.json();
    const m3u8 = await data.sources.filter(
      (source) => source.quality == "auto"
    );
    servers = servers.concat([{ title: "Original", file: m3u8[0].url }]);
    setServers(servers);
  } catch (error) {}
};
