import React, { useContext, useState } from 'react';
import { GlobalContext } from '../../context/GlobalState';
import { NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import NotificationContainer from 'react-notifications/lib/NotificationContainer';
import './Login.css';

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
  let { username, email, password, confirmPassword, loggedIn } =
    useContext(GlobalContext);
  const {
    setUsername,
    setEmail,
    setPassword,
    setConfirmPassword,
    setLoggedIn,
  } = useContext(GlobalContext);

  const handleChange = (e) => {
    switch (e.target.name) {
      case 'username':
        setUsername(e.target.value);
        break;
      case 'email':
        setEmail(e.target.value);

        break;
      case 'password':
        setPassword(e.target.value);

        break;
      case 'confirmPassword':
        setConfirmPassword(e.target.value);

        break;

      default:
        break;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (username.length < 6 || username.length > 12) {
      setInputClasses({
        usernameClass: 'error',
        firstNameClass: 'regular',
        lastNameClass: 'regular',
        emailClass: 'regular',
        passwordClass: 'regular',
        confirmPasswordClass: 'regular',
      });
      NotificationManager.error(
        'Username must be minimum 6 characters long and max is 12',
        'Username Error',
        5000
      );
    } else if (!validMailRegex.test(email)) {
      setInputClasses({
        usernameClass: 'regular',
        firstNameClass: 'regular',
        lastNameClass: 'regular',
        emailClass: 'error',
        passwordClass: 'regular',
        confirmPasswordClass: 'regular',
      });
      NotificationManager.error(
        'Email you entered is not valid',
        'Email Error',
        5000
      );
    } else if (!validPasswordRegex.test(password)) {
      setInputClasses({
        usernameClass: 'regular',
        firstNameClass: 'regular',
        lastNameClass: 'regular',
        emailClass: 'regular',
        passwordClass: 'error',
        confirmPasswordClass: 'regular',
      });
      NotificationManager.error(
        'Password must be 8 characters long or more, must contain at least 1 lowercase alphabetical character, at least 1 uppercase alphabetical character, at least 1 numeric character and at least 1 special character.',
        'Password Error',
        5000
      );
    } else if (password !== confirmPassword) {
      setInputClasses({
        usernameClass: 'regular',
        firstNameClass: 'regular',
        lastNameClass: 'regular',
        emailClass: 'regular',
        passwordClass: 'regular',
        confirmPasswordClass: 'error',
      });
      NotificationManager.error(
        'Password and confirm password don"t match',
        'Please confirm your password',
        5000
      );
    } else {
      setInputClasses({
        usernameClass: 'regular',
        firstNameClass: 'regular',
        lastNameClass: 'regular',
        emailClass: 'regular',
        passwordClass: 'regular',
        confirmPasswordClass: 'regular',
      });
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(username, email, password, confirmPassword),
      })
        .then(
          () => setLoggedIn(true),
          NotificationManager.success('Data sent!', 'Successful', 5000)
        )
        .catch(() =>
          NotificationManager.error('Data failed to send', 'Unsuccessful', 5000)
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
              className={inputClasses.emailClass}
              required
              type='email'
              name='email'
              placeholder='Enter your email'
              autoComplete='off'
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
