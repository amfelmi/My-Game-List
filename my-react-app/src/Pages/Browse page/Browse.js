import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../Components/Navigation bar/Navbar';
import Searchbar from '../../Components/Search bar/Searchbar';
import "./Browse.css";
import AddGame from '../../Components/Add List/AddGame';

const Browse = () => {
  const [games, setGames] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchGames(currentPage);
  }, [currentPage]);

  const fetchGames = (page) => {
    axios.get(`http://localhost:3001/get-games?page=${page}`)
      .then(response => {
        setGames(prevGames => [...prevGames, ...response.data]);
      })
      .catch(error => {
        console.error('Error fetching games:', error);
      });
  };

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchGames(nextPage);
  };

  return (
    <div>
      <Navbar />
      <Searchbar />
      <div className="game-grid">
        {games.map((game, index) => (
          <div key={`${game.gid}-${index}`} className="game-card">
            <img className="game-thumbnail" src={game.image} alt={game.title} />
            <h2 className='game-title'>{game.title}</h2>
            <p>
              Rating: <span className="game-rating">{game.rating}</span> <br />
              Release date:{' '}
              <span className="game-rating">
                {new Date(game.date_released).toLocaleDateString('en-GB')}
              </span>
            </p>
            <AddGame gid={game.gid} />
          </div>
        ))}
      </div>
      <div className="load-more-button">
        <button onClick={handleLoadMore}>Load More</button>
      </div>
    </div>
  );
};

export default Browse;
