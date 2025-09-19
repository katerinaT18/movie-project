import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

// Helper function to delay execution
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Helper function to check if error is retryable
const isRetryableError = (error) => {
    return error.name === 'TypeError' || // Network error
           error.message.includes('Failed to fetch') ||
           error.message.includes('NetworkError') ||
           error.message.includes('timeout')
}

export const fetchMovies = createAsyncThunk(
    'fetch-movies', 
    async (apiUrl, { rejectWithValue, signal }) => {
        const maxRetries = 3
        let lastError

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                // Check if request was cancelled
                if (signal?.aborted) {
                    throw new Error('Request was cancelled')
                }

                const controller = new AbortController()
                const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

                const response = await fetch(apiUrl, {
                    signal: controller.signal,
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    }
                })

                clearTimeout(timeoutId)

                if (!response.ok) {
                    let errorMessage = `HTTP ${response.status}: ${response.statusText}`
                    
                    // Provide specific error messages for common HTTP status codes
                    switch (response.status) {
                        case 401:
                            errorMessage = 'Invalid API key. Please check your configuration.'
                            break
                        case 403:
                            errorMessage = 'Access forbidden. API key may be invalid or expired.'
                            break
                        case 404:
                            errorMessage = 'Movie data not found.'
                            break
                        case 429:
                            errorMessage = 'Too many requests. Please try again later.'
                            break
                        case 500:
                            errorMessage = 'Server error. Please try again later.'
                            break
                        case 502:
                        case 503:
                        case 504:
                            errorMessage = 'Service temporarily unavailable. Please try again later.'
                            break
                        default:
                            errorMessage = `Server error (${response.status}). Please try again.`
                    }
                    
                    throw new Error(errorMessage)
                }
                
                const data = await response.json()
                
                // Check if the API returned an error
                if (data.status_code && data.status_code !== 1) {
                    throw new Error(data.status_message || 'API returned an error')
                }

                // Validate response structure
                if (!data || typeof data !== 'object') {
                    throw new Error('Invalid response format from server')
                }
                
                return data

            } catch (error) {
                lastError = error

                // Don't retry on certain errors
                if (error.name === 'AbortError') {
                    throw new Error('Request timed out. Please check your connection.')
                }

                if (error.message.includes('API key') || 
                    error.message.includes('forbidden') ||
                    error.message.includes('not found')) {
                    // Don't retry authentication or not found errors
                    break
                }

                // Only retry on network errors and if we haven't exceeded max retries
                if (isRetryableError(error) && attempt < maxRetries) {
                    console.warn(`Attempt ${attempt} failed, retrying in ${attempt * 1000}ms...`, error.message)
                    await delay(attempt * 1000) // Exponential backoff
                    continue
                }

                break
            }
        }

        // Return a user-friendly error message
        let userMessage = 'Failed to load movies'
        
        if (lastError) {
            if (isRetryableError(lastError)) {
                userMessage = 'Network error. Please check your internet connection and try again.'
            } else if (lastError.message.includes('API key')) {
                userMessage = lastError.message
            } else if (lastError.message.includes('timeout')) {
                userMessage = 'Request timed out. Please try again.'
            } else {
                userMessage = lastError.message
            }
        }

        return rejectWithValue({
            message: userMessage,
            originalError: lastError?.message,
            timestamp: new Date().toISOString()
        })
    }
)

const moviesSlice = createSlice({
    name: 'movies',
    initialState: { 
        movies: [],
        loading: false,
        error: null,
        lastFetch: null,
        retryCount: 0
    },
    reducers: {
        clearError: (state) => {
            state.error = null
            state.retryCount = 0
        },
        retryFetch: (state) => {
            state.retryCount += 1
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
                state.retryCount = 0
            })
            .addCase(fetchMovies.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload || { message: 'Failed to fetch movies' }
            })
    }
})

export default moviesSlice
