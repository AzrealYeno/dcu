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
                        } else {
                            if (!match.team1) {
                                match.team1 = "";
                                match.scoreteam1 = 0;
                            }
                            if (!match.team2) {
                                match.team2 = "";
                                match.scoreteam2 = 0;
                            }
                        }

                    }
                    console.log('matches', matches);
                    matches.sort((a, b) => a.id - b.id);

                    const newMatches = [];
                    for (let index = 0; index < matches.length; index++) {
                        const match = matches[index];
                        newMatches[match.id] = match;
                    }
                    console.log('matches', newMatches);
                    setMatches(newMatches);


                    //const rankedScores = sortRanks(newScores);
                    //console.log('rankedScores',rankedScores);
                    //setRanks(rankedScores);
                    //const champion = getWinner(rankedScores);
                    //setWinner(champion);
                    if (newMatches["champion"].team1) {
                        var winner = {
                            id: newMatches["champion"].team1,
                            name: empires[newMatches["champion"].team1].name,
                            backgroundImage: empires[newMatches["champion"].team1].backgroundImage,
                        };
                        setWinner(winner);
                    }

                    setLoading(false);

                }
            );
            return unsubscribe;
        }

        fetchMatches();
    }, [config, gameid, setMatches])

    var divStyle = {
        backgroundImage: 'url(' + winner.backgroundImage + ')',
    };

    const getMatchWinner = (match) => {
        if ((match.scoreteam1 ?? 0) > (match.scoreteam2 ?? 0)) {
            return "winner-top";
        } else if ((match.scoreteam1 ?? 0) < (match.scoreteam2 ?? 0)) {
            return "winner-bottom";
        } else {
            return "";
        }
    };


    return (

        <div className="App">
            {/* <Navbar /> */}
            <div className="games_container" >
                {config && !loading ?
                    <div className="gamescores_content" style={divStyle}>

                        <div className="game_name_tournament">{game.name}</div>


                        <div className="theme theme-dark">
                            <div className="bracket ">
                                <div className="column one">
                                    <div className={"match " + getMatchWinner(matches["round1game1"])} id="col1">
                                        <div className="match-top team">
                                        {matches["round1game1"].team1 &&
                                            <><span className="image">
                                                    <img className='tour_empirename_img' src={empires[matches["round1game1"].team1].nameImage} alt={empires[matches["round1game1"].team1].name} />
                                                </span><span className="score">{matches["round1game1"].scoreteam1 ?? 0}</span></>
                                        }
                                        </div>
                                        <div className="match-bottom team">
                                        {matches["round1game1"].team2 &&
                                            <><span className="image">
                                                    <img className='tour_empirename_img' src={empires[matches["round1game1"].team2].nameImage} alt={empires[matches["round1game1"].team2].name} />
                                                </span><span className="score">{matches["round1game1"].scoreteam2 ?? 0}</span></>
                                        }
                                        </div>

                                    </div>
                                    <div className={"match " + getMatchWinner(matches["round1game2"])} >
                                        <div className="match-top team">
                                        {matches["round1game2"].team1 &&
                                            <><span className="image">
                                                    <img className='tour_empirename_img' src={empires[matches["round1game2"].team1].nameImage} alt={empires[matches["round1game2"].team1].name} />
                                                </span><span className="score">{matches["round1game2"].scoreteam1 ?? 0}</span></>
                                        }
                                        </div>
                                        <div className="match-bottom team">
                                        {matches["round1game2"].team2 &&
                                            <><span className="image">
                                                    <img className='tour_empirename_img' src={empires[matches["round1game2"].team2].nameImage} alt={empires[matches["round1game2"].team2].name} />
                                                </span><span className="score">{matches["round1game2"].scoreteam2 ?? 0}</span></>
                                        }
                                        </div>

                                    </div>
                                </div>
                                <div className="column two">
                                    <div className={"match " + getMatchWinner(matches["round2game1"])} >
                                        <div className="match-top team">
                                        {matches["round2game1"].team1 &&
                                                <><span className="image">
                                                <img className='tour_empirename_img' src={empires[matches["round2game1"].team1].nameImage} alt={empires[matches["round2game1"].team1].name} />
                                            </span>
                                            <span className="score">{matches["round2game1"].scoreteam1 ?? 0}</span></>
                                        }
                                        </div>
                                        <div className="match-bottom team">
                                            {matches["round2game1"].team2 &&
                                                <><span className="image">
                                                    <img className='tour_empirename_img' src={empires[matches["round2game1"].team2].nameImage} alt={empires[matches["round2game1"].team2].name} />
                                                </span><span className="score">{matches["round2game1"].scoreteam2 ?? 0}</span></>
                                            }
                                        </div>


                                    </div>
                                    <div className={"match " + getMatchWinner(matches["round2game2"])} >
                                        <div className="match-top team">
                                            {matches["round2game2"].team1 &&
                                                <><span className="image">
                                                    <img className='tour_empirename_img' src={empires[matches["round2game2"].team1].nameImage} alt={empires[matches["round2game2"].team1].name} />
                                                </span><span className="score">{matches["round2game2"].scoreteam1 ?? 0}</span></>
                                            }
                                        </div>
                                        <div className="match-bottom team">
                                            {matches["round2game2"].team2 &&
                                                <><span className="image">
                                                    <img className='tour_empirename_img' src={empires[matches["round2game2"].team2].nameImage} alt={empires[matches["round2game2"].team2].name} />
                                                </span><span className="score">{matches["round2game2"].scoreteam2 ?? 0}</span></>
                                            }
                                        </div>

                                    </div>
                                </div>
                                <div className="column three" >
                                    <div className="match winner-top">
                                        <div className="match-top team">
                                            {matches["champion"].team1 &&
                                                <span className="image">
                                                    <img className='tour_empirename_img' src={empires[matches["champion"].team1].nameImage} alt={empires[matches["champion"].team1].name} />
                                                </span>
                                            }
                                        </div>

                                    </div>


                                </div>
                            </div>
                        </div>




                    </div>

                    : <div><img alt="Loading..." src={loader}></img></div>
                }

            </div>
        </div>
    );



};

export default TournamentScores;