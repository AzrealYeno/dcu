import './Admin.css';
import { useEffect, useState , useCallback } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase';
import { getConfig , setAdminsList } from '../configService';
import loader from '../assets/loader.svg';
import { useNavigate } from 'react-router-dom';
import { EditText } from 'react-edit-text';

const AdminUsers = () => {
    const navigate = useNavigate();
    const [config, setConfig] = useState(null);
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

    useEffect(() => {
        if (config === null) return;
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const uid = user.uid;
                if (config.adminsList && config.adminsList.includes(uid)) {
                    return;
                }
            }
            navigate('/admin');
        });
    }, [config, navigate]);

    const [newUserId, setNewUserId] = useState("");

    const handleNewUserIdChange = (e) => {
        setNewUserId(e.target.value);
    };

    const handleClickAddNewAdmin = async () => {
        if(newUserId){
            setAdminsList([...config.adminsList, newUserId]);
            loadConfig();
            setNewUserId("");
        }
    };

    return (
        <div className="App">
            {config ?
                <div>
                    <h1>Admin UserIds</h1>
                    <ul>
                        {config.adminsList.map((uid) =>
                        (
                            <li key={uid}>{uid}</li>
                        ))}
                    </ul>
                    <hr/>
                    <h4>ADD NEW Admin</h4>

                                <div >
                                    <label>UserId
                                        <EditText
                                            type="text"
                                            value={newUserId}
                                            onChange={(e) => handleNewUserIdChange(e)}
                                            style={{
                                                width: '80%',
                                                padding: '10px',
                                                border: '1px solid white',
                                        borderRadius: '5px',
                                        fontSize: '20px',
                                            }}
                                        ></EditText>
                                    </label>
                                    <button onClick={handleClickAddNewAdmin}>
                                        Add Admin UserId
                                    </button> 
                                </div>
                </div> : <div><img alt="Loading..." src={loader}></img></div>
            }
        </div>



    )
}
export default AdminUsers;