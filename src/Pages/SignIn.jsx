import { signInWithGooglePopup } from "../firebase";
import { useEffect,useState } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase';

const SignIn = () => {
    const logGoogleUser = async () => {
        const response = await signInWithGooglePopup();
        console.log(response);
    }
    
    const [userid, setUserId] = useState(""); 

    useEffect(()=>{
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const uid = user.uid;
                setUserId(uid);
            } else {
                setUserId("");
                console.log("user is logged out")
            }
            });

    }, [setUserId])
return (
    
        <div>
            {
                userid ? <h1>Welcome User</h1> : <button onClick={logGoogleUser}>Sign In With Google</button>
            }
            
        </div>
    )
}
export default SignIn;