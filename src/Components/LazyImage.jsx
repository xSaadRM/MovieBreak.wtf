import { Skeleton } from "@suid/material";

const LazyImage = (props) => {
  return (
    <div class="lazyImage flex">
      <img
        onerror={(e) => e.target.classList.remove("show")}
        {...props}
        onload={(e) => e.target.classList.add("show")}
      ></img>
      <Skeleton
        variant="rectangular"
        animation={"wave"}
        class="skeleton"
        style={{ "aspect-ratio": props.ratio }}
      />
    </div>
  );
};

export default LazyImage;
