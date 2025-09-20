import React from 'react'
import Movie from './Movie'
import useInfiniteScroll from '../hooks/useInfiniteScroll'
import '../styles/movies.scss'

const Movies = ({ movies, viewTrailer, loadMoreMovies }) => {
    // Set up infinite scroll - MUST be called before any early returns
    const lastElementRef = useInfiniteScroll(
        loadMoreMovies,
        movies.hasMore,
        movies.loadingMore
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
