import './Games.css';
import { Link, NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getGames } from '../dataService';
import { appConfig } from '../config';
import Markdown from 'react-markdown'

const Games = () => {



    const [games, setGames] = useState([]);

    useEffect(() => {
        const fetchGames = async () => {
            const games = await getGames(appConfig.currentEvent, appConfig.currentYear);
             setGames(games);                
         }

        fetchGames();
    }, [setGames])


    return (
        <div className="App">
            <div className="games_container">
                <div className="App-header">
                    <NavLink to="/">Home</NavLink>
                </div>

                <div className="games-content">
                    {
                        games?.map((game, i) => (
                            <div key={i} className="gamelist">

                                <Link to={`/games/${game.id}`}>
                                    <div className="btn">{game.name}</div>
                                </Link>
                                <div><Markdown>{game.info}</Markdown></div>
                            </div>

                        ))
                    }
                </div>
            </div>
        </div>
    );
};

export default Games;