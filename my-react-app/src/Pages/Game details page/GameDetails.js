import React, { useEffect, useState } from 'react';
import Navigation from "../../Components/Navigation bar/Navbar"
import Searchbar from "../../Components/Search bar/Searchbar"
import "./GameDetails.css"
import axios from 'axios';
import { useParams } from 'react-router-dom';

const GameDetail = () => {
  const [gameDetail, setGameDetail] = useState(null);
  const [isOverlayVisible, setIsOverlayVisible] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    axios.get('http://localhost:3001/proxy/game-detail', {
      params: {
        gameId: id,
      },
      withCredentials: true,
    })
      .then(response => {
        const data = response.data
        setGameDetail(data);
      })
      .catch(error => {
        console.error('Error fetching game details:', error);
      });
  }, [id]);

  if (!gameDetail) {
    return <div className='loading-screen'></div>;
  }

  const handleOverlayToggle = () => {
    setIsOverlayVisible(!isOverlayVisible);
  };

  return (
    <div className='gamedetail-container'>
      <Navigation />
      <div className="searchbar-component">
      <Searchbar />
      </div>
      <div
        className='gamedetail-thumbnail'
        style={{
          backgroundImage: `url(${gameDetail.background_image})`,
        }}
      >

        <div className="gamedetail-overlay"
          style={{
            visibility: isOverlayVisible ? 'visible' : 'hidden',
          }}>
          <div className='gamedetail-content'>
            <button onClick={handleOverlayToggle} className="overlay-toggle-button">
              X
            </button>
            <div className='left-column'>
              <h2 className='gamedetail-title'>{gameDetail.name}</h2>
              <p className='gamedetail-rating'>Rating: {gameDetail.rating}</p>
              <p className='gamedetail-RD'>
                Release Date: {new Date(gameDetail.released).toLocaleDateString('en-GB')}
              </p>
              <p className='gamedetail-description'>{gameDetail.description_raw}</p>
            </div>
            <div className='seperator'></div>
            <div className='right-column'>
              <div className="gamedetail-tags">
                <h3>Tags</h3>
                <ul>
                  {gameDetail.tags.slice(0, 10).map((tag) => (
                    <li key={tag.id}>{tag.name}</li>
                  ))}
                </ul>
              </div>
              <div className="gamedetail-platforms">
                <h3>Platforms</h3>
                <ul>
                  {gameDetail.platforms.map((platform) => (
                    <li key={platform.platform.id}>
                      <a href={platform.platform.url} target="_blank" rel="noopener noreferrer">
                        {platform.platform.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="gamedetail-links">
                <h3>Links</h3>
                <ul>
                  {gameDetail.metacritic_url && (
                    <li>
                      <a href={gameDetail.metacritic_url} target="_blank" rel="noopener noreferrer">
                        Metacritic
                      </a>
                    </li>
                  )}
                  {gameDetail.steam_url && (
                    <li>
                      <a href={gameDetail.steam_url} target="_blank" rel="noopener noreferrer">
                        Steam Page
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
          <div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDetail;
