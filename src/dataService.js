import { onSnapshot } from "firebase/firestore";
import { db } from './firebase';
import { appConfig } from './config';
import { collection, doc, getDocs, getDoc } from "firebase/firestore";
import { empireIds, empires, medals } from './constants';

export const streamGame = (gameid, snapshot) => {
    const docRef = doc(db, "events/" + appConfig.currentEvent + "/years/" + appConfig.currentYear + "/games/", gameid);        
    return onSnapshot(docRef , snapshot);
};

export const sortRanks = (ranks) => {
    var tempArr = [];
    for (let index = 0; index < empireIds.length; index++) {
        tempArr.push({ 
            score: ranks[empireIds[index]], 
            empireId: empireIds[index] , 
            empire : empires[empireIds[index]]
        });
    }
    var sortedArr = tempArr.sort((a, b) => a.score < b.score ? 1 : -1);

    var medalsToAssign = [...medals];
    var currentMedal = medalsToAssign.shift();
    
    var currentScore = -999;
    for (let index = 0; index < sortedArr.length; index++) {
        if( sortedArr[index].score > currentScore){
            sortedArr[index].medal = currentMedal;
        }else if( sortedArr[index].score === currentScore){
            sortedArr[index].medal = currentMedal;
            medalsToAssign.shift();
        }else{
            currentMedal = medalsToAssign.shift();
            sortedArr[index].medal = currentMedal;
        }
        currentScore = sortedArr[index].score;
    }
    return sortedArr;
};


export const getGames = async () =>  {
    return getDocs(collection(db, "events/" + appConfig.currentEvent + "/years/" + appConfig.currentYear + "/games"))
    .then((querySnapshot)=>{               
        return querySnapshot.docs
            .map((doc) => ({...doc.data(), id:doc.id }))
    });
};

export const getEventsByYear = async (year) =>  {
    return getDocs(collection(db, "year_event_index/" + year + "/events"))
    .then((querySnapshot)=>{               
        return querySnapshot.docs
            .map((doc) => ({...doc.data(), id:doc.id }))
    });
};

export const getAwards = async (event, year) =>
{
    return getDoc(doc(db, "events/" + event + "/years/" + year))
    .then((snapshot)=>{                       
        return snapshot.data();
    });
}

export const getYearsByEvent = async (event) =>  {
    return getDocs(collection(db, "events/" + event + "/years"))
    .then((querySnapshot)=>{               
        return querySnapshot.docs
            .map((doc) => ({...doc.data(), id:doc.id }))
    });
};