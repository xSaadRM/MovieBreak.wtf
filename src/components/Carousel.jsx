import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import MovieCard from "./MovieCard";
import "../styles/Carousel.css"
const Carousel = ({ movies, type, category, media_type }) => {
  const settings = {
    draggable: true,
    touchMove: true,
    lazyLoad: "progressive",
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
          slidesToShow: 2.2,
          slidesToScroll: 2,
          infinite: false,
          dots: false,
        },
      },
    ],
  };

  if (!movies) {
    return <div>Loading...</div>;
  }

  return (
    <div className="trending-carousel">
      <div className="trending-carousel-title">
        <h4>
          {category} - {type}
        </h4>
      </div>
      <Slider {...settings}>
        {movies.map((movie) => (
          <MovieCard
            media_type={media_type}
            isCategorized={true}
            movie={movie}
            key={movie.id}
          />
        ))}
      </Slider>
    </div>
  );
};

export default Carousel;
