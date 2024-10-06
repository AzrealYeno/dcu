import './Admin.css';
import { signInWithGooglePopup } from "../firebase";
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase';
import { NavLink } from 'react-router-dom';
import { getConfig } from '../configService';
import loader from '../assets/loader.svg';

const Admin = () => {
    const [config, setConfig] = useState(null);
    useEffect(() => {
        const loadConfig = async () => {
            try {
                const data = await getConfig();
                setConfig(data);
                if(data.adminsList && data.adminsList.includes(auth.currentUser.uid)) {
                    setIsAdmin(true);
                }else{
                    setIsAdmin(false);
                }
            } catch (error) {
                console.error("Failed to load config", error);
            }
        };
        loadConfig();
    }, []);

    const [isAdmin, setIsAdmin] = useState(false);

    const logGoogleUser = async () => {
        const response = await signInWithGooglePopup();
        console.log(response);
    }

    const [userid, setUserId] = useState("");
    const [userName, setUserName] = useState("");

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const uid = user.uid;
                setUserId(uid);
                setUserName(user.displayName);
            } else {
                setUserId("");
                setUserName("");
                console.log("user is logged out")
            }
        });

    }, [setUserId])
    return (
        <div className="App">
            {config ?
                <div>
                    {userid ? 
                        <h1>Welcome {userName || "User"}</h1>
                        : <button onClick={logGoogleUser}>Sign In With Google</button>
                    }

                    <ul>
                        <li>
                            <NavLink to="/">
                                Home
                            </NavLink>
                        </li>
                        {userid && isAdmin?
                            <><li>
                                <NavLink to="/admin/events">
                                    Events
                                </NavLink>
                            </li><li>
                                    <NavLink to="/admin/games">
                                        Games
                                    </NavLink>
                                </li><li>
                                    <NavLink to="/admin/scores">
                                        Scores
                                    </NavLink>
                                </li><li>
                                    <NavLink to="/admin/awards">
                                        Awards
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/admin/users">
                                        Admin Users
                                    </NavLink>
                                </li>
                                </>
                            : <div>
                                <br/>
                                {userid && <div>Your userId is {userid}</div>}
                                </div>}

                    </ul>
                </div> : <div><img alt="Loading..." src={loader}></img></div>
            }</div>



    )
}
export default Admin;