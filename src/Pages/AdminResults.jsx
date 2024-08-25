import './Admin.css';
import { appConfig } from "../config";
import { getEventsByYear, getYearsByEvent , getAwardByEmpire, getGames, getGamesScores} from "../dataService";
import { saveAward , saveScore} from "../adminDataService";
import { useState, useEffect } from 'react';
import { empireIds } from '../constants';
import { EditTextarea, EditText } from 'react-edit-text';
import 'react-edit-text/dist/index.css';

const AdminResults = () => {
    const [years, setYears] = useState([]); 
    const [year, setYear] = useState(appConfig.currentYear); 

    const [events, setEvents] = useState([]); 
    const [event, setEvent] = useState(appConfig.currentEvent); 

    const [awards, setAwards] = useState([]); 
    const [games, setGames] = useState([]);

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
                    game.scores.push({empireId: empireId, score: score});
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

    const handleSaveAward = ( empreId, value ) => {
        saveAward(event, year, empreId, value);
    };

    const handleSaveScore = ( empreId, gameId, value ) => {
        console.log('save score',empreId, 'gameid: ', gameId , ': ' , value );
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
                    <p>you can use the Markdown formatting on the text boxes. see: <a href="https://www.markdownguide.org/basic-syntax/">https://www.markdownguide.org/basic-syntax/</a></p>
                    {   awards.map((evnt) => 
                        (
                            
                            <div key={evnt.empireId}>
                                {evnt.empireId} 
                                <EditTextarea 
                                showEditButton
                                 defaultValue={evnt.award}
                                 
                                 onSave={({value}) => handleSaveAward(evnt.empireId,value)}
                                 ></EditTextarea>
                                
                            </div>
                        ))
                    }
                </div>
                <div className='scores'>
                    <h2>SCORES</h2>
                    {   games.map((game) => 
                        (
                            <div key={game.id}>
                                <h3>{game.name}</h3>
                                {   game.scores.map((score) => 
                                    (
                                        <div key={score.empireId}>
                                            {score.empireId}: 
                                            <EditText 
                                                type="number" 
                                                defaultValue={score.score.toString()}
                                                onSave={({value}) => handleSaveScore(score.empireId, game.id ,value)}
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