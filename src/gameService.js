import { onSnapshot } from "firebase/firestore";
import { db } from './firebase';
import { appConfig } from './config';
import { collection, doc, getDocs } from "firebase/firestore";
import { empireIds } from './constants';

export const streamGame = (gameid, snapshot) => {
    const docRef = doc(db, "events/" + appConfig.currentEvent + "/years/" + appConfig.currentYear + "/games/", gameid);        
    return onSnapshot(docRef , snapshot);
};

export const sortRanks = (ranks) => {
    var newArr = [];
    for (let index = 0; index < empireIds.length; index++) {
        newArr.push({ score: ranks[empireIds[index]], empireId: empireIds[index], });
    }
    return newArr.sort((a, b) => a.score < b.score ? 1 : -1);
};

export const getGames = async () =>  {
    return getDocs(collection(db, "events/" + appConfig.currentEvent + "/years/" + appConfig.currentYear + "/games"))
    .then((querySnapshot)=>{               
        return querySnapshot.docs
            .map((doc) => ({...doc.data(), id:doc.id }))
    });
};