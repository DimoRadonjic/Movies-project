import { Box, Grid, Rating, TextField } from '@mui/material';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { GlobalContext } from '../../context/GlobalState';
import StarIcon from '@mui/icons-material/Star';
import './MovieDetails.css';

const images_api = 'https://imdb-api.tk/api/image/movie/';
const test_movie = 'https://imdb-api.tk/api/movies/3/';
const get_cast = 'https://imdb-api.tk/api/actors/';

const MovieDetails = () => {
  const {
    state: { movie_selected },
  } = useLocation();

  const [value, setValue] = useState();
  const [comments, setComments] = useState([]);
  const { loggedIn, cast } = useContext(GlobalContext);
  let movieCast = cast.filter((cast) => cast.movie === movie_selected.id);

  useEffect(() => {
    async function fetchReviews() {
      const { data } = await axios.get(
        `https://imdb-api.tk/api/reviews/?movie_id=${movie_selected.id}`
      );
      setComments(data);
      console.log('Data', data);
    }
    fetchReviews();
  }, [movie_selected.id]);

  const avg_score = movie_selected.avg_score / movie_selected.count_score;

  return (
    <>
      <h1 className='details-title'>Movie Details</h1>
      <Box sx={{ flexGrow: 1 }} style={{ marginTop: '5vh', width: '90vw' }}>
        <Grid
          container
          spacing={0}
          md={{
            margin: '0 10vw 0 10vw',
          }}
        >
          <Grid item xs={5} md={4}>
            <img className='img' src={images_api + movie_selected.id} alt='' />
          </Grid>
          <Grid item xs={8} md={8}>
            <h3>{movie_selected.title}</h3>
            <p style={{ marginTop: '2vh' }}>{movie_selected.description}</p>
            <div style={{ marginTop: '2vh' }}>
              Release Date: {movie_selected.release_date}
            </div>
            <div style={{ marginTop: '2vh' }}>
              Movie Duration: {movie_selected.runtime}
            </div>

            <div style={{ marginTop: '2vh' }}>
              Genre: {movie_selected.genre.title}
            </div>
            <div style={{ marginTop: '2vh' }}>Rating: {}</div>
            <div style={{ marginTop: '2vh' }}>
              Votes: {movie_selected.count_score}
            </div>
            <div style={{ marginTop: '2vh' }}>
              Cast:
              <ul style={{ listStyle: 'none' }}>
                {movieCast.map(({ actor }) => (
                  <li key={actor.id}>
                    {actor.first_name + ' ' + actor.last_name}
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ marginTop: '2vh' }}>
              Rate Movie:
              {loggedIn ? (
                <Rating
                  name='simple-controlled'
                  value={value}
                  onChange={(event, newValue) => {
                    movie_selected.count_score++;
                    movie_selected.avg_score += newValue;
                    console.log(movie_selected);
                  }}
                  onClick={(e) => {
                    setValue(e.target.value);
                  }}
                />
              ) : (
                <>
                  <Box
                    sx={{
                      width: 200,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Rating
                      name='text-feedback'
                      value={value}
                      precision={0.5}
                      emptyIcon={
                        <StarIcon
                          style={{ opacity: 0.45, color: 'yellow' }}
                          fontSize='inherit'
                        />
                      }
                    />
                  </Box>
                </>
              )}
            </div>
            <div style={{ marginTop: '2vh' }}>
              <TextField
                id='outlined-basic'
                label='Comment'
                variant='outlined'
                style={{ background: 'white', borderRadius: '5px' }}
                disabled={loggedIn ? false : true}
              />
            </div>
            <div style={{ marginTop: '2vh' }}>
              {comments.length > 0 ? (
                <ul>
                  {comments.map((comment) => {
                    <li key={movie_selected.id}>{comment}</li>;
                  })}
                </ul>
              ) : (
                'No comments yet'
              )}
            </div>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default MovieDetails;
