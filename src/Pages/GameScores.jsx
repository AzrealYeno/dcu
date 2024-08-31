
import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { streamScores, sortRanks, getGame } from '../dataService';
import { medal_img } from '../constants';
import { Ename_img } from '../constants';
import bgNeutral from '../assets/background.png';
import './GameScores.css';

const GameScores = () => {
    const [game, setGame] = useState([]);
    const [ranks, setRanks] = useState([]);
    const [winner, setWinner] = useState({
        id: "",
        name: "",
        backgroundImage: bgNeutral,
    });
    const { gameid } = useParams();

    const getWinner = (rankedScores) => {
        var winner = {
            id: "",
            name: "",
            backgroundImage: bgNeutral,
        };
        var winnerScore = 0;
        for (let index = 0; index < rankedScores.length; index++) {
            const element = rankedScores[index];
            if (element.score > 0 && element.score > winnerScore) {
                winner = element.empire;
                winnerScore = element.score;
            }
        }
        return winner;
    }


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
                            ({ ...docSnapshot.data(), id: docSnapshot.id })
                        );
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
                    const champion = getWinner(rankedScores);
                    setWinner(champion);

                }
            );
            return unsubscribe;
        }

        fetchScores();
    }, [gameid, setRanks, setWinner])

    var divStyle = {
        backgroundImage: 'url(' + winner.backgroundImage + ')',
        backgroundSize: "cover"
    };

    return (

        <div className="App">
            <div className="gameScores" style={divStyle}>
                <div className="game-content">

                    <div className="game_Name">{game.name}</div>
                    <div className="game_Info">{game.info}</div>

                    {
                        ranks.map((rank) => <div key={rank.empireId} className="rank_container"> <div className="medal"><img src={medal_img[rank.medal]} className="medal_img" alt="medal_img"></img></div><div className="Ename"><img src={Ename_img[rank.empire.name]} className="Ename_img" alt="Ename_img"></img></div> {rank.score} </div>)
                    }

                </div>
            </div>
        </div>
    );
};

export default GameScores;

// asdasdss