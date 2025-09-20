import React from 'react'
import Movie from './Movie'
import useInfiniteScroll from '../hooks/useInfiniteScroll'
import '../styles/movies.scss'

const Movies = ({ movies, viewTrailer, loadMoreMovies, isTyping = false }) => {
    // Debug logging
    console.log('🎬 Movies component render:', { 
        hasMore: movies.hasMore, 
        loadingMore: movies.loadingMore, 
        isTyping,
        movieCount: movies.movies?.length || 0
    })
    
    // Set up infinite scroll - MUST be called before any early returns
    const lastElementRef = useInfiniteScroll(
        loadMoreMovies,
        movies.hasMore,
        movies.loadingMore,
        isTyping
    )

    // Don't render movies if there's an error or still loading
    if (movies.loading || movies.error) {
        return null
    }

    // Handle case where movies data might not be available
    if (!movies.movies || movies.movies.length === 0) {
        return (
            <div className="text-center" style={{ padding: '40px' }}>
                <h5>No movies found</h5>
                <p>Try searching for a different movie or check your connection.</p>
            </div>
        )
    }

    return (
        <div className="movies-grid" data-testid="movies">
            {movies.movies.map((movie, index) => {
                // Attach ref to the last movie for infinite scroll
                const isLastMovie = index === movies.movies.length - 1
                
                return (
                    <div 
                        key={movie.id} 
                        ref={isLastMovie ? lastElementRef : null}
                    >
                        <Movie 
                            movie={movie} 
                            viewTrailer={viewTrailer}
                        />
                    </div>
                )
            })}
            
            {/* Loading indicator for infinite scroll */}
            {movies.loadingMore && (
                <div className="loading-more" style={{
                    gridColumn: '1 / -1',
                    textAlign: 'center',
                    padding: '20px',
                    color: '#fff'
                }}>
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading more movies...</span>
                    </div>
                    <p style={{ marginTop: '10px' }}>Loading more movies...</p>
                </div>
            )}
            
            {/* Manual Load More Button (fallback) */}
            <div className="load-more-button" style={{
                gridColumn: '1 / -1',
                textAlign: 'center',
                padding: '20px'
            }}>
                <button 
                    className="btn btn-primary"
                    onClick={() => {
                        console.log('🔘 Load More button clicked!', { isTyping, hasMore: movies.hasMore, loadingMore: movies.loadingMore })
                        loadMoreMovies()
                    }}
                    disabled={isTyping || movies.loadingMore}
                    style={{ 
                        padding: '10px 20px', 
                        fontSize: '16px',
                        opacity: (isTyping || movies.loadingMore) ? 0.5 : 1,
                        cursor: (isTyping || movies.loadingMore) ? 'not-allowed' : 'pointer'
                    }}
                >
                    {isTyping ? 'Typing...' : movies.loadingMore ? 'Loading...' : 'Load More Movies'}
                </button>
                <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                    Debug: hasMore={movies.hasMore ? 'true' : 'false'}, loadingMore={movies.loadingMore ? 'true' : 'false'}, isTyping={isTyping ? 'true' : 'false'}
                </p>
            </div>
            
            {/* Typing indicator */}
            {isTyping && (
                <div className="typing-message" style={{
                    gridColumn: '1 / -1',
                    textAlign: 'center',
                    padding: '20px',
                    color: '#666',
                    fontSize: '14px'
                }}>
                    <p>⌨️ Typing in search... Infinite scroll paused</p>
                </div>
            )}
            
            {/* End of results message */}
            {!movies.hasMore && movies.movies.length > 0 && (
                <div className="end-of-results" style={{
                    gridColumn: '1 / -1',
                    textAlign: 'center',
                    padding: '20px',
                    color: '#666',
                    fontSize: '14px'
                }}>
                    <p>🎬 You've reached the end of the movie list!</p>
                </div>
            )}
        </div>
    )
}

export default React.memo(Movies)
