// Validate API key is present
if (!process.env.REACT_APP_MOVIES_API_KEY) {
  console.error('❌ REACT_APP_MOVIES_API_KEY is not defined in environment variables')
  console.error('Please create a .env file with: REACT_APP_MOVIES_API_KEY=my_movies_api_key')
}

export const API_KEY = process.env.REACT_APP_MOVIES_API_KEY
export const ENDPOINT = 'https://api.themoviedb.org/3'
export const ENDPOINT_DISCOVER = ENDPOINT+'/discover/movie?api_key='+API_KEY+'&sort_by=vote_count.desc'
export const ENDPOINT_SEARCH = ENDPOINT+'/search/movie?api_key='+API_KEY
export const ENDPOINT_MOVIE = ENDPOINT+'/movie/507086?api_key='+API_KEY+'&append_to_response=videos'