import './Admin.css';
import { appConfig } from "../config";
import { getEvent, getEventsByYear, getYearsByEvent, getGames} from "../dataService";
import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { EditTextarea, EditText } from 'react-edit-text';
import {saveEventDetail, saveGameDetail, deleteGame, deleteEvent } from "../adminDataService";
import 'react-edit-text/dist/index.css';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase';
import {useNavigate} from 'react-router-dom';
import {adminUids} from '../admin.js';

const AdminEvents = () => {
    const [years, setYears] = useState([]); 
    const [year, setYear] = useState(appConfig.currentYear); 

    const [events, setEvents] = useState([]); 
    const [event, setEvent] = useState(appConfig.currentEvent); 

    const [eventDetail, setEventDetail] = useState({name:"", year:appConfig.currentYear , eventId: appConfig.currentEvent}); 
    const [games, setGames] = useState([]);

    const [newGameName, setNewGameName] = useState("");    
    const [newEventName, setNewEventName] = useState("");  
    const [newEventYear, setNewEventYear] = useState("");  
    
    const navigate = useNavigate();

    useEffect(()=>{
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const uid = user.uid;
                if (adminUids.includes(uid)){
                    return;
                }
            } 
            navigate('/signin');
            });
    }, [navigate])


    const fetchYears = useCallback( async () =>  {
        const years = await getYearsByEvent(event);
            setYears(years);         
    }, [event, setYears]);

    useEffect(()=>{
        fetchYears();
    }, [event, fetchYears]);

    const fetchEvents = useCallback( async () =>  {
        const events = await getEventsByYear(year);
        setEvents(events);     
    }, [year, setEvents]);

    useEffect(()=>{
         fetchEvents();
    }, [year, fetchEvents]);

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

    const handleDeleteGame = async (gameId) =>  {
        await deleteGame(event , year, gameId);
        fetchGames();
    }

    const handleNewGameNameChange = (e) => {
        setNewGameName(e.target.value);
      };

    const handleNewEventNameChange = (e) => {
        setNewEventName(e.target.value);
    };

    const handleNewEventYearChange = (e) => {
        setNewEventYear(e.target.value);
    };

    const handleClickSaveNewGame = () => {
        const gameId = uuidv4();
        saveGameDetail
            (event , year, gameId, {name:newGameName});
        setNewGameName("");
        fetchGames();
    }

    const handleClickSaveNewEvent = async () => {
        if(newEventName.length > 0){
            console.log("creating new event", newEventName);
            const eventId = uuidv4();
            const newEventDetail = {year: year, eventId:eventId, name: newEventName };
            await saveEventDetail(eventId,year,newEventDetail);
            setNewEventName("");
            fetchEvents();
        }
    }

    const handleClickSaveNewYear = async () => {
        if(newEventYear.length > 0){
            console.log("creating new event", newEventYear);
            const newEventDetail = {year: newEventYear, eventId:event, name: eventDetail.name };
            await saveEventDetail(event,newEventYear,newEventDetail);
            setNewEventYear("");
            fetchYears();
        }
    }

    const handleClickDeleteEvent = async () => {
        if(appConfig.currentYear === year && appConfig.currentEvent === event){
            alert("not me please");
        }else{
            await deleteEvent(event,year);
            setYear(appConfig.currentYear);
            setEvent(appConfig.currentEvent);    
        }
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
                <div>
                <button onClick={handleClickDeleteEvent}>
                    Delete THIS Event
                </button>
                </div>
                
                <div className='event'>
                <h2>NEW EVENT</h2>
                <h5>Create a new event for {year}</h5>
                <label>Name
                     <EditText 
                                type="text" 
                                value={newEventName}
                                onChange={(e) => handleNewEventNameChange(e)}
                            ></EditText>
                    </label>
                    <button onClick={handleClickSaveNewEvent}>
                        Save New Event
                    </button>
                
                    <h5>Create a new year for {eventDetail.name}</h5>
                    <label>Year
                        <EditText 
                                    type="number" 
                                    value={newEventYear}
                                    onChange={(e) => handleNewEventYearChange(e)}
                                ></EditText>
                        </label>
                    <button onClick={handleClickSaveNewYear}>
                        Save New Year
                    </button>
                </div>
                <hr/>
                <div className='event'>
                    <h2>EDIT EVENT</h2>
                    <label>Name 
                        <EditText 
                            type="text" 
                            defaultValue={eventDetail.name}
                            onSave={({value}) => handleSaveEventName(value)}
                        ></EditText>
                    </label>
                    <div>Year : {eventDetail.year}</div>
                </div>
                <hr/>
                <div className='games'>
                    <h3>GAMES</h3>
                    {   games.map((game) => 
                        (
                            
                            <div key={game.id}>
                                <hr/>
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
                                <button onClick={ () => handleDeleteGame(game.id)}>
                                    Delete this Game
                                </button>
                                
                            </div>
                        ))
                    }
                    <hr/>
                    <h4>ADD NEW GAME TO EVENT</h4>
                    
                    <div key={"new_game"}>
                        <label>Name 
                            <EditText 
                                type="text" 
                                value={newGameName}
                                onChange={(e) => handleNewGameNameChange(e)}
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