import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import './MovieSlider.css';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const { REACT_APP_API_KEY } = process.env;

const MovieSlider = () => {
  //console.log(REACT_APP_API_KEY);

  const [movies, setMovies] = useState(null);

  // useEffect(() => {
  //   async function fetchData() {
  //     const {
  //       data: { items: movies },
  //     } = await axios.get(
  //       `https://imdb-api.com/en/API/MostPopularMovies/k_lb5k4mgv`
  //     );

  //     setMovies(movies);
  //   }

  //   axios
  //     .get(
  //       `https://api.themoviedb.org/3/authentication/guest_session/new?api_key=e82700f5ac8591784624479f39d63243`,
  //       { headers: { 'Access-Control-Allow-Origin': '*' } }
  //     )
  //     .then(({ data }) => console.log(data.errorMessage));
  //   fetchData();
  //   console.log(movies);
  // }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 6000,
  };

  // <div className='image-container'>
  //   <img src={movie.image} alt='' key={movie.rank} />
  // </div>
  // {movies ? (
  //   movies
  //     .sort((a, b) => b.imDbRating - a.imDbRating)
  //     .slice(0, 5)
  //     .map((movie) => (

  //     ))
  // ) : (
  //   <div>Error</div>
  // )}

  return (
    <div>
      <Slider {...settings}>
        <div className='anime-slider'>
          <div className='anime-slider-text'>
            <h1 className='anime-slider-h1'>
              Attack on Titan Final Season Part 2
            </h1>
            <p className='anime-slider-p'>
              Second part of Attack on Titan: The Final Season. The war for
              Paradis zeroes in on Shiganshina just as Jaegerists have seized
              control. After taking a huge blow from a surprise attack led by
              Eren, Marley swiftly acts to return the favor. With Zeke's true
              plan revealed and a military forced under new rule, this battle
              might be fought on two fronts.
            </p>

            <h4 className='anime-slider-genre'>
              <i className='fa-solid fa-tag' style={{ marginRight: '8px' }}></i>
              Action, Dark Fantasy, Post-apocalyptic
            </h4>

            <a href='#' className='anime-slider-btn-watch'>
              <i className='fa-solid fa-play play-btn'></i>
              Watch
            </a>
          </div>

          <div className='anime-slider-img-container'>
            <div className='gradient'></div>
            <img
              src='https://animecorner.me/wp-content/uploads/2021/11/attack-on-titan-final-season-visual.png'
              className='anime-slider-img'
              alt='Attack on Titan Final Season Part 2'
            />
          </div>
        </div>
      </Slider>
    </div>
  );
};

export default MovieSlider;
