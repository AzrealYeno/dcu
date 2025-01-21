
import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { streamScores, sortRanks, getGame } from '../dataService';
import { medal_img } from '../constants';
import { Ename_img } from '../constants';
import gameScores_leaderboard from "../assets/scores_Leaderboard.png";
import bgNeutral from '../assets/background.png';
import './GameScores.css';
import { getConfig } from '../configService';
import loader from '../assets/loader.svg';
import Navbar from "../Navbar";

const GameScores = () => {
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
            if (config === null) return;
            await getGame(config.currentEvent, config.currentYear, gameid).then((data) => {
                setGame(data);
            });
        }
        fetchGame();
    }, [config, gameid, setGame])

    useEffect(() => {
        const fetchScores = async () => {
            if (config === null) return;
            const unsubscribe = streamScores(config.currentEvent, config.currentYear, gameid,
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
    }, [config, gameid, setRanks, setWinner])

    var divStyle = {
        backgroundImage: 'url(' + winner.backgroundImage + ')',
    };

    return (

        <div className="App">
            <Navbar />
            <div className="games_container" >
                {config ?
                    <div className="gamescores_content" style={divStyle}>
                        <div className='topSpacer' />
                        {/* <div className='gamescores_box_preheader' ></div> */}
                        {/* <div className='gamescores_box_header' >
                            <div className="game_name">{game.name}</div>
                        </div> */}

                        <div class="tournament">
                            <div class="column">
                                <div class="team">
                                    <h1>Team 1</h1>
                                    <h1>20</h1>
                                </div>
                                <div class="team">
                                    <h1>Team 2</h1>
                                    <h1>20</h1>
                                </div>
                                <div class="team">
                                    <h1>Team 3</h1>
                                    <h1>20</h1>
                                </div>
                                <div class="team">
                                    <h1>Team 4</h1>
                                    <h1>20</h1>
                                </div>
                            </div>
                            <div class="column">
                                <div class="match">
                                    <h1>Team 4</h1>
                                    <h1>20</h1>
                                </div>
                                <div class="match">
                                    <h1>Team 4</h1>
                                    <h1>20</h1>
                                </div>
                            </div>
                            <div class="column">
                                <div class="match final">Final Match</div>
                            </div>
                        </div>

                        {/* {
                            ranks.map(
                                (rank) =>
                                <div key={rank.empireId} className="rank_container">
                                    <div className="medal">
                                        <img src={medal_img[rank.medal]} className="medal_img" alt="medal_img">
                                        </img>
                                    </div>
                                    <div className="Ename">
                                        <img src={Ename_img[rank.empire.name]} className="Ename_img" alt="Ename_img">
                                        </img>
                                    </div>
                                    <div className="Escore">{rank.score + " POINTS"}</div> 
                                </div>
                            )
                        } */}
                        <div className='gamescores_box_footer' ></div>

                    </div>

                    : <div><img alt="Loading..." src={loader}></img></div>
                }

            </div>
        </div>
    );
};

export default GameScores;

