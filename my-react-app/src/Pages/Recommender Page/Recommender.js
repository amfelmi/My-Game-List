import React, { useState } from 'react';
import "./Recommender.css";
import Navigation from "../../Components/Navigation bar/Navbar"
import Searchbar from "../../Components/Search bar/Searchbar"
import UserInput from './UserInput';
import Footer from "../../Components/Footer/Footer"
import axios from 'axios';
import AddGame from './../../Components/Add List/AddGame'

const Recommender = () => {
  const [gameTitle, setGameTitle] = useState("");
  const [recommendations, setRecommendations] = useState([]);

  const handleSearchTitleChange = (newTitle) => {
    setGameTitle(newTitle); // Update the search title state
  };

  const handleInputChange = (event) => {
    setGameTitle(event.target.value); // Change the game title state with the user's input
  };

  axios.defaults.withCredentials = true;

  const handleRecommendations = async () => {
    try {
      const trimmedTitle = gameTitle.trim(); // Because "\r" keeps appearing at the end for some reason
      const response = await axios.post('http://127.0.0.1:5000/get_recommendations', { title: trimmedTitle });
      const recommendations = response.data;
      setRecommendations(recommendations); // Update recommendations
      console.log(recommendations)
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  return (
    <div>
      <Navigation />
      <Searchbar />
      <div className='recommender-container'>

        <div className='box-wrapper'>
          <section className='box'>
            <h1 className='instruction'>WELCOME TO THE LAB</h1>
            <div className='recommender-input'>
              <div className='overlap'>
                <input
                  className="search-bar"
                  value={gameTitle}
                  onChange={handleInputChange}
                  disabled
                />
                <UserInput onSearchTitleChange={handleSearchTitleChange} />
              </div>
              <button className="go-button" onClick={handleRecommendations}>
                GO!
              </button>

            </div>
          </section>


          <div className='results-wrapper'>
            {recommendations.length > 0 ? (
              recommendations.map((recommendation, index) => (
                <div key={index} className='recommendation-card'>
                  <h3 className='recommendation-card-title'>{recommendation.title}</h3>
                  <img className='recommendation-card-image' src={recommendation.image_url} alt={recommendation.title} />
                  <AddGame gid={recommendation.gid} />
                </div>
              ))
            ) : (
              <p>To generate a recommendation, choose a game you love to play</p>
            )}
          </div>

        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Recommender;
