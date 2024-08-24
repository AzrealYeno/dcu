
import { useParams } from "react-router-dom";
import { empires } from "../constants";
import './Empire.css';
import { appConfig } from "../config";
import { getEventsByYear, getYearsByEvent, getAwards } from "../dataService";
import { useState, useEffect } from 'react';
import Markdown from 'react-markdown'


const Empire = () => {
    const { empireId } = useParams();
    const empire = empires[empireId];

    const [years, setYears] = useState([]); 
    const [year, setYear] = useState(appConfig.currentYear); 

    const [events, setEvents] = useState([]); 
    const [event, setEvent] = useState(appConfig.currentEvent); 

    const [awards, setAwards] = useState(""); 


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
            const awards = await getAwards(event, year, empireId);
            setAwards(awards.award);                
         }
         fetchAwards();
    }, [year, event, setAwards]);

    const handleChangeYear = (e) => {
        setYear(e.target.value);
    };

    const handleChangeEvent = (e) => {
        setEvent(e.target.value);
    };

    var divStyle = {
        backgroundImage: 'url('+ empire.backgroundImage +')',
        backgroundSize: "cover"
    };

    return (
        <div className="App">
            <div className="empire-content" style={divStyle}>
                <div>{empire.name}</div>
                <div>{empire.id}</div>
                
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
                   <Markdown>{awards}</Markdown>
                </div>
            </div>
        </div>
    );
};

export default Empire;