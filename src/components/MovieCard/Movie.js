import { Button, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import React, { useContext } from 'react';
import { GlobalContext } from '../../context/GlobalState';
import DeleteIcon from '@mui/icons-material/Delete';
import './Movie.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// const images_api = 'https://image.tmdb.org/t/p/w1280/';

const images_api = 'https://imdb-api.tk/api/image/movie/';

const Movie = (movie) => {
  const navigate = useNavigate();
  const {
    watchList,
    loggedIn,
    profile,
    token,
    addMovieToWatchList,
    removeMovieToWatchList,
  } = useContext(GlobalContext);
  let chosen_movie = movie;

  const addMovie = async (movie) => {
    console.log('Movie added: ', movie.id);

    try {
      const { data: saved_movieData } = await axios.put(
        `https://imdb-api.tk/api/profiles/${profile.id}/`,
        {
          bio: profile.bio,
          location: profile.location,
          saved_movies: [...profile.saved_movies, movie.id],
        },
        {
          headers: {
            // Overwrite Axios's automatically set Content-Type
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token.access}`,
          },
        }
      );
    } catch (error) {}
  };

  const removeMovie = async (movie) => {
    console.log('Movie deleted: ', movie.id);

    try {
      const { data: saved_movieData } = await axios.put(
        `https://imdb-api.tk/api/profiles/${profile.id}/`,
        {
          bio: profile.bio,
          location: profile.location,
          saved_movies: profile.saved_movies.filter(
            (saved_movie) => saved_movie !== movie.id
          ),
        },
        {
          headers: {
            // Overwrite Axios's automatically set Content-Type
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token.access}`,
          },
        }
      );
      console.log('saved data', saved_movieData);
    } catch (error) {}
  };

  const Confirm = () => {
    navigate('/movieDetails', { state: { movie_selected: chosen_movie } });
  };

  return (
    <div className='movie'>
      <img src={images_api + movie.id} alt={movie.title} />
      <div className='movie-info'>
        <h3>{movie.title}</h3>
        <span>{Math.round(movie.avg_score)}</span>
        <div className='movie-over'>
          <h2>Overview</h2>
          <p>{movie.description.trim()}</p>
          {loggedIn ? (
            <div className='add-btn'>
              {window.location.pathname === '/myWatchList' ? (
                <>
                  <Fab
                    size='small'
                    color='error'
                    aria-label='add'
                    onClick={() => {
                      removeMovieToWatchList(movie);
                      removeMovie(movie);
                    }}
                  >
                    <DeleteIcon />
                  </Fab>
                  <h4>Remove</h4>
                </>
              ) : (
                <>
                  <Fab
                    size='small'
                    color='primary'
                    aria-label='add'
                    onClick={() => {
                      if (
                        watchList.every(
                          (watchListMovie) => watchListMovie.id !== movie.id
                        )
                      ) {
                        addMovieToWatchList(movie);
                        addMovie(movie);
                      }
                    }}
                  >
                    <AddIcon />
                  </Fab>
                  <h4>Add to Watchlist</h4>
                </>
              )}
            </div>
          ) : (
            <></>
          )}

          <Button
            variant='text'
            onClick={Confirm}
            style={{
              color: 'black',
              textAlign: 'inherit',
              fontWeight: 'bold',
              fontFamily: 'inherit',
            }}
          >
            Click to see more information about the movie
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Movie;
