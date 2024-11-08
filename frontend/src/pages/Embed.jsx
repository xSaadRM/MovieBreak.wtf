import React, { useEffect } from "react";
import "../styles/Embed.css";

const Embed = () => {
  const params = new URLSearchParams(window.location.search).keys();

  useEffect(() => {
    console.log(params);
  }, []);

  return (
    <div className="embedPage">
      <iframe
        allowfullscreen
        src="http://192.168.1.104:3000/tv/106379/1/5"
      ></iframe>
    </div>
  );
};

export default Embed;
