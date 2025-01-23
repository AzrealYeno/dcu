import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { streamGameMatches, getGame } from '../dataService';
import { empires, matchIds } from '../constants';
import { Ename_img } from '../constants';
import gameScores_leaderboard from "../assets/scores_Leaderboard.png";
import bgNeutral from '../assets/background.png';
import './TournamentScores.css';
import { getConfig } from '../configService';
import loader from '../assets/loader.svg';
// import Navbar from "../Navbar";

const TournamentScores = () => {
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
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    // const [winner, setWinner] = useState({
    //     id: "",
    //     name: "",
    //     backgroundImage: bgNeutral,
    // });
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
            const fetchMatches = async () => {
                if (config === null) return;
                const unsubscribe = streamGameMatches(config.currentEvent, config.currentYear, gameid,
                    (querySnapshot) => {
                        const matches = querySnapshot.docs
                            .map((docSnapshot) =>
                                ({ ...docSnapshot.data(), id: docSnapshot.id })
                            );
                        for (let index = 0; index < matchIds.length; index++) {
                            const matchId = matchIds[index];
                            const match = matches.find(match => match.id === matchId);
                            if (!match) {
                                matches.push({ id: matchId, team1: "", team2: "", scoreteam1: 0, scoreteam2: 0 });
                            }
                        }
                        console.log('matches',matches);
                        matches.sort((a, b) => a.id - b.id);
    
                        const newMatches = [];
                        for (let index = 0; index < matches.length; index++) {
                            const match = matches[index];
                            newMatches[match.id] = match;
                        }
                        console.log('matches',newMatches);
                        setMatches(newMatches);
                        setLoading(false);
    
                        //const rankedScores = sortRanks(newScores);
                        //console.log('rankedScores',rankedScores);
                        //setRanks(rankedScores);
                        //const champion = getWinner(rankedScores);
                        //setWinner(champion);
    
                    }
                );
                return unsubscribe;
            }
    
            fetchMatches();
        }, [config, gameid, setMatches])

    var divStyle = {
        //backgroundImage: 'url(' + winner.backgroundImage + ')',
    };

    return (

        <div className="App">
            {/* <Navbar /> */}
            <div className="games_container" >
                {config && !loading ?
                    <div className="gamescores_content" style={divStyle}>
                        <div className='topSpacer' />


                        <div class="theme theme-dark">
                            <div class="bracket disable-image">
                                <div class="column one">
                                    <div class="match winner-top">
                                        <div class="match-top team">
                                            <span class="image">
                                                <img className='empirename_img' src={empires[matches["round1game1"].team1].nameImage} alt={empires[matches["round1game1"].team1].name} />
                                            </span>
                                            <span class="name">{empires[matches["round1game1"].team1].name}</span>
                                            <span class="score">{matches["round1game1"].scoreteam1}</span>
                                        </div>
                                        <div class="match-bottom team">
                                            <span class="image"></span>
                                            <span class="name">{empires[matches["round1game1"].team2].name}</span>
                                            <span class="score">{matches["round1game1"].scoreteam2}</span>
                                        </div>
                                        <div class="match-lines">
                                            <div class="line one"></div>
                                            <div class="line two"></div>
                                        </div>
                                        <div class="match-lines alt">
                                            <div class="line one"></div>
                                        </div>
                                    </div>
                                    <div class="match winner-bottom" id="col1">
                                        <div class="match-top team">
                                            <span class="image"></span>
                                            <span class="name">{empires[matches["round1game2"].team1].name}</span>
                                            <span class="score">{matches["round1game2"].scoreteam1}</span>
                                        </div>
                                        <div class="match-bottom team">
                                            <span class="image"></span>
                                            <span class="name">{empires[matches["round1game2"].team2].name}</span>
                                            <span class="score">{matches["round1game2"].scoreteam2}</span>
                                        </div>
                                        <div class="match-lines">
                                            <div class="line one"></div>
                                            <div class="line two"></div>
                                        </div>
                                        <div class="match-lines alt">
                                            <div class="line one"></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="column two">
                                    <div class="match winner-bottom" id="col2">
                                        <div class="match-top team">
                                            <span class="image"></span>
                                            <span class="seed">1</span>
                                            <span class="name">Orlando Jetsetters</span>
                                            <span class="score">1</span>
                                        </div>
                                        <div class="match-bottom team">
                                            <span class="image"></span>
                                            <span class="seed">5</span>
                                            <span class="name">West Virginia Runners</span>
                                            <span class="score">2</span>
                                        </div>
                                        <div class="match-lines">
                                            <div class="line one"></div>
                                            <div class="line two"></div>
                                        </div>
                                        <div class="match-lines alt">
                                            <div class="line one"></div>
                                        </div>
                                    </div>
                                    <div class="match winner-bottom">
                                        <div class="match-top team">
                                            <span class="image"></span>
                                            <span class="seed">2</span>
                                            <span class="name">Denver Demon Horses</span>
                                            <span class="score">1</span>
                                        </div>
                                        <div class="match-bottom team">
                                            <span class="image"></span>
                                            <span class="seed">3</span>
                                            <span class="name">San Francisco Porters</span>
                                            <span class="score">2</span>
                                        </div>
                                        <div class="match-lines">
                                            <div class="line one"></div>
                                            <div class="line two"></div>
                                        </div>
                                        <div class="match-lines alt">
                                            <div class="line one"></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="column three" id="col3">
                                    <div class="match winner-top">
                                        <div class="match-top team">
                                            <span class="image"></span>
                                            <span class="seed">5</span>
                                            <span class="name">West Virginia Runners</span>
                                            <span class="score">3</span>
                                        </div>
                                        <div class="match-bottom team">
                                            <span class="image"></span>
                                            <span class="seed">3</span>
                                            <span class="name">San Francisco Porters</span>
                                            <span class="score">2</span>
                                        </div>
                                        <div class="match-lines">
                                            <div class="line one"></div>
                                            <div class="line two"></div>
                                        </div>
                                        <div class="match-lines alt">
                                            <div class="line one"></div>
                                        </div>
                                    </div>

                                    <div class="match winner-top">
                                        <div class="match-top team">
                                            <span class="image"></span>
                                            <span class="seed">5</span>
                                            <span class="name">West Virginia Runners</span>
                                            <span class="score">3</span>
                                        </div>
                                        <div class="match-bottom team">
                                            <span class="image"></span>
                                            <span class="seed">3</span>
                                            <span class="name">San Francisco Porters</span>
                                            <span class="score">2</span>
                                        </div>
                                        <div class="match-lines">
                                            <div class="line one"></div>
                                            <div class="line two"></div>
                                        </div>
                                        <div class="match-lines alt">
                                            <div class="line one"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        
                        <div className='gamescores_box_footer' ></div>

                    </div>

                    : <div><img alt="Loading..." src={loader}></img></div>
                }

            </div>
        </div>
    );



};

export default TournamentScores;