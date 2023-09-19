import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./MiniList.css";

const MiniList = () => {
    const [games, setGames] = useState([]);
    const [auth, setAuth] = useState(false);

    axios.defaults.withCredentials = true;

    useEffect(() => {
        // Fetch user's UID
        axios.get('http://localhost:3001/get-uid')
            .then(res => {
                if (res.data.Status === "Success") {
                    // Fetch games associated with the user's UID
                    fetchGamesByUid(res.data.uid);
                    setAuth(true);
                }
            })
            .catch(error => {
                console.error('Error fetching uid:', error);
            });
    }, []);

    const fetchGamesByUid = (uid, condition) => {
        axios.get(`http://localhost:3001/get-mylist?uid=${uid}`)
            .then(response => {
                setGames(response.data);
                console.log(games)
            })
            .catch(error => {
                console.error('Error fetching games by UID:', error);
            });
    };

    return (
        <div className='minilist-container'>
            {auth ? (
                <>
                    <h2><a className='minilist-link' href="/mylist">Your List</a></h2>
                    <div className='minilist-game-wrapper'>
                        <div className='minilist-games'>
                            {games.map(game => (
                                <div key={game.gid} className='mini-listed-game'>
                                    <img className='listed-thumbnail' src={game.image} alt={game.title} />
                                    <h2 className='mini-listed-title'>{game.title}</h2>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <h2>Your List</h2>
                    <div className='minilist-game-wrapper'>
                        <p className='sign-in-para'><a className='minilist-link' href="/sign-in">Sign In</a> to access your list ! </p>
                    </div>
                </>
            )
            }

        </div>
    )
}

export default MiniList
