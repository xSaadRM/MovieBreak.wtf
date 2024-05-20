export const fetchAutoEmbedCC = async (id, season, ep) => {
  const response = await fetch(
    `https://autoembed.cc/embed/player.php?id=${id}${
      season && ep ? `&s=${season}&e=${ep}` : ""
    }`
  );
  const data = await response.text();
  const matchedData = /"file": (\[[\S\s]*\])/g.exec(data);
  const validJSONString = matchedData[1].replace(/,]/, "]");
  const parsedData = JSON.parse(validJSONString);

  return parsedData;
};
