import './Admin.css';
import { useEffect, useState , useCallback } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase';
import { getConfig } from '../configService';
import loader from '../assets/loader.svg';
import { useNavigate } from 'react-router-dom';
import { getLiveGames } from "../dataService.js";
import { EditText } from 'react-edit-text';
import { v4 as uuidv4 } from 'uuid';    
import { saveLiveGameDetail, deleteLiveGame } from '../adminDataService.js';
import { NavLink } from 'react-router-dom';

const AdminLiveGames = () => {
    const navigate = useNavigate();
    const [config, setConfig] = useState(null);
    const [livegames, setLiveGames] = useState([]);

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


    const fetchLiveGames = useCallback(async () => {
        const games = await getLiveGames();
        //console.log(games);
        setLiveGames(games);
    }, [setLiveGames]);

    useEffect(() => {
        if (config === null) return;
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const uid = user.uid;
                if (config.adminsList && config.adminsList.includes(uid)) {
                    fetchLiveGames();
                    return;
                }
            }
            navigate('/admin');
        });
    }, [config, navigate]);

   
    const [newGameName, setNewGameName] = useState("");

    const handleNewGameNameChange = (e) => {
        setNewGameName(e.target.value);
    };

    const handleClickSaveNewGame = () => {
        const gameId = uuidv4();
        saveLiveGameDetail(gameId, { name: newGameName })
        setNewGameName("");
        fetchLiveGames();
    }

    const handleDeleteLiveGame = async (gameId) => {
        await deleteLiveGame(gameId);
        fetchLiveGames();
    }

    return (
        <div className="App">
            <div className="admin-content">
            {config ?
                <div>
                    <h1>Live Games</h1>
                    <ul>
                        {livegames.map((livegame) =>
                        (
                            <li key={livegame.id}>{livegame.name} ------ 
                             <NavLink to={`/admin/livegame/${livegame.id}`} >
                                        Edit
                                    </NavLink>
                                    -------

                                <button onClick={() => handleDeleteLiveGame(livegame.id)}>
                                    Delete this Game
                                </button>
                            </li>
                        ))}
                    </ul>
                    <hr/>
                    <h4>ADD NEW LIVE GAME</h4>

                                <div key={"new_game"}>
                                    <label>Game Name
                                        <EditText
                                            type="text"
                                            value={newGameName}
                                            onChange={(e) => handleNewGameNameChange(e)}
                                            style={{
                                                width: '80%',
                                                padding: '10px',
                                                border: '1px solid white',
                                        borderRadius: '5px',
                                        fontSize: '20px',
                                            }}
                                        ></EditText>
                                    </label>
                                    <button onClick={handleClickSaveNewGame}>
                                        Save New Game
                                    </button>
                                </div>
                    
                </div> : <div><img alt="Loading..." src={loader}></img></div>
            }
        </div>
        </div>
    )
}
export default AdminLiveGames;