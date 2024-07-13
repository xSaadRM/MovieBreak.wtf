import { ArrowBack, ArrowForward, Star } from "@suid/icons-material";
import LazyImage from "./LazyImage";
import { createSignal, For, Show } from "solid-js";
import "../styles/carousel.css";
import "solid-slider/slider.css";
import { Slider, SliderButton, SliderProvider } from "solid-slider";

const Carousel = (props) => {
  const [slideIndex, setSlideIndex] = createSignal({ max: 99, current: 0 });

  return (
    <div class="carousel">
      <SliderProvider>
        <Slider
          options={{
            breakpoints: {
              "(max-width: 700px)": {
                slides: { perView: "5", spacing: 10 },
              },
              "(max-width: 600px)": {
                slides: { perView: "4", spacing: 10 },
              },
              "(max-width: 480px)": {
                slides: { perView: "3", spacing: 10 },
              },
              "(max-width: 360px)": {
                slides: { perView: "2.5", spacing: 10 },
              },
              "(max-width: 300px)": {
                slides: { perView: "2", spacing: 10 },
              },

            },
            slides: { perView: "7", spacing: 10 },
            slideChanged: (data) => {
              setSlideIndex({
                max: data.track.details.maxIdx,
                current: data.track.details.abs,
              });
              console.log(data.track.details);
            },
          }}
        >
          <For each={props.list}>
            {(movie, index) => (
              <div class="movie flex">
                <div className="poster">
                  <Show when={movie.media_type}>
                    <div class="badge mediaType">
                      {movie.media_type.toUpperCase()}
                    </div>
                  </Show>
                  <div class="badge date">
                    {(movie.release_date || movie.first_air_date).slice(0, 4)}
                  </div>
                  <div className="badge rating">
                    <Star fontSize="x-small" />
                    {movie.vote_average.toFixed(2)}
                  </div>
                  <LazyImage
                    ratio="135/202"
                    alt={movie.title || movie.name || "untitled"}
                    src={
                      "https://image.tmdb.org/t/p/w500" + movie.poster_path
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
        <Show when={slideIndex().current > 0}>
          <SliderButton class="prev" prev>
            <ArrowBack />
          </SliderButton>
        </Show>
        <Show when={slideIndex().current < slideIndex().max}>
          <SliderButton class="next" next>
            <ArrowForward />
          </SliderButton>
        </Show>
      </SliderProvider>
    </div>
  );
};

export default Carousel;
