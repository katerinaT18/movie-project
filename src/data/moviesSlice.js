import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

export const fetchMovies = createAsyncThunk('fetch-movies', async (apiUrl, { rejectWithValue }) => {
    try {
        const response = await fetch(apiUrl)
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        
        // Check if the API returned an error
        if (data.status_code && data.status_code !== 1) {
            throw new Error(data.status_message || 'API returned an error')
        }
        
        return data
    } catch (error) {
        return rejectWithValue(error.message)
    }
})

const moviesSlice = createSlice({
    name: 'movies',
    initialState: { 
        movies: [],
        loading: false,
        error: null,
        lastFetch: null
    },
    reducers: {
        clearError: (state) => {
            state.error = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMovies.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchMovies.fulfilled, (state, action) => {
                state.loading = false
                state.movies = action.payload
                state.error = null
                state.lastFetch = new Date().toISOString()
            })
            .addCase(fetchMovies.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload || 'Failed to fetch movies'
            })
    }
})

export default moviesSlice
