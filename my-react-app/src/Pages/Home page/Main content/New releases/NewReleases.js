import React from 'react';
import './NewReleases.css';
import GameList from '../../../../Components/game data fetch/GameList';

export default function NewReleases() {
  return (
    <div className='gamelist-box'>
      <div className='wrapper'>
        <h1 className='newReleases-header'>Newest Releases</h1>
        <GameList />
      </div>
    </div>
  );
}