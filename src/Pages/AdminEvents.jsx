import './Admin.css';
import { getEvent, getEventsByYear, getYearsByEvent } from "../dataService";
import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { EditText } from 'react-edit-text';
import { saveEventDetail, deleteEvent } from "../adminDataService";
import 'react-edit-text/dist/index.css';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { getConfig,setCurrentEvent } from '../configService';
import loader from '../assets/loader.svg';

const AdminEvents = () => {
    const [config, setConfig] = useState(null);
    const loadConfig = useCallback(async () => {
        try {
            const data = await getConfig();
            setConfig(data);
            setEvent(data.currentEvent);
            setYear(data.currentYear);
            setEventDetail({ name: "", year: data.currentYear, eventId: data.currentEvent });
        } catch (error) {
            console.error("Failed to load config", error);
        }
    }, []);

    useEffect(() => {
        loadConfig();
    }, [loadConfig]);

    const [years, setYears] = useState([]);
    const [year, setYear] = useState(null);

    const [events, setEvents] = useState([]);
    const [event, setEvent] = useState(null);

    const [eventDetail, setEventDetail] = useState(null);

    const [newEventName, setNewEventName] = useState("");
    const [newEventYear, setNewEventYear] = useState("");

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

    useEffect(() => {
        const fetchEventDetail = async () => {
            if (year === null || event === null) return;
            const eventDetail = await getEvent(event, year);
            setEventDetail(eventDetail);
        }
        fetchEventDetail();
    }, [year, event, setEventDetail]);


    const handleChangeYear = (e) => {
        setYear(e.target.value);
    };

    const handleChangeEvent = (e) => {
        setEvent(e.target.value);
    };


    const handleNewEventNameChange = (e) => {
        setNewEventName(e.target.value);
    };

    const handleNewEventYearChange = (e) => {
        setNewEventYear(e.target.value);
    };

    const handleClickSaveNewEvent = async () => {
        if (newEventName.length > 0) {
            console.log("creating new event", newEventName);
            const eventId = uuidv4();
            const newEventDetail = { year: year, eventId: eventId, name: newEventName };
            await saveEventDetail(eventId, year, newEventDetail);
            setNewEventName("");
            fetchEvents();
        }
    }

    const handleClickSaveNewYear = async () => {
        if (newEventYear.length > 0) {
            console.log("creating new event", newEventYear);
            const newEventDetail = { year: newEventYear, eventId: event, name: eventDetail.name };
            await saveEventDetail(event, newEventYear, newEventDetail);
            setNewEventYear("");
            fetchYears();
        }
    }

    const handleClickDeleteEvent = async () => {
        if (config.currentYear === year && config.currentEvent === event) {
            alert("not me please");
        } else {
            await deleteEvent(event, year);
            setYear(config.currentYear);
            setEvent(config.currentEvent);
            fetchEvents();
        }
    }

    const handleClickMakeCurrentEvent = async () => {
        await setCurrentEvent(event, year);
        loadConfig();
    }

    return (
        <div className="App">
            {(config && year && event) ?
                <div className="admin-content">
                    <h3>Manage Events</h3>
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
                    <br />
                    {eventDetail.eventId === config.currentEvent && eventDetail.year === config.currentYear ?
                        <div>
                            <h5>{eventDetail.name} {eventDetail.year} is the Current Event</h5>
                        </div>
                        : <div>
                            <br/>
                            <button onClick={handleClickMakeCurrentEvent}>
                                Make {eventDetail.name} {eventDetail.year} as the Current Event
                            </button>
                            <br />
                            <button onClick={handleClickDeleteEvent}>
                                Delete {eventDetail.name} {eventDetail.year}
                            </button>
                        </div>}
                    <hr />
                    <div className='event'>
                        <h2>NEW EVENT</h2>
                    </div>
                    <Tabs>
                        <TabList>
                            <Tab>Create a new event for {year}</Tab>
                            <Tab>Create a new year for {eventDetail.name}</Tab>
                        </TabList>

                        <TabPanel>
                            <label>Name
                                <EditText
                                    type="text"
                                    value={newEventName}
                                    onChange={(e) => handleNewEventNameChange(e)}
                                    style={{
                                        width: '80%',
                                        padding: '10px',
                                        border: '1px solid white',
                                        borderRadius: '5px',
                                        fontSize: '20px',
                                    }}
                                ></EditText>
                            </label>
                            <button onClick={handleClickSaveNewEvent}>
                                Save New Event
                            </button>
                        </TabPanel>
                        <TabPanel>
                            <div className='scoreLabel'>


                                Year
                                <EditText
                                    type="number"
                                    value={newEventYear}
                                    onChange={(e) => handleNewEventYearChange(e)}
                                    style={{
                                        width: '100px',
                                        padding: '10px',
                                        border: '1px solid white',
                                        borderRadius: '5px',
                                        fontSize: '20px',
                                    }}
                                ></EditText>

                                <button onClick={handleClickSaveNewYear}>
                                    Save New Year
                                </button>
                            </div>
                        </TabPanel>
                    </Tabs>
                </div>
                : <div><img alt="Loading..." src={loader}></img></div>
            }
        </div>
    );
};

export default AdminEvents;