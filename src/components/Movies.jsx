import Movie from './Movie'
import '../styles/movies.scss'

const Movies = ({ movies, viewTrailer }) => {

    // Don't render movies if there's an error or still loading
    if (movies.loading || movies.error) {
        return null
    }

    // Handle case where movies data might not be available
    if (!movies.movies || !movies.movies.results || movies.movies.results.length === 0) {
        return (
            <div className="text-center" style={{ padding: '40px' }}>
                <h5>No movies found</h5>
                <p>Try searching for a different movie or check your connection.</p>
            </div>
        )
    }

    return (
        <div data-testid="movies">
            {movies.movies.results.map((movie) => {
                return (
                    <Movie 
                        movie={movie} 
                        key={movie.id}
                        viewTrailer={viewTrailer}
                    />
                )
            })}
        </div>
    )
}

export default Movies
