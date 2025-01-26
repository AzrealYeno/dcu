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
            games.sort((a, b) => a.name.localeCompare(b.name));
             setGames(games);                
         }

        fetchGames();
    }, [config, setGames])


    return (
        <div className="App">
            <Navbar />
            <div className='topSpacer'></div>
            <div className="games_container">
                {config ?
                <section className="x games-content" dir="ltr">                    
                    {
                        games?.map((game, i) => (
                            <div className="gamecard_container">
                                <Link to={game.gametype === 'tournament'  ? `/matches/${game.id}`:  `/games/${game.id}`}>
                                    <div key={i} className={"gamecard " + game.class}>
                                        <div className={"tag " + (game.tag || "blank")}></div>
                                        <div className={"tag " + (game.tag2 || "blank")}></div>
                                    </div>
                                </Link>
                            </div>
                        ))
                    }
                </section>
                : <div><img  alt="Loading..." src={loader}></img></div>
            }
            </div>
        </div>
    );
};

export default Games;