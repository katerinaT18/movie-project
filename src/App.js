import { useEffect, useState } from 'react'
import { Routes, Route, createSearchParams, useSearchParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux'
import 'reactjs-popup/dist/index.css'
import { fetchMovies } from './data/moviesSlice'
import { ENDPOINT_SEARCH, ENDPOINT_DISCOVER, ENDPOINT, API_KEY } from './constants'
import Header from './components/Header'
import Movies from './components/Movies'
import Starred from './components/Starred'
import WatchLater from './components/WatchLater'
import YouTubePlayer from './components/YoutubePlayer'
import ErrorBoundary from './components/ErrorBoundary'
import NetworkStatus from './components/NetworkStatus'
import errorLogger from './utils/errorLogger'
import './app.scss'

const App = () => {

  const movies = useSelector((state) => state.movies)  
  const dispatch = useDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const searchQuery = searchParams.get('search')
  const [videoKey, setVideoKey] = useState()
  const [isOpen, setOpen] = useState(false)
  const navigate = useNavigate()
  
  const closeModal = () => setOpen(false)
  
  // Removed unused closeCard function

  const getSearchResults = (query) => {
    if (query !== '') {
      dispatch(fetchMovies(`${ENDPOINT_SEARCH}&query=`+query))
      setSearchParams(createSearchParams({ search: query }))
    } else {
      dispatch(fetchMovies(ENDPOINT_DISCOVER))
      setSearchParams()
    }
  }

  const searchMovies = (query) => {
    navigate('/')
    getSearchResults(query)
  }

  const getMovies = () => {
    if (searchQuery) {
        dispatch(fetchMovies(`${ENDPOINT_SEARCH}&query=`+searchQuery))
    } else {
        dispatch(fetchMovies(ENDPOINT_DISCOVER))
    }
  }

  const viewTrailer = async (movie) => {
    try {
      setOpen(true)
      await getMovie(movie.id)
    } catch (error) {
      console.error('Error in viewTrailer:', error)
      errorLogger.logComponentError(error, 'viewTrailer', { movieId: movie.id })
      setOpen(false)
    }
  }

  const getMovie = async (id) => {
    const URL = `${ENDPOINT}/movie/${id}?api_key=${API_KEY}&append_to_response=videos`

    setVideoKey(null)
    
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

      const response = await fetch(URL, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      })

      clearTimeout(timeoutId)
      
      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`
        
        switch (response.status) {
          case 401:
            errorMessage = 'Invalid API key. Please check your configuration.'
            break
          case 403:
            errorMessage = 'Access forbidden. API key may be invalid or expired.'
            break
          case 404:
            errorMessage = 'Movie details not found.'
            break
          case 429:
            errorMessage = 'Too many requests. Please try again later.'
            break
          case 500:
            errorMessage = 'Server error. Please try again later.'
            break
          default:
            errorMessage = `Server error (${response.status}). Please try again.`
        }
        
        throw new Error(errorMessage)
      }
      
      const videoData = await response.json()
      
      // Check if the API returned an error
      if (videoData.status_code && videoData.status_code !== 1) {
        throw new Error(videoData.status_message || 'API returned an error')
      }

      // Validate response structure
      if (!videoData || typeof videoData !== 'object') {
        throw new Error('Invalid response format from server')
      }

      if (videoData.videos && videoData.videos.results.length) {
        const trailer = videoData.videos.results.find(vid => vid.type === 'Trailer')
        setVideoKey(trailer ? trailer.key : videoData.videos.results[0].key)
      } else {
        setVideoKey(null)
      }
    } catch (error) {
      console.error('Error fetching movie details:', error)
      setVideoKey(null)
      
      // Log error for monitoring
      if (error.name === 'AbortError') {
        console.warn('Movie details request timed out')
        errorLogger.logApiError(error, URL, { movieId: id, type: 'timeout' })
      } else if (error.message.includes('Failed to fetch')) {
        console.warn('Network error while fetching movie details')
        errorLogger.logNetworkError(error, URL)
      } else {
        errorLogger.logApiError(error, URL, { movieId: id })
      }
    }
  }

  useEffect(() => {
    getMovies()
  }, [searchQuery, dispatch])

  return (
    <ErrorBoundary>
      <NetworkStatus />
      <div className="App">
        <Header searchMovies={searchMovies} searchParams={searchParams} setSearchParams={setSearchParams} />

        <div className="container">
          {videoKey ? (
            <YouTubePlayer
              videoKey={videoKey}
            />
          ) : (
            <div style={{padding: "30px"}}><h6>no trailer available. Try another movie</h6></div>
          )}

          {/* Enhanced Error Display */}
          {movies.error && (
            <div className="alert alert-danger" role="alert" style={{
              margin: '20px',
              padding: '20px',
              backgroundColor: '#f8d7da',
              border: '1px solid #f5c6cb',
              borderRadius: '8px',
              color: '#721c24',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '20px', marginRight: '8px' }}>⚠️</span>
                    <strong>Error Loading Movies</strong>
                  </div>
                  <p style={{ margin: '0 0 15px 0', fontSize: '14px' }}>
                    {typeof movies.error === 'object' ? movies.error.message : movies.error}
                  </p>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button 
                      onClick={() => {
                        dispatch({ type: 'movies/clearError' })
                        getMovies()
                      }}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      🔄 Retry
                    </button>
                    <button 
                      onClick={() => dispatch({ type: 'movies/clearError' })}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: 'transparent',
                        color: '#721c24',
                        border: '1px solid #721c24',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
                <button 
                  onClick={() => dispatch({ type: 'movies/clearError' })}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '20px',
                    cursor: 'pointer',
                    color: '#721c24',
                    padding: '0',
                    marginLeft: '10px'
                  }}
                >
                  ×
                </button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {movies.loading && (
            <div className="text-center" style={{ padding: '40px' }}>
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p style={{ marginTop: '10px' }}>Loading movies...</p>
            </div>
          )}

          <Routes>
            <Route path="/" element={<Movies movies={movies} viewTrailer={viewTrailer} />} />
            <Route path="/starred" element={<Starred viewTrailer={viewTrailer} />} />
            <Route path="/watch-later" element={<WatchLater viewTrailer={viewTrailer} />} />
            <Route path="*" element={<h1 className="not-found">Page Not Found</h1>} />
          </Routes>
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default App
