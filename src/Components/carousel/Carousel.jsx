import { ArrowBack, ArrowForward } from "@suid/icons-material";
import { createSignal, For, Show } from "solid-js";
import "/src/styles/carousel.css";
import "solid-slider/slider.css";
import { Slider, SliderButton, SliderProvider } from "solid-slider";
import MovieCard from "../MovieCard";

const Carousel = (props) => {
  const [slideIndex, setSlideIndex] = createSignal({ max: 99, current: 0 });
  const [slideStatus, setSlideStatus] = createSignal({
    dragStarted: false,
    dragChecked: false,
    dragEnded: false,
  });
  const isSlideDraging =
    slideStatus().dragStarted && slideStatus().dragChecked ? true : false;

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
            slideChanged: (data) => {
              setSlideIndex({
                max: data.track.details.maxIdx,
                current: data.track.details.abs,
              });
            },
          }}
        >
          <For each={props.list}>
            {(movie) => (
              <MovieCard
                type={props.type}
                movie={movie}
                isSlideDraging={isSlideDraging}
              />
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
