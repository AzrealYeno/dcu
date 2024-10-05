import './Admin.css';
import { appConfig } from "../config.js";
import { getEvent, getEventsByYear, getYearsByEvent, getGames } from "../dataService.js";
import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { EditText } from 'react-edit-text';
import { saveGameDetail, deleteGame, saveEventDetail } from "../adminDataService.js";
import 'react-edit-text/dist/index.css';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase.js';
import { useNavigate } from 'react-router-dom';
import { adminUids } from '../admin.js';
import MDEditor from "@uiw/react-md-editor";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

const AdminGames = () => {
    const [years, setYears] = useState([]);
    const [year, setYear] = useState(appConfig.currentYear);

    const [events, setEvents] = useState([]);
    const [event, setEvent] = useState(appConfig.currentEvent);

    const [eventDetail, setEventDetail] = useState({ name: "", year: appConfig.currentYear, eventId: appConfig.currentEvent });
    const [games, setGames] = useState([]);

    const [newGameName, setNewGameName] = useState("");    

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


    const fetchYears = useCallback(async () => {
        const years = await getYearsByEvent(event);
        setYears(years);
    }, [event, setYears]);

    useEffect(() => {
        fetchYears();
    }, [event, fetchYears]);

    const fetchEvents = useCallback(async () => {
        const events = await getEventsByYear(year);
        setEvents(events);
    }, [year, setEvents]);

    useEffect(() => {
        fetchEvents();
    }, [year, fetchEvents]);

    const fetchEventDetail = useCallback(async () => {
        const eventDetail = await getEvent(event, year);
        setEventDetail(eventDetail);
    }, [event, year, setEventDetail]);

    useEffect(() => {
        fetchEventDetail();
    }, [year, event, fetchEventDetail]);

    const fetchGames = useCallback(async () => {
        const games = await getGames(event, year);
        setGames(games);
    }, [event, year, setGames]);


    useEffect(() => {
        fetchGames();
    }, [year, event, setGames, fetchGames]);



    const handleChangeYear = (e) => {
        setYear(e.target.value);
    };

    const handleChangeEvent = (e) => {
        setEvent(e.target.value);
    };

    const handleSaveGameName = async (gameId, value) => {
        await saveGameDetail(event, year, gameId, { name: value });
        fetchEventDetail();
    }

    const handleChangeGameInfo = (index, value) => {
        games[index].info = value;
        setGames([...games]);
    }

    const handleSaveGameInfo = (gameId, index) => {
        const value = games[index].info;
        saveGameDetail
            (event, year, gameId, { info: value });
    }

    const handleDeleteGame = async (gameId) => {
        await deleteGame(event, year, gameId);
        fetchGames();
    }

    const handleNewGameNameChange = (e) => {
        setNewGameName(e.target.value);
    };

    const handleClickSaveNewGame = () => {
        const gameId = uuidv4();
        saveGameDetail
            (event, year, gameId, { name: newGameName });
        setNewGameName("");
        fetchGames();
    }

    
    const handleSaveEventName = (value) => {
        eventDetail.name = value;
        setEventDetail(eventDetail);
        saveEventDetail(event, year, eventDetail);
    };

    return (
        <div className="App">
            <div className="admin-content">
                <h3>Manage Games</h3>
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

                <hr />
                <div className='event'>
                    <label>Event Name
                        <EditText
                            type="text"
                            defaultValue={eventDetail.name}
                            onSave={({ value }) => handleSaveEventName(value)}
                            style={{
                                width: '80%',
                                padding: '10px',
                                border: '1px solid #2E8B57',
                                borderRadius: '5px',
                                fontSize: '20px',
                                backgroundColor: '#f9f9f9',
                            }}
                        ></EditText>
                    </label>
                </div>
                <hr />

                <div className='games'>
                    <h3>GAMES</h3>
                    <Tabs>
                        <TabList>
                            {games.map((game, index) =>
                            (
                                <Tab key={game.id}>{game.name}</Tab>
                            ))}
                            <Tab>Add Game</Tab>
                        </TabList>

                        {games.map((game, index) =>
                        (
                            <TabPanel key={game.id}>
                                <div key={game.id}>
                                    <label>Game Name
                                        <EditText
                                            type="text"
                                            defaultValue={game.name}
                                            onSave={({ value }) => handleSaveGameName(game.id, value)}
                                            style={{
                                                width: '80%',
                                                padding: '10px',
                                                border: '1px solid #2E8B57',
                                                borderRadius: '5px',
                                                fontSize: '20px',
                                                backgroundColor: '#f9f9f9',
                                            }}
                                        ></EditText>
                                    </label>
                                    <label>Game Info
                                        <MDEditor value={game.info}
                                            onChange={(value) => handleChangeGameInfo(index, value)} />
                                    </label>
                                    <br/>
                                    <button onClick={() => handleSaveGameInfo(game.id, index)}>
                                        Save Game Info
                                    </button>
                                    &nbsp;
                                    <button onClick={() => handleDeleteGame(game.id)}>
                                        Delete this Game
                                    </button>
                                </div>
                                <br/><br/>
                            </TabPanel>
                        ))

                        }
                        <TabPanel>
                            <h4>ADD NEW GAME TO {eventDetail.name} {eventDetail.year}</h4>

                            <div key={"new_game"}>
                                <label>Game Name
                                    <EditText
                                        type="text"
                                        value={newGameName}
                                        onChange={(e) => handleNewGameNameChange(e)}
                                        style={{
                                            width: '80%',
                                            padding: '10px',
                                            border: '1px solid #2E8B57',
                                            borderRadius: '5px',
                                            fontSize: '20px',
                                            backgroundColor: '#f9f9f9',
                                        }}
                                    ></EditText>
                                </label>
                                <button onClick={handleClickSaveNewGame}>
                                    Save New Game
                                </button>
                            </div>
                        </TabPanel>


                    </Tabs>







                </div>
            </div>
        </div>
    );
};

export default AdminGames;