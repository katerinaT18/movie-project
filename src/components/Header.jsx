import React, { useState } from 'react'
import { Link, NavLink } from "react-router-dom"
import { useSelector } from 'react-redux'
import { selectStarredCount } from '../data/selectors'
import useDebounce from '../hooks/useDebounce'

import '../styles/header.scss'

const Header = ({ searchMovies, onSearchInput, onSearchFocus, onSearchBlur }) => {
  const [searchValue, setSearchValue] = useState('')
  const debouncedSearchValue = useDebounce(searchValue, 500) // 500ms delay
  
  const starredCount = useSelector(selectStarredCount)

  // Trigger search when debounced value changes
  React.useEffect(() => {
    if (debouncedSearchValue !== '') {
      searchMovies(debouncedSearchValue)
    }
  }, [debouncedSearchValue, searchMovies])

  const handleSearchInput = (e) => {
    const value = e.target.value
    console.log('🔍 Header handleSearchInput called with value:', value)
    setSearchValue(value)
    if (onSearchInput) {
      onSearchInput(e)
    }
    
    // Handle browser's built-in clear button
    if (value === '') {
      console.log('❌ Search cleared via x button - calling searchMovies("")')
      // Clear search and go to first page
      searchMovies('')
      console.log('⬆️ Search cleared - should go to first page')
    }
  }

  return (
    <header>
      <Link to="/" data-testid="home" onClick={() => {
        console.log('🏠 Home button clicked - clearing search')
        setSearchValue('')
        searchMovies('')
        if (onSearchInput) {
          onSearchInput({ target: { value: '' } })
        }
        console.log('⬆️ Home clicked - should go to first page')
      }}>
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
        <input 
          type="search" 
          data-testid="search-movies"
          value={searchValue}
          onChange={handleSearchInput}
          onFocus={onSearchFocus}
          onBlur={onSearchBlur}
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
      </div>      
    </header>
  )
}

export default React.memo(Header)
