import { createSlice } from "@reduxjs/toolkit"

const watchLaterSlice = createSlice({
    name: 'watch-later',
    initialState: {
        watchLaterMovies: [],
        error: null
    },
    reducers: {
        addToWatchLater: (state, action) => {
            // Check if movie is already in watch later to prevent duplicates
            const existingMovie = state.watchLaterMovies.find(movie => movie.id === action.payload.id)
            if (!existingMovie) {
                state.watchLaterMovies = [action.payload, ...state.watchLaterMovies]
                state.error = null
            }
        },
        removeFromWatchLater: (state, action) => {
            const indexOfId = state.watchLaterMovies.findIndex(key => key.id === action.payload.id)
            if (indexOfId !== -1) {
                state.watchLaterMovies.splice(indexOfId, 1)
                state.error = null
            }
        },
        removeAllWatchLater: (state) => {
            state.watchLaterMovies = []
            state.error = null
        },
        setError: (state, action) => {
            state.error = action.payload
        },
        clearError: (state) => {
            state.error = null
        }
    },
})

export default watchLaterSlice
