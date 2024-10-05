import './Admin.css';
import { appConfig } from "../config.js";
import { getEventsByYear, getYearsByEvent, getAwardByEmpire } from "../dataService.js";
import { saveAward } from "../adminDataService.js";
import { useState, useEffect } from 'react';
import { empireIds } from '../constants.js';
import 'react-edit-text/dist/index.css';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase.js';
import { useNavigate } from 'react-router-dom';
import { adminUids } from '../admin.js';
import MDEditor from "@uiw/react-md-editor";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

const AdminAwards = () => {
    const [years, setYears] = useState([]);
    const [year, setYear] = useState(appConfig.currentYear);

    const [events, setEvents] = useState([]);
    const [event, setEvent] = useState(appConfig.currentEvent);

    const [awards, setAwards] = useState([]);

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

    useEffect(() => {
        const fetchYears = async () => {
            const years = await getYearsByEvent(event);
            setYears(years);
        }

        fetchYears();
    }, [event, setYears]);

    useEffect(() => {
        const fetchEvents = async () => {
            const events = await getEventsByYear(year);
            setEvents(events);
        }
        fetchEvents();
    }, [year, setEvents]);

    useEffect(() => {
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


    const handleChangeYear = (e) => {
        setYear(e.target.value);
    };

    const handleChangeEvent = (e) => {
        setEvent(e.target.value);
    };

    const handleSaveAward = (empreId, index) => {
        const value = awards[index].award;
        saveAward(event, year, empreId, value);
    };

    const handleChangeAward = (index, value) => {
        awards[index].award = value;
        setAwards([...awards]);
    };

    return (
        <div className="App">
            <div className="admin-content">
                <h1>Manage Awards</h1>
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
                    <Tabs>
                        <TabList>
                            {awards.map((evnt, index) =>
                            (
                                <Tab  key={evnt.empireId}>{evnt.empireId}</Tab>
                            ))}
                        </TabList>
                        
                

                    {awards.map((evnt, index) =>
                    (
                        <TabPanel key={evnt.empireId}>
                        <div key={evnt.empireId}>
                            <h3>Awards for {evnt.empireId}</h3>
                            <div className="container">
                                <MDEditor value={evnt.award}
                                    onChange={(value) => handleChangeAward(index, value)} />
                                    <br/>
                                <button onClick={() => handleSaveAward(evnt.empireId, index)}>
                                    Save
                                </button>

                            </div>
                        </div>
                        </TabPanel>
                    ))
                    }
                    </Tabs>
                </div>
            </div>
        </div>
    );
};

export default AdminAwards;