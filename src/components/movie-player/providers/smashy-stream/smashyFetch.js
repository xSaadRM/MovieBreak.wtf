export const getWorkingPlayers = async (tmdb, season, episode) => {
  const [statusResponse, dataResponse] = await Promise.all([
    fetch(
      `https://embed.smashystream.com/status.php?tmdb=${tmdb}${
        season && episode ? `&season=${season}&episode=${episode}` : ""
      }`
    ),
    fetch(
      `https://embed.smashystream.com/dataa.php?tmdb=${tmdb}${
        season && episode ? `&season=${season}&episode=${episode}` : ""
      }`
    ),
  ]);

  const [statusData, data] = await Promise.all([
    statusResponse.json(),
    dataResponse.json(),
  ]);

  // Function to remove extra information from player names
  const removeExtraInfo = (name) => name.replace(/\s*\(.*?\)\s*/g, "");

  const workingPlayersNames = statusData
    .filter((player) => player.status === "Working")
    .map((player) => removeExtraInfo(player.player));

  const workingPlayers = data.url_array.filter((player) =>
    workingPlayersNames.includes(removeExtraInfo(player.name))
  );

  return workingPlayers;
};

export const getM3U8 = async (url) => {
  const response = await fetch(url);
  const responseJSON = await response.json();
  return responseJSON;
};
