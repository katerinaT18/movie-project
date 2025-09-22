import { createSlice } from "@reduxjs/toolkit"

const starredSlice = createSlice({
    name: 'starred',
    initialState: {
        starredMovies: [],
        error: null
    },
    reducers: {
        starMovie: (state, action) => {
            // Check if movie is already starred to prevent duplicates
            const existingMovie = state.starredMovies.find(movie => movie.id === action.payload.id)
            if (!existingMovie) {
                state.starredMovies = [action.payload, ...state.starredMovies]
                state.error = null
            }
        },
        unstarMovie: (state, action) => {
            const indexOfId = state.starredMovies.findIndex(key => key.id === action.payload.id)
            if (indexOfId !== -1) {
                state.starredMovies.splice(indexOfId, 1)
                state.error = null
            }
        },
        clearAllStarred: (state) => {
            state.starredMovies = []
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

export default starredSlice
