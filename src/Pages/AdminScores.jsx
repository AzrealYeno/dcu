import './Admin.css';
import { getEventsByYear, getYearsByEvent, getGames, getGamesScores } from "../dataService.js";
import { saveScore } from "../adminDataService.js";
import { useState, useEffect } from 'react';
import { empireIds } from '../constants.js';
import { EditText } from 'react-edit-text';
import 'react-edit-text/dist/index.css';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase.js';
import { useNavigate } from 'react-router-dom';
import { adminUids } from '../admin.js';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { getConfig } from '../configService';
import loader from '../assets/loader.svg';

const AdminScores = () => {
    const [config, setConfig] = useState(null);
    useEffect(() => {
        const loadConfig = async () => {
            try {
                const data = await getConfig();
                setConfig(data);
                setEvent(data.currentEvent);
                setYear(data.currentYear);
            } catch (error) {
                console.error("Failed to load config", error);
            }
        };
        loadConfig();
    }, []);

    const [years, setYears] = useState([]);
    const [year, setYear] = useState(null);

    const [events, setEvents] = useState([]);
    const [event, setEvent] = useState(null);

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
            if (event === null) return;
            const years = await getYearsByEvent(event);
            setYears(years);
        }

        fetchYears();
    }, [event, setYears]);

    useEffect(() => {
        const fetchEvents = async () => {
            if (year === null) return;
            const events = await getEventsByYear(year);
            setEvents(events);
        }
        fetchEvents();
    }, [year, setEvents]);

    useEffect(() => {
        const fetchGames = async () => {
            if (event === null || year === null) return;
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

    const handleSaveScore = (empreId, gameId, value) => {
        saveScore(event, year, empreId, gameId, value);
    };

    return (
        <div className="App">
            {(config && year && event) ?
                <div className="admin-content">
                    <h1>Manage Scores</h1>
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
                    <div className='scores'>
                        <h2>Scores</h2>
                        <Tabs>
                            <TabList>
                                {games.map((game) =>
                                (
                                    <Tab key={game.id}>{game.name}</Tab>
                                ))
                                }
                            </TabList>


                            {games.map((game) =>
                            (
                                <TabPanel key={game.id}>
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
                                </TabPanel>
                            ))
                            }
                        </Tabs>
                    </div>
                </div>
                : <div><img alt="Loading..." src={loader}></img></div>
            }
        </div>

    );
};

export default AdminScores;