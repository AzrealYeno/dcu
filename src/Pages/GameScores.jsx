
import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { streamGame, sortRanks } from '../dataService';

import './GameScores.css';

const GameScores = () => {
    const [game, setGame] = useState([]);
    const [ranks, setRanks] = useState([]);
    const [winner, setWinner] = useState({id: "",
        name: "",
        backgroundImage: "",});
    const { gameid } = useParams();


    useEffect(() => {
        const fetchGame = async () => {

            const unsubscribe = streamGame(gameid,
                (snapshot) => {
                    const data = snapshot.exists() ? snapshot.data() : null;
                    setGame(data);
                    const rankings = sortRanks(data.ranking);
                    setRanks(rankings);                    
                    setWinner(rankings[0].empire);
                }
            );
            return unsubscribe;
        }

        fetchGame();
    }, [gameid, setGame ,setRanks, setWinner])

    var divStyle = {
        backgroundImage: 'url('+ winner.backgroundImage +')',
        backgroundSize: "cover"
    };

    return (
        
        <div className="App">
            <div className="gameScores"  style={divStyle}>
                <div className="game-content">

                    <div>{game.name}</div>
                    <div>{game.info}</div>
                    {
                        ranks.map((rank) => <li key={rank.empireId}>{rank.empire.name} {rank.score} {rank.medal}</li>)
                    }

                </div>
            </div>
        </div>
    );
};

export default GameScores;