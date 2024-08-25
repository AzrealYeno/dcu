
import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { streamScores, sortRanks , getGame} from '../dataService';

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
            await getGame(gameid).then((data) => {
                setGame(data);
            });
        }
        fetchGame();
    }, [gameid, setGame])

    useEffect(() => {
        const fetchScores = async () => {

            const unsubscribe = streamScores(gameid,
                (querySnapshot) => {
                    const scores = querySnapshot.docs
                        .map((docSnapshot) => 
                            ({...docSnapshot.data(), id:docSnapshot.id })
                        ) ;
                        //console.log('scores',scores);
                        
                        //moagi lang diri.. kay ambot nganong dili pwede i-deretso array
                        const newScores = [];
                        for (let index = 0; index < scores.length; index++) {
                            const score = scores[index];
                            newScores[score.id] = score.score;
                        }
                        //console.log('newScores',newScores);
                        
                        const rankedScores = sortRanks(newScores);
                        //console.log('rankedScores',rankedScores);
                        setRanks(rankedScores);
                        setWinner(rankedScores[0].empire);

                    }
            );
            return unsubscribe;
        }

        fetchScores();
    }, [gameid, setRanks, setWinner])

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