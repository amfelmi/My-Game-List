import React, { useState } from 'react';
import "./Recommender.css";
import "./UserInput.css";
import axios from 'axios';

const UserInput = ({ onSearchTitleChange }) => {
  const [searchTitle, setSearchTitle] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  axios.defaults.withCredentials = true; //To avoid CORS error

  //Fetching data after every user input
  const handleInputChange = async (e) => {
    const newSearchTitle = e.target.value;
    setSearchTitle(newSearchTitle);

    if (newSearchTitle) {
      try {
        const response = await axios.post('http://localhost:5001/steam', {
          title: newSearchTitle,
        });
        setSearchResults(response.data);
      } catch (error) {
        console.error('Error searching games:', error);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleResultClick = (result) => {
    onSearchTitleChange(result.title);
    setSearchResults([]); // Clear search result after click
    setSearchTitle(result.title);
  };

  return (
    <div>
      <input
        className='duplicate-bar'
        type="text"
        placeholder="Search by title"
        value={searchTitle}
        onChange={handleInputChange}
      />
      <div className='search-results'>
        {searchResults.length > 0 && (
          <ul className='results-list'>
            {searchResults.slice(0, 5).map((result) => (
              <li className='result-item' key={result.id} onClick={() => handleResultClick(result)}>
                {result.title}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UserInput
