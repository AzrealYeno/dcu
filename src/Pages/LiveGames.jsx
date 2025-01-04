import './LiveGame.css';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getLiveGamesWithScores } from '../dataService';
import { getConfig } from '../configService';
import loader from '../assets/loader.svg';
import Navbar from "../Navbar";
import { empires } from '../constants';

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


    const [livegames, setLiveGames] = useState([]);

    useEffect(() => {
        const fetchGames = async () => {
            if (config === null) return;
            const games = await getLiveGamesWithScores();
            console.log(games);
             setLiveGames(games);                
         }

        fetchGames();
    }, [config, setLiveGames])


    return (
        <div className="App">
            <Navbar />
            <div className="games_container">
                {config ?
                <div className="games-content">
                    <div className='topSpacer'></div>
                    {
                        livegames?.map((game, i) => (
                            <div key={i} className="livegamecard">

                                <Link to={`/livegame/${game.id}`}>
                                    <h2 className='game_name'>{game.name}</h2>
                                </Link>
                                {game.scores.map((score, index) =>
                        (
                            <div  key={score.id} className='livegamecardscore'>
                                    <img className='empirename_img' src={empires[score.id].nameImage} alt={score.id} />
                                    <div className={`livescore`}>{score.score}</div> 
                                
                            </div>
                        ))}
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