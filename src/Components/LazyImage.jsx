import { createSignal, onCleanup, onMount } from "solid-js";

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
    <div class="lazyImage flex" ref={imgRef}>
      {isVisible() && (
        <img
          data-state={imageState()}
          onerror={() => setImageState(false)}
          onload={() => setImageState(true)}
          {...props}
        />
      )}
      <div class="skeleton" data-state={!imageState()}></div>
      <div class="shadow"></div>
    </div>
  );
};

export default LazyImage;
