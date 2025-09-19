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
import './app.scss'

const App = () => {

  const { movies } = useSelector((state) => state)  
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
      setOpen(false)
    }
  }

  const getMovie = async (id) => {
    const URL = `${ENDPOINT}/movie/${id}?api_key=${API_KEY}&append_to_response=videos`

    setVideoKey(null)
    
    try {
      const response = await fetch(URL)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const videoData = await response.json()
      
      // Check if the API returned an error
      if (videoData.status_code && videoData.status_code !== 1) {
        throw new Error(videoData.status_message || 'API returned an error')
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
      // You could also set an error state here to show user-friendly error messages
    }
  }

  useEffect(() => {
    getMovies()
  }, [searchQuery, dispatch])

  return (
    <ErrorBoundary>
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

          {/* Error Display */}
          {movies.error && (
            <div className="alert alert-danger" role="alert" style={{
              margin: '20px',
              padding: '15px',
              backgroundColor: '#f8d7da',
              border: '1px solid #f5c6cb',
              borderRadius: '5px',
              color: '#721c24'
            }}>
              <strong>Error:</strong> {movies.error}
              <button 
                onClick={() => dispatch({ type: 'movies/clearError' })}
                style={{
                  float: 'right',
                  background: 'none',
                  border: 'none',
                  fontSize: '18px',
                  cursor: 'pointer'
                }}
              >
                ×
              </button>
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
