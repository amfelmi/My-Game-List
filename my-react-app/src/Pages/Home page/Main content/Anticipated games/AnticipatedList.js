import React from 'react';
import './AnticipatedList.css';
import Anticipated from '../../../../Components/game data fetch/Anticipated';

export default function NewReleases() {
  return (
    <div className='minilist-container'>
        <h1 className='Anticipated-header'>Anticipated Games This Year</h1>
        <Anticipated />
    </div>
  );
}