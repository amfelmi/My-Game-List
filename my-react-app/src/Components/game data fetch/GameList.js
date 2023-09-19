import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './GameList.css';
import axios from 'axios';

const GameList = () => {
  const [latestReleases, setLatestReleases] = useState([]);

  //Populating the state from the data receieved from API. 
  useEffect(() => {
    axios.get('http://localhost:3001/proxy/latest-games', {
      params: {
        formattedDate: calculateDateRange(),
      },
    })
      .then(response => {
        const data = response.data.results;
        setLatestReleases(data);
      })
      .catch(error => {
        console.error('Error fetching latest releases:', error);
      });
  }, []);

  //Date to query games released from 30 days ago.
  const calculateDateRange = () => {
    const currentDate = new Date();
    const thirtyDaysAgo = new Date(currentDate);
    thirtyDaysAgo.setDate(currentDate.getDate() - 30);
    const formattedDate = `${thirtyDaysAgo.toISOString().split('T')[0]},${currentDate.toISOString().split('T')[0]}`;
    return formattedDate;
  };

  return (
    <section className="gamelist-wrapper">
      {latestReleases.map((game) => (
        <div className="game-card" key={game.id}>
          <Link to={`/game/${game.id}`} className="link-style">
            <h2 className="game-title">{game.name}</h2>
          </Link>
          <Link to={`/game/${game.id}`} className="link-style">
            <img
              className="game-thumbnail"
              src={game.background_image}
              alt={game.name}
            />
          </Link>
          <p>
            Rating: <span className="game-rating">{game.rating}</span> <br />
            Release date:{' '}
            <span className="game-rating">
              {new Date(game.released).toLocaleDateString('en-GB')}
            </span>
          </p>
        </div>
      ))}
    </section>
  );
};

export default GameList;
