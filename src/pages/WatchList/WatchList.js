import React, { useContext, useEffect, useState } from 'react';
import Movie from '../../components/MovieCard/Movie';
import { GlobalContext } from '../../context/GlobalState';

import './WatchList.css';

const WatchList = () => {
  const state = useContext(GlobalContext);

  return (
    <>
      <h1 className='watchList'>My WatchList</h1>
      <div className='movie-container'>
        <GlobalContext.Consumer>
          {({ savedMovies }) =>
            savedMovies && savedMovies.length > 0 ? (
              savedMovies.map((movie) => {
                return <Movie key={movie.id} {...movie} />;
              })
            ) : (
              <h1 className='no-movies'>
                No movies yet , add to your watchList
              </h1>
            )
          }
        </GlobalContext.Consumer>
      </div>
    </>
  );
};

export default WatchList;
