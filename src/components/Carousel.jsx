import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import MovieCard from "./MovieCard";
import "../styles/Carousel.css";

const Carousel = ({ movies, media_type, className }) => {
  const settings = {
    draggable: true,
    touchMove: true,
    lazyLoad: true,
    focusOnSelect: false,
    accessibility: true,
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 5.5, // Number of slides to show at once
    slidesToScroll: 4, // Number of slides to scroll
    responsive: [
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 3.5,
          slidesToScroll: 2,
          infinite: false,
          dots: false,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: movies.length < 4 ? 3 : 2.3,
          slidesToScroll: 2,
          infinite: false,
          dots: false,
        },
      },
    ],
  };
  return (
    <div className={"trending-carousel " + className}>
      <div className={movies[3] ? "" : "fallback-carousel"}>
        <Slider {...settings}>
          {movies.map((movie) => (
            <div className="card" key={movie.id + "Title"}>
              <MovieCard
                media_type={media_type}
                isCategorized={true}
                movie={movie}
              />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Carousel;
