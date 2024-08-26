import "../styles/MovieInfos.css";
import { useParams } from "@solidjs/router";
import { createSignal } from "solid-js";
import { getFullAPIUrl } from "../Utils/tmdb";

const MovieInfos = () => {
  const { id } = useParams();

  const [movieDetails, setMovieDetails] = createSignal({});

  const fetchMovieDetails = async () => {
    const res = await fetch(
      getFullAPIUrl(`https://api.themoviedb.org/3/movie/${id}`)
    );
    setMovieDetails(await res.json());
  };

  fetchMovieDetails();
  return (
    <div class="movieInfos flex">
      <h3 className="title">{movieDetails().title}</h3>
    </div>
  );
};

export default MovieInfos;
