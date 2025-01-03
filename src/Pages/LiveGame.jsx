
import { useState, useEffect , useCallback } from 'react';
import { useParams } from "react-router-dom";
import { getLiveGame, streamLiveGameScores } from '../dataService';
import { empires } from '../constants';
import './GameScores.css';
import { getConfig } from '../configService';
import loader from '../assets/loader.svg';
import Navbar from "../Navbar";

const LiveGame = () => {
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

    const [game, setGame] = useState([]);
    
    const { gameid } = useParams();

    const [scores, setScores] = useState([]);


    useEffect(() => {
        const fetchGame = async () => {
            if (config === null) return;
            await getLiveGame( gameid).then((data) => {
                setGame(data);
            });
            await fetchLiveGameScores();
        }
        fetchGame();
    }, [config, gameid, setGame])

    const fetchLiveGameScores = useCallback(async () => {
        const unsubscribe = streamLiveGameScores(gameid,
            (querySnapshot) => {
                const scores = querySnapshot.docs
                    .map((docSnapshot) =>
                        ({ ...docSnapshot.data(), id: docSnapshot.id })
                    );
                console.log('scores',scores);
                setScores(scores);


            }
        );
        return unsubscribe;
    }, [setScores]);


   


    return (

        <div className="App">
            <Navbar />
            <div className="games_container" >
                {config ?
                    <div  >
                        <div>{game.name}</div>
                        <div key="games_scores">
                        {scores.map((score) =>
                        (
                            <div key={score.id}> 
                                
                                <img height="100px" src={empires[score.id].nameImage} alt={score.id} />
                                {score.score}
                            </div>
                        ))}
                    </div>
                    </div>

                    : <div><img alt="Loading..." src={loader}></img></div>
                }

            </div>
        </div>
    );
};

export default LiveGame;

