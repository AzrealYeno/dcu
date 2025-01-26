import { db } from './firebase';
import { deleteDoc, doc, setDoc } from "firebase/firestore";

export const saveAward = async (eventId, year, empireId, award) =>
{
    const docRef = doc(db, "events/" + eventId + "/years/" + year + "/awards/" + empireId);
    await setDoc(docRef, {award: award}, { merge: true });
};

export const saveScore = async (eventId, year, empireId, gameId, score) =>
{
    const docRef = doc(db, "events/" + eventId + "/years/" + year + "/games/" + gameId + "/scores/" + empireId);
    const intScore = parseInt(score);
    await setDoc(docRef, {score: intScore}, { merge: true });
};


export const saveMatchScore = async (eventId, year,  gameId, matchId, scoreTeamNum, score) =>
{
    const docRef = doc(db, "events/" + eventId + "/years/" + year + "/games/" + gameId + "/matches/" + matchId);
    const intScore = parseInt(score);
    if(scoreTeamNum === "scoreteam1"){
        await setDoc(docRef, {scoreteam1: intScore}, { merge: true });
    }else if(scoreTeamNum === "scoreteam2"){
        await setDoc(docRef, {scoreteam2: intScore}, { merge: true });
    }
};

export const saveMatchTeam = async (eventId, year,  gameId, matchId, teamNum, teamId) =>
    {
        const docRef = doc(db, "events/" + eventId + "/years/" + year + "/games/" + gameId + "/matches/" + matchId);
        if(teamNum === "team1"){
            await setDoc(docRef, {team1: teamId}, { merge: true });
        }else if(teamNum === "team2"){
            await setDoc(docRef, {team2: teamId}, { merge: true });
        }
    };

export const saveEventDetail = async (eventId, year, eventDetail) =>
{
    eventDetail.year = year;
    eventDetail.eventId = eventId;
    const docRef = doc(db, "events/" + eventId + "/years/" + year);
    await setDoc(docRef, eventDetail, { merge: true });
    const indexDocRef = doc(db, "year_event_index/" + year + "/events/" + eventId);
    await setDoc(indexDocRef, eventDetail, { merge: true });
};

export const saveGameDetail = async (eventId, year, gameId, gameDetail) =>
{
    const docRef = doc(db, "events/" + eventId + "/years/" + year + "/games/" + gameId);
    await setDoc(docRef, gameDetail, { merge: true });   
};

export const deleteGame = async (eventId, year, gameId) =>
{
    const docRef = doc(db, "events/" + eventId + "/years/" + year + "/games/" + gameId);
    await deleteDoc(docRef);   
};

export const deleteEvent = async (eventId, year) =>
{
    const docRef = doc(db, "events/" + eventId + "/years/" + year);
    await deleteDoc(docRef);   
    const indexDocRef = doc(db, "year_event_index/" + year + "/events/" + eventId);
    await deleteDoc(indexDocRef);      
};


export const saveLiveGameDetail = async (gameId, gameDetail) =>
{
    const docRef = doc(db, "livegames/"+ gameId);
    await setDoc(docRef, gameDetail, { merge: true });   
};


export const deleteLiveGame = async (gameId) =>
{
    const docRef = doc(db, "livegames/" + gameId);
    await deleteDoc(docRef);   
};

export const deleteLiveGameScore = async (gameId, scoreId) =>
{
    const docRef = doc(db, "livegames/" + gameId + "/scores/" + scoreId);
    await deleteDoc(docRef);   
};

export const saveLiveGameScore = async (gameId, empireId, score) =>
{
    const docRef = doc(db, "livegames/"+ gameId + "/scores/" + empireId);
    console.log("saving score: " + score);
    const intScore = parseInt(score);
    await setDoc(docRef, {score: intScore}, { merge: true });
};