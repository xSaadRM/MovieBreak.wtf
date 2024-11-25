import "../styles/MovieInfos.css";
import { useParams } from "@solidjs/router";
import { createSignal } from "solid-js";
import { getFullAPIUrl } from "../modules/tmdb";

const Info = () => {
  const { mediaType, id } = useParams();

  const [movieDetails, setMovieDetails] = createSignal({});

  const fetchMovieDetails = async () => {
    const res = await fetch(getFullAPIUrl(`${mediaType}/${id}`));
    setMovieDetails(await res.json());
  };

  fetchMovieDetails();
  return (
    <div class="movieInfos flex">
      <h3 className="title">{movieDetails().title || movieDetails().name}</h3>
    </div>
  );
};

export default Info;
