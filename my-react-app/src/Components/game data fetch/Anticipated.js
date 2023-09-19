import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Anticipated.css';
import axios from 'axios';

const Anticipated = () => {
  const [anticipatedReleases, setAnticipatedReleases] = useState([]);

  //Populating the state from the data receieved from API. 
  useEffect(() => {
    axios.get('http://localhost:3001/proxy/anticipated-games', { withCredentials: true })
      .then(response => {
        setAnticipatedReleases(response.data);
      })
      .catch(error => {
        console.error('Error fetching Anticipated releases:', error);
      });
  }, []);

  return (
    <section className="gamelist-wrapper2">
      {anticipatedReleases.map((game) => (
        <div className="game-card2" key={game.id}>
          <Link to={`/game/${game.id}`} className="link-style2">
            <h2 className="game-title2">{game.name}</h2>
          </Link>
          <Link to={`/game/${game.id}`} className="link-style2">
            <img
              className="game-thumbnail2"
              src={game.background_image}
              alt={game.name}
            />
          </Link>
          <p>
            Release date:{' '}
            <span className="game-rating2">
              {new Date(game.released).toLocaleDateString('en-GB')}
            </span>
          </p>
        </div>
      ))}
    </section>
  );
};

export default Anticipated;
