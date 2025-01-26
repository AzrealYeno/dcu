
import { useState, useEffect , useCallback } from 'react';
import { useParams } from "react-router-dom";
import { getLiveGame, streamLiveGameScores } from '../dataService';
import { empires } from '../constants';
import './LiveGame.css';
import { getConfig } from '../configService';
import loader from '../assets/loader.svg';

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
    const [updatedscores, setUpdatedScores] = useState([]);


    const getWinner = (_scores) => {
        var win;
        //var sortedList = [..._scores];
        //sortedList.sort((a, b) => b.score - a.score);
        _scores.length > 0 ? win = _scores[0].id : win = "";
        return win;
    }

    const fetchLiveGameScores = useCallback(async () => {
        const unsubscribe = streamLiveGameScores(gameid,
            (querySnapshot) => {
                var scores = querySnapshot.docs
                    .map((docSnapshot) =>
                        ({ ...docSnapshot.data(), id: docSnapshot.id })
                    );

                    const updated = querySnapshot.docChanges().map((change) => {
                        return change.doc.id;
                    });
                
                scores.sort((a, b) => b.score - a.score);
                setScores(scores);
                setUpdatedScores(updated);
                setWinner(getWinner(scores));
                
            }
        );
        return unsubscribe;
    }, [gameid,setScores]);

    useEffect(() => {
        const fetchGame = async () => {
            if (config === null) return;
            await getLiveGame(gameid).then((data) => {
                setGame(data);
            });
            await fetchLiveGameScores();
        }
        fetchGame();
    }, [config, gameid, setGame, fetchLiveGameScores])


    return (

        <div className="App">
            {/* <Navbar /> */}
            <div className="games_container" >
                {config ?
                    <div  className='livegamescores_content'>
                        <div className='topSpacer' />
                        <div className='game_name' >{game.name}</div>
                        <div key="games_scores" className='games_score_container'>
                        {scores.map((score, index) =>
                        (
                            <div  key={score.id} className={`empire_container ${score.id === winner ? "boxwinner" : ""}  ${ (scores.length > 2) ? "four": "two"}`}>
                                <div key={score.id} className={`livegamescore`}> 
                                    
                                    <img className='empirename_img' src={empires[score.id].nameImage} alt={score.id} />
                                    
                                    <div className={`livescore ${updatedscores.includes(score.id)? "updatedscore": ""}`}>
                                        <span class="score">{score.score}</span>
                                    </div> 
                                    <div className={`background livegamescore_${score.id}_background ${index <  (scores.length / 2) ? "": "background_flip"}`}></div>
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

