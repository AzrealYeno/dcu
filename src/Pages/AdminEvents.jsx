import './Admin.css';
import { appConfig } from "../config";
import { getEvent, getEventsByYear, getYearsByEvent } from "../dataService";
import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { EditText } from 'react-edit-text';
import { saveEventDetail, deleteEvent } from "../adminDataService";
import 'react-edit-text/dist/index.css';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { adminUids } from '../admin.js';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

const AdminEvents = () => {
    const [years, setYears] = useState([]);
    const [year, setYear] = useState(appConfig.currentYear);

    const [events, setEvents] = useState([]);
    const [event, setEvent] = useState(appConfig.currentEvent);

    const [eventDetail, setEventDetail] = useState({ name: "", year: appConfig.currentYear, eventId: appConfig.currentEvent });

    const [newEventName, setNewEventName] = useState("");
    const [newEventYear, setNewEventYear] = useState("");

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

    useEffect(() => {
        const fetchEventDetail = async () => {
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
        if (appConfig.currentYear === year && appConfig.currentEvent === event) {
            alert("not me please");
        } else {
            await deleteEvent(event, year);
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
                    <br />
                    <button onClick={handleClickDeleteEvent}>
                        Delete {eventDetail.name} {eventDetail.year}
                    </button>
                </div>
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
                                    border: '1px solid #2E8B57',
                                    borderRadius: '5px',
                                    fontSize: '20px',
                                    backgroundColor: '#f9f9f9',
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
                                border: '1px solid #2E8B57',
                                borderRadius: '5px',
                                fontSize: '20px',
                                backgroundColor: '#f9f9f9',
                            }}
                        ></EditText>
                        
                        <button onClick={handleClickSaveNewYear}>
                            Save New Year
                        </button>
                        </div>
                    </TabPanel>
                </Tabs>


            </div>
        </div>
    );
};

export default AdminEvents;