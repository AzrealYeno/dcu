import './Games.css';
import './GameDescriptions.css';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getGames } from '../dataService';
import Markdown from 'react-markdown'
import { getConfig } from '../configService';
import loader from '../assets/loader.svg';
import Navbar from "../Navbar";

const GameDescriptions = () => {

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

    const [expandedIndex, setExpandedIndex] = useState(null);

    const expand = (index) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    return (
        <div className="App">
            <Navbar />
            <div className='topSpacer'></div>
            <div className="games_container">
                {config ?
                    <section className="x games-content" dir="ltr">
                        {
                            games?.map((game, i) => (
                                <div className={`gamecard_container ${expandedIndex === i ? 'expanded' : 'orig'}`} key={i} onClick={() => expand(i)}>
                                    <div className={"gamecard " + game.name}>
                                        <div className='name'>{game.name}</div>
                                        <div className='info'><Markdown>{game.info}</Markdown></div>
                                        <Link className='link' to={game.gametype === 'tournament'  ? `/matches/${game.id}`:  `/games/${game.id}`}>
                                            <div >                                    
                                                     Click for Score       
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            ))
                        }
                    </section>
                    : <div><img alt="Loading..." src={loader}></img></div>
                }
            </div>
        </div>
    );
};

export default GameDescriptions;