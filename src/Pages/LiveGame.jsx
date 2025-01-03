
import { useState, useEffect , useCallback } from 'react';
import { useParams } from "react-router-dom";
import { getLiveGame, streamLiveGameScores } from '../dataService';
import { empires } from '../constants';
import './LiveGame.css';
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
    const [winner, setWinner] = useState("");


    const getWinner = (_scores) => {
        var win;
        var sortedList = [..._scores];
        sortedList.sort((a, b) => b.score - a.score);
        sortedList.length > 0 ? win = sortedList[0].id : win = "";
        return win;
    }

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
                setScores(scores);
                setWinner(getWinner(scores));
                
            }
        );
        return unsubscribe;
    }, [setScores]);


   


    return (

        <div className="App">
            <Navbar />
            <div className="games_container" >
                {config ?
                    <div  className='livegamescores_content'>
                        <div className='topSpacer' />
                        <div className='game_name' >{game.name}</div>
                        <div key="games_scores" className='games_score_container'>
                        {scores.map((score) =>
                        (
                            <div  key={score.id} className={`${score.id == winner ? "boxwinner" : ""}`}>
                                <div key={score.id} className={`livegamescore_${score.id}`}> 
                                    <img className='empirename_img' src={empires[score.id].nameImage} alt={score.id} />
                                    <div className="livescore">{score.score}</div> 
                                </div>
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

