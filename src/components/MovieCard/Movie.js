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
  const { addMovieToWatchList, removeMovieToWatchList } =
    useContext(GlobalContext);
  const { watchList, loggedIn, token, profile } = useContext(GlobalContext);
  let chosen_movie = movie;

  const addMovie = async (movie) => {
    console.log('Movie', movie);
    const saved_movieData = await axios.put(
      `https://imdb-api.tk//api/profiles/${profile.id}/`,
      {
        saved_movies: [
          {
            id: movie.id,
            genre: movie.genre,
            title: movie.title,
            description: movie.description,
            budget: movie.budget,
            revenue: movie.revenue,
            runtime: movie.runtime,
            release_date: movie.release_date,
            avg_score: movie.avg_score,
            count_score: movie.count_score,
            img: movie.img,
            language: movie.language,
            company: movie.company,
            actors: movie.actors,
          },
        ],
      },
      {
        headers: {
          // Overwrite Axios's automatically set Content-Type
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.access}`,
        },
      }
    );
    console.log(saved_movieData);
  };

  const Confirm = () => {
    navigate('/movieDetails', { state: { movie_selected: chosen_movie } });
  };

  return (
    <div className='movie'>
      <img src={images_api + movie.id} alt={movie.title} />
      <div className='movie-info'>
        <h3>{movie.title}</h3>
        <span>{movie.avg_score}</span>
        <div className='movie-over'>
          <h2>Overview</h2>
          <p>{movie.description}</p>
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
                        watchList.some(
                          (watchListMovie) => watchListMovie.id === movie.id
                        ) === false
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
          {/* <Link
            to='/movieDetails'
            style={{
              fontFamily: 'inherit',
              color: 'inherit',
              textDecoration: 'none',
              margin: 'auto',
            }}
          > */}
          {/* <h3 className='movie-details-link' onClick={Confirm}> */}
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

          {/* </h3> */}
          {/* </Link> */}
        </div>
      </div>
    </div>
  );
};

export default Movie;
