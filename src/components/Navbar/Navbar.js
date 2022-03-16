import React, { useContext, useEffect, useState } from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LocalMoviesIcon from '@mui/icons-material/LocalMovies';
import MoreIcon from '@mui/icons-material/MoreVert';
import logo from './images/My project.png';
import axios from 'axios';
import { GlobalContext } from '../../context/GlobalState';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.black, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  fontFamily: 'inherit',
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '13vw',
    },
  },
}));

export default function PrimarySearchAppBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTermGenre, setSearchTermGenre] = useState('');

  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const {
    setMovies,
    setLoggedIn,
    setUsername,
    setConfirmPassword,
    setEmail,
    setPassword,
    setToken,
    profile,
  } = useContext(GlobalContext);
  let { loggedIn } = useContext(GlobalContext);

  const navigate = useNavigate();

  // console.log('LoggedIn', loggedIn);

  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  useEffect(() => {
    async function fetchMovies() {
      const { data } = await axios.get(
        `https://imdb-api.tk/api/movies/?genre_title=&title=${searchTerm}`
      );
      const movieList = data.sort((a, b) => b.avg_score - a.avg_score);
      setMovies(movieList);
    }
    if (searchTerm !== '') {
      fetchMovies();
    }

    return () => {};
  }, [searchTerm, setMovies]);

  useEffect(() => {
    async function fetchMovies() {
      const { data } = await axios.get(
        `https://imdb-api.tk/api/movies/?genre_title=${searchTermGenre}&title=`
      );
      const movieList = data.sort((a, b) => b.avg_score - a.avg_score);
      setMovies(movieList);
    }
    if (searchTermGenre !== '') {
      fetchMovies();
    }

    return () => {};
  }, [searchTermGenre, setMovies]);

  //Make search in watchlist

  const handleChange = (e) => {
    e.preventDefault();
    setSearchTerm(e.target.value);
  };

  const handleChangeGenre = (e) => {
    e.preventDefault();
    setSearchTermGenre(e.target.value);
  };

  const handleClick = (e) => {
    e.preventDefault();
    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setToken({});
    setLoggedIn(false);
    navigate('/');
  };

  const menuId = 'primary-search-account-menu';

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <Link
        to='/'
        style={{
          fontFamily: 'inherit',
          color: 'inherit',
          textDecoration: 'none',
        }}
      >
        <MenuItem>
          <IconButton size='large' color='inherit'>
            <Badge color='error'>
              <LocalMoviesIcon />
            </Badge>
          </IconButton>
          <p>Home</p>
        </MenuItem>
      </Link>

      {loggedIn === true ? (
        <>
          <Link
            to='/myWatchList'
            style={{
              fontFamily: 'inherit',
              color: 'white',
              textDecoration: 'none',
            }}
          >
            <IconButton
              size='large'
              aria-label='show 17 new notifications'
              color='inherit'
            >
              Watchlist
              <Badge
                color='error'
                badgeContent={
                  profile.saved_movies ? profile.saved_movies.length : ''
                }
                style={{
                  marginRight: '0.35rem',
                  marginLeft: '0.25rem',
                }}
                overlap='circular'
              >
                <LocalMoviesIcon style={{ fontSize: '2.5rem' }} />
              </Badge>
            </IconButton>
          </Link>
          <IconButton
            size='large'
            edge='end'
            aria-label='account of current user'
            aria-controls={menuId}
            aria-haspopup='true'
            color='inherit'
            style={{ marginRight: '0.2rem' }}
          >
            <AccountCircle style={{ fontSize: '2.5rem' }} />
          </IconButton>
          <Button
            variant='contained'
            style={{
              fontSize: '0.85rem',
              fontFamily: 'inherit',
              fontWeight: 'bold',
              color: 'black',
              textDecoration: 'none',
              margin: 'auto',
              marginLeft: '0.5rem',
              backgroundColor: '#f6c900',
            }}
            onClick={handleClick}
          >
            Log Out
          </Button>
        </>
      ) : (
        <Link
          to='/register'
          style={{
            fontFamily: 'inherit',
            color: 'white',
            textDecoration: 'none',
            margin: 'auto',
          }}
        >
          <Button
            variant='contained'
            style={{
              backgroundColor: '#F6C900',
              color: 'black',
              margin: 'auto',
              fontWeight: '600',
            }}
          >
            Register
          </Button>
        </Link>
      )}
    </Menu>
  );

  return (
    <>
      {/* <GlobalContext.Consumer>
        {(values) => {
          console.log('Consumer values', values);
          return ( */}
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position='fixed' style={{ background: 'black' }}>
          <Toolbar style={{ width: '90%' }}>
            <Typography
              variant='h6'
              noWrap
              component='div'
              sx={{ display: { xs: 'none', sm: 'block' } }}
              style={{ marginLeft: '10%' }}
            >
              <div style={{ width: '100%', height: '6rem' }}>
                <Link
                  to='/'
                  style={{
                    marginRight: '5vw',
                  }}
                >
                  <img
                    src={logo}
                    alt=''
                    style={{
                      width: '7rem',
                      marginRight: '2rem',
                    }}
                  />
                </Link>
              </div>
            </Typography>

            <Search>
              <SearchIconWrapper>
                <SearchIcon style={{ fontSize: '2rem' }} />
              </SearchIconWrapper>
              <StyledInputBase
                type='search'
                placeholder='Search…'
                inputProps={{ 'aria-label': 'search' }}
                value={searchTerm}
                onChange={handleChange}
              />
            </Search>
            <Search style={{ marginLeft: '1rem' }}>
              <SearchIconWrapper>
                <SearchIcon style={{ fontSize: '2rem' }} />
              </SearchIconWrapper>
              <StyledInputBase
                type='search'
                placeholder='Search by genre'
                inputProps={{ 'aria-label': 'search' }}
                value={searchTermGenre}
                onChange={handleChangeGenre}
              />
            </Search>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              {loggedIn === true ? (
                <>
                  <Link
                    to='/myWatchList'
                    style={{
                      fontFamily: 'inherit',
                      color: 'white',
                      textDecoration: 'none',
                    }}
                  >
                    <IconButton
                      size='large'
                      aria-label='show 17 new notifications'
                      color='inherit'
                    >
                      Watchlist
                      <Badge
                        color='error'
                        badgeContent={
                          profile.saved_movies
                            ? profile.saved_movies.length
                            : ''
                        }
                        style={{
                          marginRight: '0.35rem',
                          marginLeft: '0.25rem',
                        }}
                        overlap='circular'
                      >
                        <LocalMoviesIcon style={{ fontSize: '2.5rem' }} />
                      </Badge>
                    </IconButton>
                  </Link>
                  <IconButton
                    size='large'
                    edge='end'
                    aria-label='account of current user'
                    aria-controls={menuId}
                    aria-haspopup='true'
                    color='inherit'
                    style={{ marginRight: '0.2rem' }}
                  >
                    <AccountCircle style={{ fontSize: '2.5rem' }} />
                  </IconButton>

                  <Button
                    variant='contained'
                    style={{
                      fontSize: '0.85rem',
                      fontFamily: 'inherit',
                      fontWeight: 'bold',
                      color: 'black',
                      textDecoration: 'none',
                      margin: 'auto',
                      marginLeft: '0.5rem',
                      backgroundColor: '#f6c900',
                    }}
                    onClick={handleClick}
                  >
                    Log Out
                  </Button>
                </>
              ) : (
                <>
                  <Link
                    to='/register'
                    style={{
                      fontFamily: 'inherit',
                      color: 'white',
                      textDecoration: 'none',
                      margin: 'auto',
                    }}
                  >
                    <Button
                      variant='contained'
                      style={{
                        backgroundColor: '#F6C900',
                        color: 'black',
                        margin: 'auto',
                        fontWeight: '600',
                      }}
                    >
                      Register
                    </Button>
                  </Link>
                  <Link
                    to='/login'
                    style={{
                      fontFamily: 'inherit',
                      color: 'white',
                      textDecoration: 'none',
                      margin: 'auto',
                    }}
                  >
                    <Button
                      variant='contained'
                      style={{
                        backgroundColor: '#F6C900',
                        color: 'black',
                        margin: 'auto',
                        marginLeft: '1rem',
                        fontWeight: '600',
                      }}
                    >
                      Log in
                    </Button>
                  </Link>
                </>
              )}
            </Box>
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size='large'
                aria-label='show more'
                aria-controls={mobileMenuId}
                aria-haspopup='true'
                onClick={handleMobileMenuOpen}
                color='inherit'
              >
                <MoreIcon style={{ fontSize: '2rem' }} />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
        {renderMobileMenu}
      </Box>
      );
      {/* }}
      </GlobalContext.Consumer> */}
    </>
  );
}
