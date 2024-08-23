import { createSignal, onCleanup, onMount } from "solid-js";
import { Skeleton } from "@suid/material";

const LazyImage = (props) => {
  const [isVisible, setIsVisible] = createSignal(false);
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
    <div class="lazyImage flex" ref={imgRef}>
      {isVisible() && (
        <img
          onerror={(e) => e.target.classList.remove("show")}
          {...props}
          src={props.src} // Add src only when visible
          onload={(e) => e.target.classList.add("show")}
        />
      )}
      <div class="shadow"></div>
      <div class="skeleton" style={{ "aspect-ratio": props.ratio }}></div>
    </div>
  );
};

export default LazyImage;
