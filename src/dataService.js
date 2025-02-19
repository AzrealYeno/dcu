import { onSnapshot } from "firebase/firestore";
import { db } from './firebase';
import { collection, doc, getDocs, getDoc } from "firebase/firestore";
import { empireIds, empires, medals } from './constants';

export const streamScores = (eventid, year, gameid, snapshot) => {
    const docRef = collection(db, "events/" + eventid + "/years/" + year + "/games/" +  gameid  + "/scores");        
    return onSnapshot(docRef , snapshot);
};


export const getGamesScores = async (eventid, year, gameid) =>  {
    return getDocs(collection(db, "events/" + eventid + "/years/" + year + "/games/" +  gameid  + "/scores"))
    .then((querySnapshot)=>{               
        return querySnapshot.docs
            .map((doc) => ({...doc.data(), id:doc.id }))
    });
};

export const streamGameMatches = (eventid, year, gameid, snapshot) => {
    const docRef = collection(db, "events/" + eventid + "/years/" + year + "/games/" +  gameid  + "/matches");        
    return onSnapshot(docRef , snapshot);
};

export const getGamesMatches = async (eventid, year, gameid) =>  {
    return getDocs(collection(db, "events/" + eventid + "/years/" + year + "/games/" +  gameid  + "/matches"))
    .then((querySnapshot)=>{               
        return querySnapshot.docs
            .map((doc) => ({...doc.data(), id:doc.id }))
    });
};

export const getGame = async (eventid, year, gameid) => {
    return getDoc(doc(db,  "events/" + eventid + "/years/" + year + "/games/", gameid))
    .then((snapshot) =>{    
        return snapshot.data();
    });
};

export const getEvent = async (eventid, year) => {
    return getDoc(doc(db,  "events/" +eventid + "/years/", year))
    .then((snapshot) =>{    
        return snapshot.data();
    });
};

export const sortRanks = (scores) => {
    var tempArr = [];
    for (let index = 0; index < empireIds.length; index++) {
        tempArr.push({ 
            score: scores[empireIds[index]] || 0 , 
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


export const getGames = async (event, year) =>  {
    return getDocs(collection(db, "events/" + event + "/years/" + year + "/games"))
    .then((querySnapshot)=>{               
        return querySnapshot.docs
            .map((doc) => ({...doc.data(), id:doc.id }))
    });
};

export const getLiveGames = async () =>  {
    return getDocs(collection(db, "livegames"))
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

export const getAwardByEmpire = async (event, year, empireId) =>
{
    return getDoc(doc(db, "events/" + event + "/years/" + year + "/awards/" + empireId))
    .then((snapshot) =>{    
        return snapshot.exists() ?  {...snapshot.data(), empireId: empireId} : {award : "",empireId: empireId };
    });
}

export const getYearsByEvent = async (event) =>  {
    return getDocs(collection(db, "events/" + event + "/years"))
    .then((querySnapshot)=>{               
        return querySnapshot.docs
            .map((doc) => ({...doc.data(), id:doc.id }))
    });
};

export const getLiveGame = async (gameid) => {
    return getDoc(doc(db,  "livegames/", gameid))
    .then((snapshot) =>{    
        return snapshot.data();
    });
};

export const getLiveGamesScores = async (gameid) =>  {
    return getDocs(collection(db, "livegames/" + gameid + "/scores"))
    .then((querySnapshot)=>{               
        return querySnapshot.docs
            .map((doc) => ({...doc.data(), id:doc.id }))
    });
};

export const streamLiveGameScores = (gameid, snapshot) => {
    const docRef = collection(db, "livegames/" + gameid + "/scores");        
    return onSnapshot(docRef , snapshot);
};

export const getLiveGamesWithScores = async () =>  {
    const games = await getLiveGames();
    return Promise.all(games.map(async (game) => {
        const scores = await getLiveGamesScores(game.id);
        scores.sort((a, b) => b.score - a.score);
        return {...game, scores: scores};
    }));
};