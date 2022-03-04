import { Pagination } from '@mui/material';
import React from 'react';
import { GlobalContext } from '../../context/GlobalState';
import Movie from '../MovieCard/Movie';
import './Movies.css';

const Movies = () => {
  return (
    <>
      <div className='movie-container'>
        <GlobalContext.Consumer>
          {({ movies }) =>
            movies
              ? movies.map((movie) => {
                  return <Movie key={movie.id} {...movie} />;
                })
              : ''
          }
        </GlobalContext.Consumer>
      </div>

      {/* <Pagination count={10} color='standard' /> */}
    </>
  );
};

export default Movies;
