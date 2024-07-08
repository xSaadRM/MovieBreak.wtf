import { Skeleton } from "@suid/material";

const LazyImage = (props) => {
  return (
    <div class="lazyImage">
      <img
        {...props}
        onload={(e) => {
          e.target.classList.add("show");
        }}
      />
      {/* <Skeleton /> */}
    </div>
  );
};

export default LazyImage;
