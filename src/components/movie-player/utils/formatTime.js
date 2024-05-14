export const formatTime = (seconds) => {
  let date;
  if (seconds < 600) {
    date = new Date(seconds * 1000).toISOString().substring(15, 19);
  } else if (seconds < 3600) {
    date = new Date(seconds * 1000).toISOString().substring(14, 19);
  } else {
    date = new Date(seconds * 1000).toISOString().substring(12, 19);
  }
  return date;
};
