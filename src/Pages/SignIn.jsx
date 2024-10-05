import { signInWithGooglePopup } from "../firebase";
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase';
import { NavLink } from 'react-router-dom';

const SignIn = () => {
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
                console.log(user);
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
                {userid ?
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
                        </li></>
                    : <></>}

            </ul>
        </div>


    )
}
export default SignIn;