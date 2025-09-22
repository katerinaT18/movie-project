# Movieland 

React + Redux + RTK + Bootstrap application that fetches movies from [https://www.themoviedb.org/](https://www.themoviedb.org/)

Created with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm install`

Install all dependencies

### Environment Setup

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Get your TMDB API key from [https://www.themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)

3. Update the `.env` file with your API key:
   ```
   REACT_APP_MOVIES_API_KEY=my_movies_api_key
   ```

**Important**: Never commit your `.env` file to version control. It contains sensitive information.

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.