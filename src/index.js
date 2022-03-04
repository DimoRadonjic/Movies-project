import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import WatchList from './pages/WatchList/WatchList';

import Navbar from './components/Navbar/Navbar';
import Login from './pages/Login/Login';
import { GlobalProvider } from './context/GlobalState';
import Register from './pages/Register/Register';
import MovieDetails from './pages/MovieDetails/MovieDetails';

ReactDOM.render(
  <>
    <Router>
      <GlobalProvider>
        <Navbar />
        <Routes>
          <Route exact path='/' element={<App />}></Route>
          <Route exact path='/home' element={<App />}></Route>

          <Route
            path='/myWatchList'
            element={<WatchList />}
            label='myWatchList'
          ></Route>
          <Route exact path='/register' element={<Register />}></Route>
          <Route exact path='/login' element={<Login />}></Route>
          <Route exact path='/movieDetails' element={<MovieDetails />}></Route>
        </Routes>
      </GlobalProvider>
    </Router>
  </>,
  document.getElementById('root')
);
