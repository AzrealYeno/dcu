
import { useParams } from "react-router-dom";
import { empires } from "../constants";
import './Empire.css';
import { getEventsByYear, getYearsByEvent, getAwardByEmpire } from "../dataService";
import { useState, useEffect } from 'react';
import Markdown from 'react-markdown'
import { getConfig } from '../configService';
import loader from '../assets/loader.svg';
import Navbar from "../Navbar";

const Empire = () => {
    const { empireId } = useParams();
    const empire = empires[empireId];

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

    const [awards, setAwards] = useState("");


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
        const fetchAwards = async () => {
            if (event === null || year === null) return;
            console.log("fetching awards" , year, event, empireId);
            const awards = await getAwardByEmpire(event, year, empireId);
            setAwards(awards.award);
        }
        fetchAwards();
    }, [year, event, empireId, setAwards]);

    const handleChangeYear = (e) => {
        setYear(e.target.value);
    };

    const handleChangeEvent = (e) => {
        setEvent(e.target.value);
    };

    var divStyle = {
        backgroundImage: 'url(' + empire.backgroundHistoryImage + ')'
    };

    return (
        <div className="App">
            <Navbar />
            <div className="games_container" >
            {(config && year && event) ?
                <div className="empire_content" style={divStyle}>
                    <div className='topSpacer' />
                    <div className="empire_name_box">
                        <img className="empire_name_img" src={empire.nameImage} alt={empire.name}/>
                    </div>
                    <div className="event_select_box">
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
                    </div>
                    <div className="empire_awards_box">
                        <Markdown>{awards}</Markdown>
                    </div>
                </div>
                : <div><img alt="Loading..." src={loader}></img></div>
            }
            </div>
        </div>
    );
};

export default Empire;