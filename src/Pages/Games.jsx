import './Games.css';
import { Link, NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getGames } from '../dataService';
import Markdown from 'react-markdown'
import { getConfig } from '../configService';
import loader from '../assets/loader.svg';

const Games = () => {

    const [config, setConfig] = useState(null);
    useEffect(() => {
        const loadConfig = async () => {
            try {
                const data = await getConfig();
                setConfig(data);
            } catch (error) {
                console.error("Failed to load config", error);
            }
        };
        loadConfig();
    }, []);


    const [games, setGames] = useState([]);

    useEffect(() => {
        const fetchGames = async () => {
            if (config === null) return;
            const games = await getGames(config.currentEvent, config.currentYear);
             setGames(games);                
         }

        fetchGames();
    }, [config, setGames])


    return (
        <div className="App">
            <div className="games_container">
                <div className="App-header">
                    <NavLink to="/">Home</NavLink>
                </div>
                {config ?
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
                : <div><img  alt="Loading..." src={loader}></img></div>
            }
            </div>
        </div>
    );
};

export default Games;