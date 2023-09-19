import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import "./AddGame.css"

const AddGame = ({ gid }) => {
  const [uid, setUid] = useState("");
  const [isInList, setIsInList] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  axios.defaults.withCredentials = true;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get('http://localhost:3001/get-uid');
        if (res.data.Status === "Success") {
          setIsLoggedIn(true);
          setUid(res.data.uid);

          // Check if the game is in the user's list
          const isInListRes = await axios.get(`http://localhost:3001/isInList?gid=${gid}&uid=${res.data.uid}`);

          setIsInList(isInListRes.data.isInList);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Error fetching uid:', error);
      }
    };

    fetchUserData();
  }, [gid]);

  // Redirect the user to the sign-in page if not logged in
  const handleAddToList = () => {
    if (!isLoggedIn) {
      window.location.href = '/sign-in';
      return;
    }

    // Perform the API call to add the game to the user's list
    axios.post('http://localhost:3001/add-game', { gid, uid })
      .then(response => {
        setIsInList(true);
      })
      .catch(error => {
        console.error('Error adding game to list:', error);
      });
  };

  //HANDLE REMOVING GAME FROM LIST
  const handleRemoveGame = (uid, gid) => {
    // Update the game's list
    axios.delete('http://localhost:3001/remove-from-mylist', {
        data: { uid: uid, gid: gid }
    })
        .then(response => {
          setIsInList(false);
            console.log(response);
        })
        .catch(error => {
            console.error('Error updating game list:', error);
        });
};

  return (
    <div>
      {isInList ? (
        <div className='clarity-box'>
          <button className='added-to-list-text' onClick={() => handleRemoveGame(uid, gid)}>In list</button>
        </div>
      ) : (
        <button className='add-to-list-btn' onClick={handleAddToList}>Add to List</button>
      )}

    </div>
  );
};

export default AddGame;
