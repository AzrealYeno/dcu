import './Admin.css';
import { appConfig } from "../config";
import { getEventsByYear, getYearsByEvent, getAwardByEmpire, getGames, getGamesScores } from "../dataService";
import { saveAward, saveScore } from "../adminDataService";
import { useState, useEffect } from 'react';
import { empireIds } from '../constants';
import { EditTextarea, EditText } from 'react-edit-text';
import 'react-edit-text/dist/index.css';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { adminUids } from '../admin.js';
import MDEditor from "@uiw/react-md-editor";

const AdminResults = () => {
    const [years, setYears] = useState([]);
    const [year, setYear] = useState(appConfig.currentYear);

    const [events, setEvents] = useState([]);
    const [event, setEvent] = useState(appConfig.currentEvent);

    const [awards, setAwards] = useState([]);
    const [games, setGames] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const uid = user.uid;
                if (adminUids.includes(uid)) {
                    return;
                }
            }
            navigate('/signin');
        });
    }, [navigate])

    useEffect(() => {
        const fetchYears = async () => {
            const years = await getYearsByEvent(event);
            setYears(years);
        }

        fetchYears();
    }, [event, setYears]);

    useEffect(() => {
        const fetchEvents = async () => {
            const events = await getEventsByYear(year);
            setEvents(events);
        }
        fetchEvents();
    }, [year, setEvents]);

    useEffect(() => {
        const fetchAwards = async () => {
            const awards = [];
            for (let index = 0; index < empireIds.length; index++) {
                const empireId = empireIds[index];
                const empireAward = await getAwardByEmpire(event, year, empireId);
                awards.push(empireAward);
            }

            setAwards(awards);

        }
        fetchAwards();
    }, [year, event, setAwards]);

    useEffect(() => {
        const fetchGames = async () => {
            const games = await getGames(event, year);
            for (let index = 0; index < games.length; index++) {
                const game = games[index];
                const scores = await getGamesScores(event, year, game.id);

                //reformat the array
                const newScores = [];
                for (let index = 0; index < scores.length; index++) {
                    const score = scores[index];
                    newScores[score.id] = score.score;
                }
                //console.log("newscores",newScores);

                game.scores = [];
                for (let j = 0; j < empireIds.length; j++) {
                    const empireId = empireIds[j];
                    const score = newScores[empireId] || 0;
                    //console.log("score", score);
                    game.scores.push({ empireId: empireId, score: score });
                }
                //console.log("game.scores",game.scores);
            }
            setGames(games);
        }

        fetchGames();
    }, [year, event, setGames]);

    const handleChangeYear = (e) => {
        setYear(e.target.value);
    };

    const handleChangeEvent = (e) => {
        setEvent(e.target.value);
    };

    const handleSaveAward = (empreId, index) => {
        const value = awards[index].award;
        saveAward(event, year, empreId, value);
    };

    const handleChangeAward = (index, value) => {
        awards[index].award = value;
        setAwards([...awards]);
    };

    const handleSaveScore = (empreId, gameId, value) => {
        saveScore(event, year, empreId, gameId, value);
    };

    return (
        <div className="App">
            <div className="admin-content">
                <h1>Admin for Results</h1>
                <label>
                    Years:
                    <select value={year} onChange={handleChangeYear}>
                        {years.map((year) => (
                            <option key={year.year} value={year.year}>{year.year}</option>
                        ))}
                    </select>
                </label>

                <label>
                    Events:
                    <select value={event} onChange={handleChangeEvent}>
                        {events.map((evnt) => (
                            <option key={evnt.id} value={evnt.id}>{evnt.name}</option>
                        ))}
                    </select>
                </label>
                <div className='awards'>
                    <h2>AWARDS</h2>
                    {awards.map((evnt, index) =>
                    (
                        <div key={evnt.empireId}>
                            <h3>{evnt.empireId}</h3>
                            <div className="container">
                                <MDEditor value={evnt.award}
                                    onChange={(value) => handleChangeAward(index, value)} />
                                <button onClick={() => handleSaveAward(evnt.empireId, index)}>
                                    Save
                                </button>
                            </div>
                        </div>
                    ))
                    }
                </div>
                <div className='scores'>
                    <h2>SCORES</h2>
                    {games.map((game) =>
                    (
                        <div key={game.id}>
                            <h3>{game.name}</h3>
                            {game.scores.map((score) =>
                            (
                                <div key={score.empireId} className='scoreLabel'>
                                    {score.empireId}
                                    <EditText
                                        style={{
                                            width: '50px',
                                            padding: '10px',
                                            border: '1px solid #2E8B57',
                                            borderRadius: '5px',
                                            fontSize: '20px',
                                            backgroundColor: '#f9f9f9',
                                        }}
                                        type="number"
                                        defaultValue={score.score.toString()}
                                        onSave={({ value }) => handleSaveScore(score.empireId, game.id, value)}
                                    ></EditText>
                                </div>
                            ))
                            }
                        </div>
                    ))
                    }
                </div>
            </div>
        </div>
    );
};

export default AdminResults;