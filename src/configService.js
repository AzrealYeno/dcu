import { db } from './firebase';
import { setDoc, doc,  getDoc } from "firebase/firestore";

export const getConfig = async () => {
    return getDoc(doc(db,  "config/", "eventConfig"))
    .then((snapshot) =>{    
        return snapshot.data();
    });
};

export const setCurrentEvent = async  (eventid, year)=> {
    const docRef = doc(db,  "config/", "eventConfig");
    await setDoc(docRef, {currentEvent: eventid, currentYear: year}, { merge: true });
};