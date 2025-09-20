import React, { useState } from 'react'
import { Link, NavLink } from "react-router-dom"
import { useSelector } from 'react-redux'
import { selectStarredCount } from '../data/selectors'
import useDebounce from '../hooks/useDebounce'

import '../styles/header.scss'

const Header = ({ searchMovies }) => {
  const [searchValue, setSearchValue] = useState('')
  const debouncedSearchValue = useDebounce(searchValue, 500) // 500ms delay
  
  const starredCount = useSelector(selectStarredCount)

  // Trigger search when debounced value changes
  React.useEffect(() => {
    if (debouncedSearchValue !== '') {
      searchMovies(debouncedSearchValue)
    }
  }, [debouncedSearchValue, searchMovies])

  return (
    <header>
      <Link to="/" data-testid="home" onClick={() => searchMovies('')}>
        <i className="bi bi-film" />
      </Link>

      <nav>
        <NavLink to="/starred" data-testid="nav-starred" className="nav-starred">
          {starredCount > 0 ? (
            <>
            <i className="bi bi-star-fill bi-star-fill-white" />
            <sup className="star-number">{starredCount}</sup>
            </>
          ) : (
            <i className="bi bi-star" />
          )}
        </NavLink>
        <NavLink to="/watch-later" className="nav-fav">
          watch later
        </NavLink>
      </nav>

      <div className="input-group rounded">
        <Link to="/" onClick={(e) => searchMovies('')} className="search-link" >
          <input type="search" data-testid="search-movies"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyUp={(e) => {
              if (e.key === 'Enter') {
                searchMovies(e.target.value)
              }
            }}
            className="form-control rounded" 
            placeholder="Search movies..." 
            aria-label="Search movies" 
            aria-describedby="search-addon" 
            />
        </Link>            
      </div>      
    </header>
  )
}

export default React.memo(Header)
