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

  const [rating, setRating] = useState(0);
  const [sum_score, setSum_Score] = useState(0);
  const [comments, setComments] = useState([]);
  const [edit, setEdit] = useState(false);

  const [newComment, setNewComment] = useState('');
  const [count, setCount] = useState(0);
  const { loggedIn, cast, token, profile } = useContext(GlobalContext);
  let movieCast = cast.filter((cast) => cast.movie === movie_selected.id);

  console.log('Movie', movie_selected);
  console.log('Profile', profile);

  useEffect(() => {
    let temp_sum_score = comments
      .map((comment) => comment.rate)
      .reduce((prevR, currR) => prevR + currR, 0);

    setSum_Score(temp_sum_score);
  }, [comments]);

  useEffect(() => {
    async function fetchReviews() {
      const { data } = await axios.get(
        `https://imdb-api.tk/api/reviews/?movie_id=${movie_selected.id}`
      );
      let comments = data;
      setComments(comments);
      setCount(comments.length);
      console.log('Data', data);
    }
    fetchReviews();
  }, [movie_selected.id]);
  console.log('Votes', comments.length);

  useEffect(() => {
    switch (rating) {
      case 1:
        setSum_Score(sum_score + 1);

        break;
      case 2:
        setSum_Score(sum_score + 2);

        break;
      case 3:
        setSum_Score(sum_score + 3);

        break;
      case 4:
        setSum_Score(sum_score + 4);

        break;
      case 5:
        setSum_Score(sum_score + 5);

        break;

      default:
        break;
    }
    setCount(count + 1);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rating]);

  const handleChangeRate = (e) => {
    e.preventDefault();
    setRating(parseInt(e.target.value));
  };

  console.log('Vote', movie_selected.count_score);

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

  const handleClick = (e) => {
    axios
      .post(
        'https://imdb-api.tk//api/reviews/',
        { comment: newComment, rate: rating, movie: movie_selected.id },
        {
          headers: {
            // Overwrite Axios's automatically set Content-Type
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token.access}`,
          },
        }
      )
      .then((data) => {
        console.log('Data', data);
        axios
          .post(
            'https://imdb-api.tk/api/reviews/',
            {
              movie: movie_selected.id,
              comment: newComment,
              rate: rating,
            },
            {
              headers: {
                // Overwrite Axios's automatically set Content-Type
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token.access}`,
              },
            }
          )
          .then(
            () =>
              axios.patch(
                `https://imdb-api.tk/api/movies/${movie_selected.id}`
              ),
            {
              runtime: movie_selected.runtime,
              avg_score: sum_score / movie_selected.count_score,
              count_score: count,
            },
            {
              headers: {
                // Overwrite Axios's automatically set Content-Type
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token.access}`,
              },
            }
          )
          .then((data) => console.log('Movie update', data));
      });

    setNewComment('');
    setRating(0);
  };

  const handleEdit = () => {
    console.log('Comment new', newComment);
    console.log('Comment', comments);
    console.log(
      'Comment id',
      comments.find((comment) => comment.profile.id === profile.id)
    );

    let updateComment = comments.find(
      (comment) => comment.profile.id === profile.id
    );

    axios
      .patch(
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
      )
      .then((data) => console.log(data));
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
            <div style={{ marginTop: '2vh' }}>
              Rating: {parseFloat((sum_score / count).toFixed(1))}
            </div>
            <div style={{ marginTop: '2vh' }}>Votes: {count}</div>
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
