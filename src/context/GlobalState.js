import axios from 'axios';
import React, { createContext, useReducer, useEffect, useState } from 'react';
import AppReducer from './AppReducer';

// const featured_api =
//   'https://api.themoviedb.org/3/discover/movie?api_key=e82700f5ac8591784624479f39d63243&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate';

axios
  .get('https://imdb-api.tk/api/watchlist/', {
    headers: {
      Authorization:
        'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjQ2ODQ0OTg0LCJpYXQiOjE2NDY4NDEzODQsImp0aSI6Ijk4ODRmN2FiZmY4MDQwNTg5ODhmYWZiMjRiZTdhODJkIiwidXNlcl9pZCI6ODZ9.cDYMWduKOfXGTF_qq_bLL_TLKCiZFGXN02KEuKDNTHE',
    },
  })
  .then((data) => console.log(data));

const featured_api = 'https://imdb-api.tk/api/movies/';
//initial state
const initialState = {
  movies: [],
  cast: [],
  watchList: [],
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  loggedIn: false,
  token: {},
  profile: [],
  savedMovies: [],
};

//create context
export const GlobalContext = createContext(initialState);

//provider
export const GlobalProvider = (props) => {
  const [movies, setMovies] = useState(initialState.movies);
  const [cast, setCast] = useState(initialState.cast);

  //user
  const [username, setUsername] = useState(() => {
    const saved = window.localStorage.getItem('user');
    const parsed = JSON.parse(saved);
    return parsed ? parsed.username : initialState.username;
  });

  const [email, setEmail] = useState(() => {
    const saved = window.localStorage.getItem('user');
    const parsed = JSON.parse(saved);
    return parsed ? parsed.email : initialState.email;
  });

  const [password, setPassword] = useState(() => {
    const saved = window.localStorage.getItem('user');
    const parsed = JSON.parse(saved);
    return parsed ? parsed.password : initialState.password;
  });

  const [watchList, setWatchList] = useState(() => {
    const saved = window.localStorage.getItem('profile');
    const parsed = JSON.parse(saved);
    return parsed ? parsed.saved_movies : initialState.watchList;
  });

  const [token, setToken] = useState(() => {
    const saved = window.localStorage.getItem('user');
    const parsed = JSON.parse(saved);
    return parsed ? parsed.token : initialState.token;
  });

  const [profile, setProfile] = useState(() => {
    const saved = window.localStorage.getItem('profile');
    const parsed = JSON.parse(saved);

    return parsed ? parsed : initialState.profile;
  });

  const [confirmPassword, setConfirmPassword] = useState(() => {
    const saved = window.localStorage.getItem('user');
    const parsed = JSON.parse(saved);
    return parsed ? parsed.confirmPassword : initialState.confirmPassword;
  });

  const [loggedIn, setLoggedIn] = useState(() => {
    const saved = window.localStorage.getItem('otherData');
    const parsed = JSON.parse(saved);
    return parsed ? parsed.loggedIn : initialState.loggedIn;
  });

  const [savedMovies, setSavedMovies] = useState(() => {
    const saved = window.localStorage.getItem('watchlist');
    const parsed = JSON.parse(saved);
    return parsed ? parsed : initialState.savedMovies;
  });

  const [state, dispatch] = useReducer(AppReducer, initialState);

  console.log('State', state);

  useEffect(() => {
    const userData = { username, email, password, confirmPassword, token };

    const otherData = { loggedIn };

    const profileData = profile;

    window.localStorage.setItem('user', JSON.stringify(userData));
    window.localStorage.setItem('watchlist', JSON.stringify(watchList));
    window.localStorage.setItem('profile', JSON.stringify(profileData));
    window.localStorage.setItem('otherData', JSON.stringify(otherData));
  }, [
    confirmPassword,
    email,
    loggedIn,
    password,
    profile,
    watchList,
    token,
    username,
  ]);

  useEffect(() => {
    async function fetchData() {
      const { data } = await axios.get(featured_api);

      const movieData = data.sort((a, b) => b.avg_score - a.avg_score);

      setMovies(movieData);
    }
    async function fetchActors() {
      const { data } = await axios.get(`https://imdb-api.tk/api/cast/`);

      setCast(data);
    }

    fetchActors();
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchWatchlist() {
      const { data } = await axios.get('https://imdb-api.tk/api/watchlist/', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.access}`,
        },
      });
      console.log('Data for watchList', data);
      setWatchList(data[0]);
      setSavedMovies(data);
    }
    fetchWatchlist();
  }, [token.access, state.watchList]);

  useEffect(() => {
    async function fetchProfile() {
      const { data: profileData } = await axios.get(
        'https://imdb-api.tk/api/profiles/',
        {
          headers: {
            // Overwrite Axios's automatically set Content-Type
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token.access}`,
          },
        }
      );
      console.log('ProfileData', profileData[0]);
      setProfile(profileData[0]);
    }
    fetchProfile();
  }, [token, state.watchList]);

  //actions
  const addMovieToWatchList = (movie) => {
    dispatch({ type: 'ADD_MOVIE_TO_WATCHLIST', payload: movie });
  };

  const removeMovieToWatchList = (movie) => {
    dispatch({ type: 'REMOVE_FROM_WATCHLIST', payload: movie });
  };

  console.log('watchList', state.watchList);

  console.log('Profile', profile);

  return (
    <GlobalContext.Provider
      value={{
        setLoggedIn,
        setMovies,
        setToken,
        setProfile,
        savedMovies,
        movies: (state.movies = movies),
        watchList: state.watchList,
        username: (state.username = username),
        email: (state.email = email),
        password: (state.password = password),
        confirmPassword: (state.confirmPassword = confirmPassword),
        loggedIn: (state.loggedIn = loggedIn),
        token: (state.token = token),
        cast: (state.cast = cast),
        profile: (state.profile = profile),
        setUsername,
        setEmail,
        setPassword,
        setConfirmPassword,
        addMovieToWatchList,
        removeMovieToWatchList,
      }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
};
