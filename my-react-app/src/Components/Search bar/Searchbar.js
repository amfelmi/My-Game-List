import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import "./Searchbar.css"

export default function Searchbar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [gameResults, setGameResults] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const searchbarRef = useRef(null);
  const resultsRef = useRef(null);
  const API_KEY = '4640b336cff145f98c613e2a8ea15843';
  const apiUrl = 'https://api.rawg.io/api/games';

  useEffect(() => {
    if (searchTerm.trim() !== '') {
      fetch(`${apiUrl}?search=${searchTerm}&key=${API_KEY}`)
        .then((res) => res.json())
        .then((data) => {
          const results = data.results || [];
          setGameResults(results);
          console.log(results)
          console.log(setGameResults)
        })
        .catch((error) => {
          console.error('Error fetching game data:', error);
        });
    } else {
      setGameResults([]);
    }
  }, [searchTerm]);

  // When user clicks outside the searchbar (unfocussing)
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        searchbarRef.current &&
        !searchbarRef.current.contains(event.target) &&
        resultsRef.current &&
        !resultsRef.current.contains(event.target)
      ) {
        setIsFocused(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="container">
      <div className="search-wrapper">
        <div className="searchbar-container" ref={searchbarRef}>
          <input
            className="searchbar"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsFocused(true)}
          />
          {isFocused && gameResults.length > 0 && (
            <div className="searchbar-results" ref={resultsRef}>
              <ul className="searchbar-results-list">
                {gameResults.map((result) => (
                  <Link key={result.id} to={`/game/${result.id}`} className='results-link'>
                    <li className='searchbar-result-item' >
                      <span className="result-name">{result.name}</span>
                    </li>
                  </Link>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
