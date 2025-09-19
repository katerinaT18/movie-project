import { createSelector } from '@reduxjs/toolkit'

// Base selectors
export const selectMovies = (state) => state.movies
export const selectStarred = (state) => state.starred
export const selectWatchLater = (state) => state.watchLater

// Memoized selectors for better performance
export const selectMoviesData = createSelector(
  [selectMovies],
  (movies) => movies.movies
)

export const selectMoviesLoading = createSelector(
  [selectMovies],
  (movies) => movies.loading
)

export const selectMoviesError = createSelector(
  [selectMovies],
  (movies) => movies.error
)

export const selectStarredMovies = createSelector(
  [selectStarred],
  (starred) => starred.starredMovies
)

export const selectStarredCount = createSelector(
  [selectStarredMovies],
  (starredMovies) => starredMovies.length
)

export const selectWatchLaterMovies = createSelector(
  [selectWatchLater],
  (watchLater) => watchLater.watchLaterMovies
)

export const selectWatchLaterCount = createSelector(
  [selectWatchLaterMovies],
  (watchLaterMovies) => watchLaterMovies.length
)

// Complex selectors
export const selectIsMovieStarred = createSelector(
  [selectStarredMovies, (state, movieId) => movieId],
  (starredMovies, movieId) => starredMovies.some(movie => movie.id === movieId)
)

export const selectIsMovieInWatchLater = createSelector(
  [selectWatchLaterMovies, (state, movieId) => movieId],
  (watchLaterMovies, movieId) => watchLaterMovies.some(movie => movie.id === movieId)
)

// Combined selectors
export const selectMovieStatus = createSelector(
  [selectIsMovieStarred, selectIsMovieInWatchLater],
  (isStarred, isInWatchLater) => ({
    isStarred,
    isInWatchLater
  })
)
