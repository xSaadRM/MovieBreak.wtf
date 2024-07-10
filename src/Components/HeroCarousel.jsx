import { ArrowBack, ArrowForward, Star } from "@suid/icons-material";
import LazyImage from "./LazyImage";
import { createSignal, For, Show } from "solid-js";
import "../styles/carousel.css";
import "solid-slider/slider.css";
import { Slider, SliderButton, SliderProvider } from "solid-slider";
import { autoplay } from "./autoPlayPlugin";
import "../styles/hero_carousel.css";

const HeroCarousel = (props) => {
  const [slideIndex, setSlideIndex] = createSignal({ max: 99, current: 0 });

  return (
    <div class="carousel">
      <SliderProvider>
        <Slider
          plugins={[autoplay(5000, {})]}
          options={{
            slides: { perView: 1 },
            slideChanged: (data) => {
              setSlideIndex({
                max: data.track.details.maxIdx,
                current: data.track.details.abs,
              });
            },
          }}
        >
          <For each={props.list}>
            {(movie, index) => (
              <div class="movie flex">
                <div className="backdrop">
                  <div className="info flex">
                    <div className="date">{movie.release_date.slice(0, 4)}</div>
                    <div className="title">{movie.title || movie.name}</div>
                    <div className="flex rating">
                      <Star />
                      {movie.vote_average.toFixed(2)}
                    </div>
                  </div>

                  <LazyImage
                    ratio="135/202"
                    alt={movie.title || movie.name || "untitled"}
                    src={
                      "https://image.tmdb.org/t/p/original" +
                      movie.backdrop_path
                    }
                  />
                </div>
                <div className="shadow"></div>
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

export default HeroCarousel;
