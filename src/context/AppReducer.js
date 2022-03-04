export default (state, { type, payload }) => {
  switch (type) {
    case 'ADD_MOVIE_TO_WATCHLIST':
      return {
        ...state,
        watchList: [...state.watchList, payload],
      };
    case 'REMOVE_FROM_WATCHLIST':
      return {
        ...state,
        watchList: state.watchList.filter(
          (watchListMovie) => watchListMovie.title !== payload.title
        ),
      };

    default:
      return state;
  }
};
