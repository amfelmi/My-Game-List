import React, { useState, useEffect } from 'react'
import axios from 'axios';
import Navbar from '../../Components/Navigation bar/Navbar';
import Searchbar from '../../Components/Search bar/Searchbar';
import "./MyList.css"
import ListNav from '../../Components/Game List Navbar/ListNav';

const BacklogList = () => {
    const [uid, setUid] = useState("");
    const [games, setGames] = useState([]);
    const [rating, setRating] = useState([]);
    const [selectedGame, setSelectedGame] = useState(null);
    const condition = "backlog";

    axios.defaults.withCredentials = true;

    useEffect(() => {
        // Fetch user's UID
        axios.get('http://localhost:3001/get-uid')
            .then(res => {
                if (res.data.Status === "Success") {
                    setUid(res.data.uid);
                    // Fetch games associated with the user's UID
                    fetchGamesByUid(res.data.uid, condition);
                    fetchRating(res.data.uid);
                }
            })
            .catch(error => {
                console.error('Error fetching uid:', error);
            });
    }, []);

    const fetchGamesByUid = (uid, condition) => {
        axios.get(`http://localhost:3001/get-games-by-uid?uid=${uid}&condition=${condition}`)
            .then(response => {
                setGames(response.data);
            })
            .catch(error => {
                console.error('Error fetching games by UID:', error);
            });
    };

    //HANDLE RATING CHANGE_________________________________________________________________________________

    const handleRatingChange = async (event, game) => {
        const newRating = event.target.value;

        // Fetch user's rated games from the server
        try {
            const response = await axios.get(`http://localhost:3001/get-user-ratings?uid=${uid}`);
            const ratedGames = response.data;

            // Check if the user has already rated the game
            const existingRating = ratedGames.find(ratedGame => ratedGame.gid === game.gid);

            if (existingRating) {
                // Update the existing rating
                updateRating(game.gid, newRating);

                // Update the local rating array as well
                const updatedRating = rating.map(ratedGame => {
                    if (ratedGame.gid === game.gid) {
                        return { ...ratedGame, rating: newRating };
                    }
                    return ratedGame;
                });
                setRating(updatedRating);
            } else {
                // Insert a new rating
                insertRating(game.gid, newRating);
            }
        } catch (error) {
            console.error('Error fetching user ratings:', error);
        }
    };



    const insertRating = (gid, rating) => {
        axios.post('http://localhost:3001/insert-rating', { uid, gid, rating })
            .then(response => {
                console.log(response.data.message);
                // Update the local state to reflect the change
                setGames(prevGames => {
                    const updatedGames = prevGames.map(game => {
                        if (game.gid === gid) {
                            return { ...game, user_rating: { rating } };
                        }
                        return game;
                    });
                    return updatedGames;
                });
            })
            .catch(error => {
                console.error('Error inserting rating:', error);
            });
    };

    const updateRating = (gid, newRating) => {
        // Update the user's rating for the game
        axios.put('http://localhost:3001/update-rating', { uid, gid, rating: newRating })
            .then(response => {
                console.log(response.data.message);
                // Update the local state to reflect the change
                setGames(prevGames => {
                    const updatedGames = prevGames.map(game => {
                        if (game.user_rating && game.user_rating.gid === gid) {
                            return {
                                ...game,
                                user_rating: { ...game.user_rating, rating: newRating },
                            };
                        }
                        return game;
                    });
                    return updatedGames;
                });
            })
            .catch(error => {
                console.error('Error updating rating:', error);
            });
    };

    const fetchRating = (uid) => {
        axios.get(`http://localhost:3001/get-user-ratings?uid=${uid}`)
            .then(response => {
                console.log(response.data)
                setRating(response.data);
            })
            .catch(error => {
                console.error('Error fetching games by UID:', error);
            });
    };

    //HANDLE LIST CHANGE_________________________________________________________________________________

    const handleListChange = async (event, game) => {
        const newList = event.target.value;

        // Fetch user's lists from the server
        try {
            const response = await axios.get(`http://localhost:3001/get-user-lists?uid=${uid}`);
            const userLists = response.data; // Assuming the response contains an array of user's lists

            // Check if the game already exists in the user's lists
            const existingGame = userLists.find(listedGame => listedGame.gid === game.gid);

            if (existingGame) {
                // Update the existing game's list
                updateGameList(game.gid, newList);
            } else {
                // Insert a new game into the chosen list
                insertGameIntoList(game.gid, newList);
            }
        } catch (error) {
            console.error('Error fetching user lists:', error);
        }
    };

    const insertGameIntoList = (gid, list) => {
        axios.post('http://localhost:3001/insert-game-into-list', { uid, gid, list })
            .then(response => {
                console.log(response.data.message);
                // Update the local state to reflect the change
                setGames(prevGames => {
                    const updatedGames = prevGames.map(game => {
                        if (game.gid === gid) {
                            return { ...game, user_list: { list } };
                        }
                        return game;
                    });
                    return updatedGames;
                });
            })
            .catch(error => {
                console.error('Error inserting game into list:', error);
            });
    };

    const updateGameList = (gid, newList) => {
        // Update the game's list
        axios.put('http://localhost:3001/update-game-list', { uid, gid, list: newList })
            .then(response => {
                console.log(response.data.message);
                // Update the local state to reflect the change
                setGames(prevGames => {
                    const updatedGames = prevGames.map(game => {
                        if (game.user_list && game.user_list.gid === gid) {
                            return {
                                ...game,
                                user_list: { ...game.user_list, list: newList },
                            };
                        }
                        return game;
                    });
                    return updatedGames;
                });
            })
            .catch(error => {
                console.error('Error updating game list:', error);
            });
    };

    //HANDLE REMOVING GAME FROM LIST
    const handleRemoveGame = (uid, gid) => {
        // Remove game from local state
        setGames(prevGames => prevGames.filter(game => game.gid !== gid));

        // Deletion Request
        axios.delete('http://localhost:3001/remove-from-mylist', {
            data: { uid: uid, gid: gid }
        })
            .then(response => {
                console.log(response);
            })
            .catch(error => {
                console.error('Error updating game list:', error);
            });
    };

    return (
        <div>
            <Navbar />
            <Searchbar />
            <ListNav />
            <div className='page'>
                <div className='listed-game-wrapper'>
                    <div className='listed-game-container'>
                        {games.map(game => (
                            <div key={game.gid} className='listed-game'>
                                <div className='listed-info'>
                                    <div className='remove-game-from-list-btn'>
                                        <button className='remove-btn' onClick={() => handleRemoveGame(uid, game.gid)}>X</button>
                                    </div>
                                    <img className='listed-thumbnail' src={game.image} alt={game.title} />
                                    <h2 className='listed-title'>{game.title}</h2>
                                    <p>
                                        Steam Rating: <span className='listed-rating'>{game.rating}</span> <br />
                                    </p>
                                </div>
                                <div className='listed-options'>
                                    <div>
                                        {selectedGame === game.gid ? (
                                            <select
                                                value={rating.find(ratedGame => ratedGame.gid === game.gid)?.rating || '0'}
                                                onChange={(event) => handleRatingChange(event, game)}
                                                onBlur={() => setSelectedGame(null)} // Hide the select when it loses focus
                                            >
                                                <option value='0'>Select rating</option>
                                                <option value='1'>1 Appalling</option>
                                                <option value='2'>2 Very Bad</option>
                                                <option value='3'>3 Bad</option>
                                                <option value='4'>4 Below Average</option>
                                                <option value='5'>5 Average</option>
                                                <option value='6'>6 Fine</option>
                                                <option value='7'>7 Good</option>
                                                <option value='8'>8 Great</option>
                                                <option value='9'>9 Excellent</option>
                                                <option value='10'>10 Masterpiece</option>
                                            </select>
                                        ) : (
                                            <a className='score-link'
                                                href='#'
                                                onClick={(event) => {
                                                    event.preventDefault(); //The page scrolls to the top due to default behaviour of <a href="#">. That was user unfriendly.
                                                    setSelectedGame(game.gid);
                                                }}>
                                                {rating.find(ratedGame => ratedGame.gid === game.gid)?.rating || 'Select rating'}
                                            </a>
                                        )}
                                    </div>
                                    <div>
                                        <select onChange={(event) => handleListChange(event, game)}>
                                            <option value='0'>Choose List</option>
                                            <option value='completed'>Completed</option>
                                            <option value='on hold'>On Hold</option>
                                            <option value='backlog'>Backlog</option>
                                            <option value='dropped'>Dropped</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BacklogList
