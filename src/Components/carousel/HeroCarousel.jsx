import { ArrowBack, ArrowForward, Star } from "@suid/icons-material";
import LazyImage from "../LazyImage";
import { createSignal, For, Show } from "solid-js";
import "/src/styles/carousel.css";
import "solid-slider/slider.css";
import { Slider, SliderButton, SliderProvider } from "solid-slider";
import { autoplay } from "./autoPlayPlugin";
import "/src/styles/hero_carousel.css";
import { useNavigate } from "@solidjs/router";
import { selectedMovie } from "../../modules/globalStore";

const HeroCarousel = (props) => {
  const navigate = useNavigate();

  const [slideIndex, setSlideIndex] = createSignal({ max: 99, current: 0 });
  const [slideStatus, setSlideStatus] = createSignal({
    dragStarted: false,
    dragChecked: false,
    dragEnded: false,
  });
  const isSlideDraging =
    slideStatus().dragStarted && slideStatus().dragChecked ? true : false;

  return (
    <div class="carousel hero">
      <SliderProvider>
        <Slider
          plugins={[autoplay(5000, {})]}
          options={{
            loop: false,
            slides: { perView: 1 },
            slideChanged: (data) => {
              setSlideIndex({
                max: data.track.details.maxIdx,
                current: data.track.details.abs,
              });
            },
            dragChecked: () => {
              setSlideStatus((prev) => {
                return { ...prev, dragChecked: true };
              });
            },
            dragStarted: () => {
              setSlideStatus((prev) => {
                return { ...prev, dragStarted: true };
              });
            },
            dragEnded: () => {
              setSlideStatus({
                dragStarted: false,
                dragChecked: false,
                dragEnded: false,
              });
            },
          }}
        >
          <For each={props.list}>
            {(movie) => (
              <div class="movie flex">
                <div className="backdrop">
                  <div className="info flex">
                    <div className="title">{movie.title || movie.name}</div>
                    <div className="flex rating">
                      <div className="date">
                        {movie.release_date.slice(0, 4)}
                      </div>
                      <Star />
                      {movie.vote_average?.toFixed(1)}
                    </div>
                    <div
                      className="options"
                      onclick={() => {
                        if (!isSlideDraging) {
                          selectedMovie.Set(movie);
                          const path = `info/${
                            movie.media_type || props.type
                          }/${movie.id}`;
                          navigate(path);
                        }
                      }}
                    >
                      Play
                    </div>
                    <div className="genres"></div>
                  </div>
                  <LazyImage
                    alt={movie.title || movie.name || "untitled"}
                    src={
                      "https://image.tmdb.org/t/p/original" +
                      movie.backdrop_path
                    }
                  />
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

export default HeroCarousel;
