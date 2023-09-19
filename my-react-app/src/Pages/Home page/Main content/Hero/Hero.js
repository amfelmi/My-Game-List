import React from 'react';
import "./Hero.css";

const Hero = () => {
  return (
    <div className='hero-container'>
      <div className='hero-image'>
        <div className="hero-info-box">
          <h1 className='hero-header'>
            Monitor the games you've experienced.<br />
            Catalog the ones you intend to play.<br />
            Discover newfound enjoymenet.
          </h1>
          <p className='hero-text'>The social network for gamers.</p>
        </div>
      </div>
    </div>
  );
}

export default Hero;
