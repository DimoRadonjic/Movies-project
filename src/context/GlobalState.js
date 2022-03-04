import axios from 'axios';
import React, { createContext, useReducer, useEffect, useState } from 'react';
import AppReducer from './AppReducer';

// const featured_api =
//   'https://api.themoviedb.org/3/discover/movie?api_key=e82700f5ac8591784624479f39d63243&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate';

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
  profile: {},
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
    return parsed.username || initialState.username;
  });
  const [email, setEmail] = useState(() => {
    const saved = window.localStorage.getItem('user');
    const parsed = JSON.parse(saved);
    return parsed.email || initialState.email;
  });
  const [password, setPassword] = useState(() => {
    const saved = window.localStorage.getItem('user');
    const parsed = JSON.parse(saved);
    return parsed.password || initialState.password;
  });
  const [token, setToken] = useState(() => {
    const saved = window.localStorage.getItem('user');
    const parsed = JSON.parse(saved);
    return parsed.token || initialState.token;
  });
  const [profile, setProfile] = useState(() => {
    const saved = window.localStorage.getItem('profile');
    const parsed = JSON.parse(saved);
    console.log('parsed profile', parsed);
    return parsed || initialState.profile;
  });

  const [confirmPassword, setConfirmPassword] = useState(() => {
    const saved = window.localStorage.getItem('user');
    const parsed = JSON.parse(saved);
    return parsed.confirmPassword || initialState.confirmPassword;
  });

  const [loggedIn, setLoggedIn] = useState(() => {
    const saved = window.localStorage.getItem('otherData');
    const parsed = JSON.parse(saved);
    return parsed.loggedIn || initialState.loggedIn;
  });

  const [state, dispatch] = useReducer(AppReducer, initialState);

  useEffect(() => {
    const userData = { username, email, password, confirmPassword, token };

    const otherData = { loggedIn };

    window.localStorage.setItem('user', JSON.stringify(userData));
    window.localStorage.setItem('profile', JSON.stringify(profile));
    window.localStorage.setItem('otherData', JSON.stringify(otherData));
  }, [confirmPassword, email, loggedIn, password, profile, token, username]);

  useEffect(() => {
    async function fetchData() {
      const { data } = await axios.get(featured_api);
      // console.log('Movies ', data);
      const movieData = data.sort((a, b) => b.avg_score - a.avg_score);

      setMovies(movieData);
    }
    async function fetchActors() {
      const { data } = await axios.get(`https://imdb-api.tk/api/cast/`);
      // console.log('Cast ', data);

      setCast(data);
    }
    fetchActors();
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchProfile(token) {
      const { data: profileData } = await axios.post(
        'https://imdb-api.tk/api/profiles/',
        { bio: username, location: '' },
        {
          headers: {
            // Overwrite Axios's automatically set Content-Type
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token.access}`,
          },
        }
      );

      setProfile(profileData);
    }
    fetchProfile(token);
  }, [token, username]);

  //actions
  const addMovieToWatchList = (movie) => {
    dispatch({ type: 'ADD_MOVIE_TO_WATCHLIST', payload: movie });
  };

  const removeMovieToWatchList = (movie) => {
    dispatch({ type: 'REMOVE_FROM_WATCHLIST', payload: movie });
  };

  return (
    <GlobalContext.Provider
      value={{
        setLoggedIn,
        setMovies,
        setToken,
        setProfile,
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
