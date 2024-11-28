import "../styles/MovieInfos.css";
import { useParams } from "@solidjs/router";
import { createSignal, Show } from "solid-js";
import { getFullAPIUrl } from "../modules/tmdb";
import { selectedMovie } from "../modules/globalStore";
import LazyImage from "../Components/LazyImage";
import {
  BookmarkAddOutlined,
  LinkOffSharp,
  LinkRounded,
  Star,
} from "@suid/icons-material";
import Genres from "../Components/Info/Genres";

const Info = () => {
  const { mediaType, id } = useParams();

  const [movieDetails, setMovieDetails] = createSignal(selectedMovie);

  const fetchMovieDetails = async () => {
    const res = await fetch(getFullAPIUrl(`/${mediaType}/${id}`));
    setMovieDetails(await res.json());
  };

  fetchMovieDetails();
  return (
    <div class="movieInfos">
      <div className="backdrop">
        <img
          src={
            "https://image.tmdb.org/t/p/original" + movieDetails().backdrop_path
          }
        />
      </div>

      <div className="overview flex">
        <div className="poster">
          <div className="badge save glow dark-bg">
            <BookmarkAddOutlined />
          </div>
          <LazyImage
            src={"https://image.tmdb.org/t/p/w500" + movieDetails().poster_path}
          />
        </div>
        <div className="details">
          <div className="section dark-bg">
            <div className="title flex">
              <Show when={movieDetails().homepage} fallback={<LinkOffSharp />}>
                <a
                  className="link glow"
                  target="_blank"
                  href={movieDetails().homepage}
                >
                  <LinkRounded />
                </a>
              </Show>
              <h4> {movieDetails().title || movieDetails().name}</h4>
              <div className="date">
                {movieDetails().release_date?.slice(0, 4)}
              </div>
            </div>
            <div className="text">{movieDetails().overview}</div>
            <div className="metaInfo flex">
              <div className="flex rating">
                <Star />
                {movieDetails().vote_average?.toFixed(1)}
              </div>
              <Genres genres={movieDetails().genres} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Info;
