import { Star } from "@suid/icons-material";
import LazyImage from "./LazyImage";
import { For } from "solid-js";
import "../styles/carousel.css";
import "solid-slider/slider.css";
import { Slider } from "solid-slider";

const Carousel = (props) => {

  return (
      <Slider options={{slides: {perView: "auto"}}}>
        <For each={props.list}>
          {(movie, index) => (
            <div class="movie flex">
              <div className="poster">
                <div class="badge mediaType">
                  {movie.media_type.toUpperCase()}
                </div>
                <div className="badge rating">
                  <Star fontSize="x-small" />
                  {movie.vote_average.toFixed(2)}
                </div>
                <LazyImage
                  ratio="135/202"
                  alt={movie.title || movie.name || "untitled"}
                  src={
                    "https://image.tmdb.org/t/p/original" + movie.poster_path
                  }
                />
              </div>

              <div className="title">
                <p className="text">{movie.title || movie.name}</p>
              </div>
              <div className="title">
                <p className="text">{movie.title || movie.name}</p>
              </div>
            </div>
          )}
        </For>
      </Slider>
  );
};

export default Carousel;
