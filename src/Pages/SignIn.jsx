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

        userid ? <div>
            {
                <h1>Welcome {userName || "User"}</h1>
            }
            <ul>
                <li>
                    <NavLink to="/admin/events">
                        Events
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/admin/games">
                        Games
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/admin/results">
                        Results
                    </NavLink>
                </li>
            </ul>
        </div>
            : <button onClick={logGoogleUser}>Sign In With Google</button>

    )
}
export default SignIn;