import { Box, Button, Grid, Rating, TextField } from '@mui/material';
import axios from 'axios';
import React, { Profiler, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { GlobalContext } from '../../context/GlobalState';
import StarIcon from '@mui/icons-material/Star';
import './MovieDetails.css';

const images_api = 'https://imdb-api.tk/api/image/movie/';

const MovieDetails = () => {
  const {
    state: { movie_selected },
  } = useLocation();

  console.log('movie_selected', movie_selected);
  console.log('movie_selected avg ', movie_selected.avg_score);

  const [rating, setRating] = useState(0);
  const [sum_score, setSum_Score] = useState(0);
  const [comments, setComments] = useState([]);
  const [edit, setEdit] = useState(false);
  const [avgScore, setAvgScore] = useState(movie_selected.avg_score);

  const [newComment, setNewComment] = useState('');
  const [votes, setVotes] = useState(0);
  const { loggedIn, cast, token, profile } = useContext(GlobalContext);
  let movieCast = cast.filter((cast) => cast.movie === movie_selected.id);

  const [movie, setMovie] = useState(movie_selected);

  useEffect(() => {
    async function fetchMovie() {
      const { data: movieData } = await axios.get(
        `https://imdb-api.tk//api/movies/${movie_selected.id}/`
      );
      console.log('Movie REs', movieData);
      setMovie(movieData);
      setAvgScore(movieData.avg_score);
      setVotes(movieData.count_score);
    }
    fetchMovie();
  }, [movie_selected.id]);

  useEffect(() => {
    let temp_sum_score = comments
      .map((comment) => comment.rate)
      .reduce((prevR, currR) => prevR + currR, 0);

    setSum_Score(temp_sum_score);
  }, [comments]);

  console.log('Sum score', sum_score);
  console.log('Votes', votes);

  useEffect(() => {
    async function fetchReviews() {
      const { data } = await axios.get(
        `https://imdb-api.tk/api/reviews/?movie_id=${movie_selected.id}`
      );
      let comments = data;
      setComments(comments);
      setVotes(comments.length);
    }
    fetchReviews();
  }, [movie_selected.id, movie_selected.avg_score]);

  useEffect(() => {
    setSum_Score(sum_score + rating);
    setVotes(votes + 1);
    setAvgScore(sum_score / votes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rating]);

  const handleChangeRate = (e) => {
    e.preventDefault();
    setRating(parseInt(e.target.value));
  };

  console.log('Vote movie count score', movie.count_score);

  const handleChangeComment = (e) => {
    e.preventDefault();
    console.log('Comment', e.target.value);
    setNewComment(e.target.value);
  };

  const handleUpdateComment = (e) => {
    e.preventDefault();
    console.log('NewComment', e.target.value);
    setNewComment(e.target.value);
  };

  console.log('Avg ', parseFloat((sum_score / votes).toFixed(1)));

  const handleClick = async (e) => {
    try {
      const reviewsResp = await axios.post(
        'https://imdb-api.tk/api/reviews/',
        JSON.stringify({
          comment: newComment,
          rate: rating,
          movie: movie_selected.id,
        }),
        {
          headers: {
            // Overwrite Axios's automatically set Content-Type
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token.access}`,
          },
        }
      );

      const movieUpdateRes = await axios.patch(
        `https://imdb-api.tk/api/movies/${movie_selected.id}/`,
        JSON.stringify({
          runtime: movie_selected.runtime,
          avg_score: avgScore,
          count_score: votes,
        }),
        {
          headers: {
            // Overwrite Axios's automatically set Content-Type
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token.access}`,
          },
        }
      );
      setAvgScore(movieUpdateRes.data.avg_score);
      setVotes(movieUpdateRes.data.count_score);

      console.log('Review api ', reviewsResp);
      console.log('Movie Update api ', movieUpdateRes);
    } catch (error) {}

    setNewComment('');
    setRating(0);
  };

  const handleEdit = async () => {
    let updateComment = comments.find(
      (comment) => comment.profile.id === profile.id
    );
    try {
      const editCommentRes = await axios.patch(
        `https://imdb-api.tk/api/reviews/${updateComment.id}/`,
        {
          rate: updateComment.rate,
          comment: newComment,
          movie: updateComment.movie.id,
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
            <img className='img' src={images_api + movie.id} alt='' />
          </Grid>
          <Grid item xs={8} md={8}>
            <h3>{movie_selected.title}</h3>
            <p style={{ marginTop: '2vh' }}>{movie.description}</p>
            <div style={{ marginTop: '2vh' }}>
              Release Date: {movie.release_date}
            </div>
            <div style={{ marginTop: '2vh' }}>
              Movie Duration: {movie.runtime}
            </div>

            <div style={{ marginTop: '2vh' }}>Genre: {movie.genre.title}</div>
            <div style={{ marginTop: '2vh' }}>
              Rating: {Math.round(avgScore)}
            </div>
            <div style={{ marginTop: '2vh' }}>Votes: {votes}</div>
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
                    value={rating}
                    precision={1}
                    disabled={loggedIn === false ? true : false}
                    max={10}
                    emptyIcon={
                      <StarIcon
                        style={{ opacity: 0.45, color: 'yellow' }}
                        fontSize='inherit'
                      />
                    }
                    onChange={(e) => handleChangeRate(e)}
                  />
                </Box>
              </>
            </div>
            <div style={{ marginTop: '2vh' }}>
              <TextField
                id='outlined-basic'
                label='Comment'
                multiline
                disabled={loggedIn === false ? true : false}
                variant='outlined'
                style={{
                  background: 'white',
                  borderRadius: '5px',
                  width: '20vw',
                }}
                onChange={(e) => handleChangeComment(e)}
              />
              {loggedIn === true ? (
                <div>
                  <Button
                    variant='contained'
                    style={{
                      marginTop: '1vw',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      color: 'black',
                      background: '#f6c900',
                    }}
                    onClick={handleClick}
                  >
                    Submit Comment
                  </Button>
                </div>
              ) : (
                ''
              )}
            </div>
            <div style={{ marginTop: '2.5vh' }}>
              {comments.length > 0 ? (
                <ul>
                  {comments.map((comment) => {
                    return (
                      <>
                        <h4 style={{ marginTop: '1.5vh' }}>
                          By: {comment.profile.bio}
                        </h4>
                        <li
                          key={movie_selected.id}
                          style={{ listStyle: 'none' }}
                        >
                          Comment:{' '}
                          {comment.profile.id === profile.id ? (
                            <>
                              {edit === true ? (
                                <div style={{ marginTop: '2vh' }}>
                                  <TextField
                                    id='outlined-basic'
                                    multiline
                                    defaultValue={comment.comment}
                                    variant='outlined'
                                    style={{
                                      background: 'white',
                                      borderRadius: '5px',
                                      width: '20vw',
                                    }}
                                    disabled={loggedIn === false ? true : false}
                                    onChange={(e) => handleUpdateComment(e)}
                                  />
                                </div>
                              ) : (
                                <>{comment.comment}</>
                              )}
                              {comment.profile.id === profile.id ? (
                                edit === false ? (
                                  <div>
                                    <Button
                                      variant='contained'
                                      style={{
                                        marginTop: '1vw',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        color: 'black',
                                        background: '#f6c900',
                                        padding: '0.15rem',
                                      }}
                                      size='small'
                                      onClick={() => setEdit(!edit)}
                                    >
                                      Edit Comment
                                    </Button>
                                  </div>
                                ) : (
                                  <div>
                                    <Button
                                      variant='contained'
                                      style={{
                                        marginTop: '1vw',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        color: 'black',
                                        background: '#f6c900',
                                        padding: '0',
                                      }}
                                      size='small'
                                      onClick={() => {
                                        setEdit(!edit);
                                        handleEdit();
                                      }}
                                    >
                                      Save
                                    </Button>
                                  </div>
                                )
                              ) : (
                                ''
                              )}
                            </>
                          ) : (
                            <>{' ' + comment.comment}</>
                          )}
                          <div>
                            Rated:
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
                                  value={comment.rate}
                                  precision={1}
                                  disabled
                                  max={10}
                                  emptyIcon={
                                    <StarIcon
                                      style={{
                                        opacity: 0.45,
                                        color: 'yellow',
                                      }}
                                      fontSize='inherit'
                                    />
                                  }
                                />
                              </Box>
                            </>
                          </div>
                        </li>
                      </>
                    );
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
