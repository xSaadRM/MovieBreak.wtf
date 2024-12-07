import { useNavigate } from "@solidjs/router";
import { selectedMovie } from "../modules/globalStore";
import LazyImage from "./LazyImage";
import { BookmarkAddOutlined, Star } from "@suid/icons-material";
import { Show } from "solid-js";

const MovieCard = (props) => {
  const navigate = useNavigate();
  const { movie, isSlideDraging } = props;

  const mediaType = movie.media_type || props.type;
  const releaseDate = movie.release_date || movie.first_air_date;
  const title = movie.title || movie.name || "Untitled";
  const voteAverage =
    movie.vote_average !== undefined ? movie.vote_average.toFixed(1) : "N/A";
  const posterPath = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "";

  return (
    <Show when={movie}>
      <div
        class="movie flex"
        onclick={() => {
          if (!isSlideDraging) {
            selectedMovie.Set(movie);
            const path = `info/${mediaType}/${movie.id}`;
            navigate(path);
          }
        }}
      >
        <div className="poster">
          <div class="badge autoHide mediaType">{mediaType.toUpperCase()}</div>
          <div class="badge autoHide date">
            {releaseDate ? releaseDate.slice(0, 4) : "N/A"}
          </div>
          <div className="badge autoHide rating">
            <Star fontSize="x-small" />
            {voteAverage}
          </div>
          <div className="badge autoHide save glow">
            <BookmarkAddOutlined />
          </div>
          <LazyImage alt={title} src={posterPath} />
        </div>
        <div className="title">
          <p className="text">{title}</p>
        </div>
      </div>
    </Show>
  );
};

export default MovieCard;
