import React, { useContext, useState } from 'react';
import { GlobalContext } from '../../context/GlobalState';
import { NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import NotificationContainer from 'react-notifications/lib/NotificationContainer';
import './Login.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const url = 'https://jsonblob.com/api/jsonBlob';
const validPasswordRegex = new RegExp(
  '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})'
);

const validMailRegex = new RegExp('[a-z0-9]+@[a-z]+.[a-z]{2,3}');

const Login = () => {
  const [inputClasses, setInputClasses] = useState({
    usernameClass: 'regular',
    firstNameClass: 'regular',
    lastNameClass: 'regular',
    emailClass: 'regular',
    passwordClass: 'regular',
    confirmPasswordClass: 'regular',
  });
  let { username, password } = useContext(GlobalContext);

  const navigate = useNavigate();

  const { setUsername, setPassword, setLoggedIn, setToken } =
    useContext(GlobalContext);

  const handleChange = (e) => {
    switch (e.target.name) {
      case 'username':
        setUsername(e.target.value);
        break;

      case 'password':
        setPassword(e.target.value);

        break;

      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        'https://imdb-api.tk/api/token/',
        JSON.stringify({
          username,
          password,
        }),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      setToken(res.data);
      setLoggedIn(true);
      NotificationManager.success('Logged in!', 'Successful', 5000);
      navigate('/');
    } catch (error) {
      NotificationManager.error(
        'Failed to log in check your username and password',
        'Unsuccessful',
        5000
      );
    }
  };

  return (
    <section className='login-register-content-Login'>
      <div className='card-content-Login'>
        <div className='card-header-Login'>
          <h2>Login</h2>
        </div>
        <NotificationContainer />
        <div className='card-body-Login'>
          <form autoComplete='off' onSubmit={handleSubmit}>
            <input
              className={inputClasses.usernameClass}
              type='text'
              autoComplete='off'
              name='username'
              placeholder='Username'
              onChange={handleChange}
            />
            <input
              className={inputClasses.passwordClass}
              type='password'
              name='password'
              placeholder='Password'
              autoComplete='off'
              onChange={handleChange}
            />

            <button className='btn-Login' type='submit' onSubmit={handleSubmit}>
              Login
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
export default Login;
