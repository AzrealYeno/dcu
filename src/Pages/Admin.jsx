import './Empire.css';
import { appConfig } from "../config";
import { getEventsByYear, getYearsByEvent , getAwardByEmpire, getGames} from "../dataService";
import { saveAward } from "../adminDataService";
import { useState, useEffect } from 'react';
import { empireIds } from '../constants';
import { EditTextarea } from 'react-edit-text';
import 'react-edit-text/dist/index.css';

const Admin = () => {
    const [years, setYears] = useState([]); 
    const [year, setYear] = useState(appConfig.currentYear); 

    const [events, setEvents] = useState([]); 
    const [event, setEvent] = useState(appConfig.currentEvent); 

    const [awards, setAwards] = useState([]); 
    const [games, setGames] = useState([]);

    // const [editing, setEdting] = useState("");
    // var editingEpireId = "";

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

    useEffect(()=>{
         const fetchGames = async () => {
            const games = await getGames(event, year);
            for (let index = 0; index < games.length; index++) {
                const game = games[index];
                game.scores = [];
                for (let j = 0; j < empireIds.length; j++) {
                    const empireId = empireIds[j];
                    game.scores.push({empireId: empireId, score: game.ranking[empireId]});
                }
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

    const handleSaveAward = ( empreId, value, previousValue ) => {
        console.log(empreId + ': ' + value );
        saveAward(event, year, empreId, value);
      };

    return (
        <div className="App">
            <div className="admin-content">
                <h3>Admin</h3>
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
                    <h5>awards</h5>
                    {   awards.map((evnt) => 
                        (
                            
                            <div key={evnt.empireId}>
                                {evnt.empireId} 
                                <EditTextarea 
                                showEditButton
                                 defaultValue={evnt.award}
                                 onSave={({value}) => handleSaveAward(evnt.empireId,value)}
                                 >{evnt.award}</EditTextarea>
                                
                            </div>
                        ))
                    }
                </div>
                <div className='scores'>
                    <h5>scores</h5>
                    {   games.map((game) => 
                        (
                            <div key={game.id}>
                                <h6>{game.name}</h6>
                                {   game.scores.map((score) => 
                                    (
                                        <div key={score.empireId}>
                                            {score.empireId}: {score.score}
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

export default Admin;