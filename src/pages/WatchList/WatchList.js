import React from 'react';
import Movie from '../../components/MovieCard/Movie';
import { GlobalContext } from '../../context/GlobalState';

import './WatchList.css';

const WatchList = () => {
  return (
    <>
      <h1 className='watchList'>My WatchList</h1>
      <div className='movie-container'>
        <GlobalContext.Consumer>
          {({ watchList }) =>
            watchList && watchList.length > 0 ? (
              watchList.map((movie) => {
                return <Movie key={movie.id} {...movie} />;
              })
            ) : (
              <h1>No movies yet , add to your watchList</h1>
            )
          }
        </GlobalContext.Consumer>
      </div>
    </>
  );
};

export default WatchList;
