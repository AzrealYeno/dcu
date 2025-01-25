import './Admin.css';
import { getEvent, getEventsByYear, getYearsByEvent, getGames } from "../dataService.js";
import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { EditText } from 'react-edit-text';
import { saveGameDetail, deleteGame, saveEventDetail } from "../adminDataService.js";
import 'react-edit-text/dist/index.css';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase.js';
import { useNavigate } from 'react-router-dom';
import MDEditor from "@uiw/react-md-editor";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { getConfig } from '../configService';
import loader from '../assets/loader.svg';


const AdminGames = () => {
    const [config, setConfig] = useState(null);
    useEffect(() => {
        const loadConfig = async () => {
            try {
                const data = await getConfig();
                setConfig(data);
                setEvent(data.currentEvent);
                setYear(data.currentYear);
                setEventDetail({ name: "", year: data.currentYear, eventId: data.currentEvent });
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

    const [eventDetail, setEventDetail] = useState(null);

    const [games, setGames] = useState([]);

    const [newGameName, setNewGameName] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        if(config === null) return;
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const uid = user.uid;
                if(config.adminsList && config.adminsList.includes(uid)) {
                    return;
                }
            }
            navigate('/admin');
        });
    }, [config, navigate])


    const fetchYears = useCallback(async () => {
        if (event === null) return;
        const years = await getYearsByEvent(event);
        setYears(years);
    }, [event, setYears]);

    useEffect(() => {
        fetchYears();
    }, [event, fetchYears]);

    const fetchEvents = useCallback(async () => {
        if (year === null) return;
        const events = await getEventsByYear(year);
        setEvents(events);
    }, [year, setEvents]);

    useEffect(() => {
        fetchEvents();
    }, [year, fetchEvents]);

    const fetchEventDetail = useCallback(async () => {
        if (year === null || event === null) return;
        const eventDetail = await getEvent(event, year);
        setEventDetail(eventDetail);
    }, [event, year, setEventDetail]);

    useEffect(() => {
        fetchEventDetail();
    }, [year, event, fetchEventDetail]);

    const fetchGames = useCallback(async () => {
        if (event === null || year === null) return;
        const games = await getGames(event, year);
        games.sort((a, b) => a.name.localeCompare(b.name));
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

    
    const handleChangeGameType = (gameId, index, e) => {
        games[index].gametype = e.target.value;
        setGames([...games]);
        saveGameDetail
            (event, year, gameId, { gametype:  e.target.value });
    }

    const handleChangeGameTag = (gameId, index, e) => {
        games[index].gametype = e.target.value;
        setGames([...games]);
        saveGameDetail
            (event, year, gameId, { tag:  e.target.value });
    }

    const handleChangeGameClass = (gameId, index, e) => {
        games[index].gametype = e.target.value;
        setGames([...games]);
        saveGameDetail
            (event, year, gameId, { class:  e.target.value });
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
            (event, year, gameId, { name: newGameName , gametype: "leaderboard", tag:""});
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
            {(config && year && event) ?
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
                                    border: '1px solid white',
                                        borderRadius: '5px',
                                        fontSize: '20px',
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
                                                    border: '1px solid white',
                                        borderRadius: '5px',
                                        fontSize: '20px',
                                                }}
                                            ></EditText>
                                        </label>
                                        <label>Game Type
                                        
                                        <select  value={game.gametype} onChange={(e) => handleChangeGameType(game.id,index, e)}>
                                            <option key="leaderboard" value="leaderboard">leaderboard</option>
                                            <option key="straight" value="tournament">tournament</option>
                                                
                                        </select>
                                        </label>
                                        <br/>
                                        <label>Game class
                                        
                                        <select  value={game.class} onChange={(e) => handleChangeGameClass(game.id,index, e)}>
                                            <option key="blank" value=""></option>
                                            <option key="volleyball" value="volleyball">volleyball</option>
                                            <option key="basketball" value="basketball">basketball</option>
                                            <option key="badminton" value="badminton">badminton</option>
                                            <option key="botb" value="botb">botb</option>
                                            <option key="mrandmisspisay" value="mrandmisspisay">mrandmisspisay</option>
                                            <option key="trackandfield" value="trackandfield">trackandfield</option>
                                            <option key="litmus" value="litmus">litmus</option>
                                            <option key="tabletennis" value="tabletennis">tabletennis</option>
                                            <option key="chess" value="chess">chess</option>
                                                
                                        </select>
                                        </label>
                                        <br />
                                        <label>Game tag
                                        
                                        <select  value={game.tag} onChange={(e) => handleChangeGameTag(game.id,index, e)}>
                                            <option key="blank" value=""></option>
                                            <option key="men" value="men">men</option>
                                            <option key="women" value="women">women</option>
                                            <option key="mixed" value="mixed">mixed</option>
                                                
                                        </select>
                                        </label>
                                        <br />
                                        <label>Game Info
                                            <MDEditor value={game.info}
                                                onChange={(value) => handleChangeGameInfo(index, value)} />
                                        </label>
                                        <br />
                                        <button onClick={() => handleSaveGameInfo(game.id, index)}>
                                            Save Game Info
                                        </button>
                                        &nbsp;
                                        <button onClick={() => handleDeleteGame(game.id)}>
                                            Delete this Game
                                        </button>
                                    </div>
                                    <br /><br />
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
                                                border: '1px solid white',
                                        borderRadius: '5px',
                                        fontSize: '20px',
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
                : <div><img alt="Loading..." src={loader}></img></div>
            }
        </div>
    );
};

export default AdminGames;