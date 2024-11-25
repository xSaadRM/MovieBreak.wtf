import { createSignal, onCleanup, onMount } from "solid-js";
import { Skeleton } from "@suid/material";

const LazyImage = (props) => {
  const [isVisible, setIsVisible] = createSignal(false);
  const [imageState, setImageState] = createSignal(null);

  let imgRef;

  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 } // Trigger when 10% of the image is visible
    );

    if (imgRef) {
      observer.observe(imgRef);
    }

    onCleanup(() => {
      if (imgRef) {
        observer.unobserve(imgRef);
      }
    });
  });

  return (
    <div
      class="lazyImage flex"
      ref={imgRef}
      style={{ "aspect-ratio": props.ratio }}
    >
      {isVisible() && (
        <img
          data-state={imageState()}
          onerror={() => setImageState(false)}
          {...props}
          src={props.src}
          onload={() => setImageState(true)}
        />
      )}
      <div class="skeleton" data-state={!imageState()}></div>
      <div class="shadow"></div>
    </div>
  );
};

export default LazyImage;
