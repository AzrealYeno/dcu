import { db } from './firebase';
import { doc, setDoc } from "firebase/firestore";

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

