import './Admin.css';
import { appConfig } from "../config";
import { getEvent, getEventsByYear, getYearsByEvent, getGames} from "../dataService";
import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { EditTextarea, EditText } from 'react-edit-text';
import {saveEventDetail, saveGameDetail } from "../adminDataService";
import 'react-edit-text/dist/index.css';

const AdminEvents = () => {
    const [years, setYears] = useState([]); 
    const [year, setYear] = useState(appConfig.currentYear); 

    const [events, setEvents] = useState([]); 
    const [event, setEvent] = useState(appConfig.currentEvent); 

    const [eventDetail, setEventDetail] = useState({name:"", year:appConfig.currentYear , eventId: appConfig.currentEvent}); 
    const [games, setGames] = useState([]);

    const [newGameName, setNewGameName] = useState("");    

    useEffect(()=>{
        const fetchYears = async () => {
            const years = await getYearsByEvent(event);
            setYears(years);                
         }

        fetchYears();
    }, [event, setYears]);

    useEffect(()=>{
        const fetchEvents = async () => {
            const events = await getEventsByYear(year);
            setEvents(events);                
         }
         fetchEvents();
    }, [year, setEvents]);

    useEffect(()=>{
        const fetchEventDetail = async () => {
            const eventDetail = await getEvent(event, year);
            setEventDetail(eventDetail);
         }
         fetchEventDetail();
    }, [year, event, setEventDetail]);

    const fetchGames = useCallback( async () =>  {
        const games = await getGames(event, year);
        setGames(games);      
      }, [event, year, setGames]);


    useEffect(()=>{
       fetchGames();
   }, [year, event, setGames, fetchGames]);

    

    const handleChangeYear = (e) => {
        setYear(e.target.value);
    };

    const handleChangeEvent = (e) => {
        setEvent(e.target.value);
    };

    const handleSaveEventName = ( value ) => {
        eventDetail.name = value;        
        setEventDetail(eventDetail);
        saveEventDetail(event,year,eventDetail);
    };

    const handleSaveGameName = (gameId, value) => {
        saveGameDetail(event , year, gameId, {name: value});
    }

    const handleSaveGameInfo = (gameId, value) => {
        saveGameDetail
            (event , year, gameId, {info: value});
    }

    const handleNewNameChange = (e) => {
        setNewGameName(e.target.value);
      };

    const handleClickSaveNewGame = () => {
        const gameId = uuidv4();
        saveGameDetail
            (event , year, gameId, {name:newGameName});
        setNewGameName("");
        fetchGames();
    }

    return (
        <div className="App">
            <div className="admin-content">
                <h3>Admin for Events</h3>
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
                <div className='event'>
                    <h2>EVENT</h2>
                    <label>Name 
                        <EditText 
                            type="text" 
                            defaultValue={eventDetail.name}
                            onSave={({value}) => handleSaveEventName(value)}
                        ></EditText>
                    </label>
                </div>
                <div className='games'>
                    <h2>GAMES</h2>
                    {   games.map((game) => 
                        (
                            <div key={game.id}>
                                <label>Name 
                                    <EditText 
                                        type="text" 
                                        defaultValue={game.name}
                                        onSave={({value}) => handleSaveGameName(game.id,value)}
                                    ></EditText>
                                </label>
                                <label>Info 
                                    <EditTextarea 
                                        type="text" 
                                        defaultValue={game.info}
                                        onSave={({value}) => handleSaveGameInfo(game.id,value)}
                                    ></EditTextarea>
                                </label>
                            </div>
                        ))
                    }
                    <h3>ADD NEW GAME</h3>
                    
                    <div key={"new_game"}>
                        <label>Name 
                            <EditText 
                                type="text" 
                                value={newGameName}
                                onChange={(e) => handleNewNameChange(e)}
                            ></EditText>
                        </label>
                        <button onClick={handleClickSaveNewGame}>
                            Save New Game
                        </button>
                    </div>
                    
                </div>
            </div>
        </div>
    );
};

export default AdminEvents;