import './Games.css';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getGames } from '../dataService';
import Markdown from 'react-markdown'
import { getConfig } from '../configService';
import loader from '../assets/loader.svg';
import Navbar from "../Navbar";

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
            
            <div className="background_image"></div>
            <div className="games_container">
            <Navbar />
                {config ?
                <div className="games-content">
                    {
                        games?.map((game, i) => (
                            <div key={i} className="gamecard">

                                <Link to={`/games/${game.id}`}>
                                    <h2>{game.name}</h2>
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