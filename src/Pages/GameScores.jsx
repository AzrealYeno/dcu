
import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { empireBackgrounds } from '../constants';
import { streamGame, sortRanks } from '../gameService';

import './GameScores.css';

const GameScores = () => {
    const [game, setGame] = useState([]);
    const [ranks, setRanks] = useState([]);
    const [winner, setWinner] = useState("");
    const { gameid } = useParams();


    useEffect(() => {
        const fetchGame = async () => {

            const unsubscribe = streamGame(gameid,
                (snapshot) => {
                    const data = snapshot.exists() ? snapshot.data() : null;
                    setGame(data);
                    const rankings =sortRanks(data.ranking);
                    setRanks(rankings);                    
                    setWinner(rankings[0].empireId);
                    
                }
            );
            return unsubscribe;
        }

        fetchGame();
    }, [gameid, setGame ,setRanks, setWinner])

    var divStyle = {
        backgroundImage: 'url('+empireBackgrounds[winner]+')',
        backgroundSize: "cover"
    };

    return (
        
        <div className="App">
            <div className="gameScores"  style={divStyle} >
                <div className="game-content">

                    <div>{game.name}</div>
                    <div>{game.info}</div>
                    {
                        ranks.map((empire) => <li key={empire.empireId}>{empire.empireId} {empire.score}</li>)
                    }

                </div>
            </div>
        </div>
    );
};

export default GameScores;