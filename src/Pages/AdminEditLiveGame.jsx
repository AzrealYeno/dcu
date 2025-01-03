import './Admin.css';
import { useEffect, useState , useCallback } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase';
import { getConfig } from '../configService';
import loader from '../assets/loader.svg';
import { useNavigate } from 'react-router-dom';
import { saveLiveGameScore, deleteLiveGameScore} from '../adminDataService';
import {getLiveGame, getLiveGamesScores } from '../dataService';
import { useParams } from "react-router-dom";
import {empireIds } from '../constants';
import { EditText } from 'react-edit-text';
import { NavLink } from 'react-router-dom';

const AdminEditLiveGame = () => {
    const navigate = useNavigate();
    const [config, setConfig] = useState(null);
    const [livegame, setLiveGame] = useState([]);
    const [scores, setScores] = useState([]);
    const { gameid } = useParams();
    const [newteam, setNewTeam] = useState(empireIds[0]);

    const loadConfig = useCallback(async () => {
        try {
            const data = await getConfig();
                setConfig(data);
        } catch (error) {
            console.error("Failed to load config", error);
        }
    }, []);

    useEffect(() => {
        loadConfig();
    }, [loadConfig]);


    const fetchLiveGame = useCallback(async () => {
        await getLiveGame(gameid).then((data) => {
            console.log('livegame',data);
            setLiveGame(data);
            fetchLiveGameScores();
        });
    }, [setLiveGame]);

    const fetchLiveGameScores = useCallback(async () => {
        const scores = await getLiveGamesScores(gameid);
        setScores(scores);
    }, [setLiveGame]);


    useEffect(() => {
        if (config === null) return;
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const uid = user.uid;
                if (config.adminsList && config.adminsList.includes(uid)) {
                    fetchLiveGame();
                    return;
                }
            }
            navigate('/admin');
        });
    }, [config, navigate]);

    const handleChangeNewTeam = (e) => {
        setNewTeam(e.target.value);
    };


    const handleClickSaveNewTeam = async () => {
        console.log("saving new team", newteam);
        await saveLiveGameScore(gameid, newteam, 0);
        fetchLiveGameScores();
    }

    const handleDeleteScore = async (scoreId) => {
        await deleteLiveGameScore(gameid, scoreId);
        fetchLiveGameScores();
    }

    const handleSaveScore = async (empreId, value) => {
        await saveLiveGameScore(gameid, empreId, value);
        fetchLiveGameScores();
    };
   
    

    return (
        <div className="App">
            <div className="admin-content">
            {config ?
                <div>
                    <h1>{livegame.name}</h1>
                    <h2>
                    <NavLink to={`/livegame/${gameid}`} >
                    /livegame/{gameid}
                    </NavLink>
                    </h2>
                    <h1>Live Games</h1>
                    <ul>
                        {scores.map((score) =>
                        (
                            <li key={score.id}>
<div key={score.id} className='scoreLabel'>
                                                {score.id}
                                                <EditText
                                                    style={{
                                                        width: '50px',
                                                        padding: '10px',
                                                        border: '1px solid white',
                                        borderRadius: '5px',
                                        fontSize: '20px',
                                                    }}
                                                    type="number"
                                                    defaultValue={score.score.toString()}
                                                    onSave={({ value }) => handleSaveScore(score.id, value)}
                                                ></EditText>
                                            </div>


                            ----- 
                            <button onClick={() => handleDeleteScore(score.id)}>
                                    Delete Team
                                </button>
                            </li>
                        ))}
                    </ul>

                    <hr/>
                    <h4>ADD TEAM</h4>

                                <div key={"new_game"}>
                                    <label>Team Name
                                    <select value={newteam} onChange={handleChangeNewTeam}>
                            {empireIds.map((empireId) => (
                                <option key={empireId} value={empireId}>{empireId}</option>
                            ))}
                        </select>

                                    </label>

                                    <button onClick={handleClickSaveNewTeam}>
                                        Add New Team
                                    </button>
                                </div>
                    
                </div> : <div><img alt="Loading..." src={loader}></img></div>
            }
        </div>
        </div>
    )
}
export default AdminEditLiveGame;