import { db } from './firebase';
import { doc, setDoc } from "firebase/firestore";

export const saveAward = async (event, year, empireId, award) =>
{
    const docRef = doc(db, "events/" + event + "/years/" + year + "/awards/" + empireId);
    await setDoc(docRef, {award: award}, { merge: true });
};

export const saveScore = async (event, year, empireId, gameId, score) =>
{
    const docRef = doc(db, "events/" + event + "/years/" + year + "/games/" + gameId + "/scores/" + empireId);
    const intScore = parseInt(score);
    await setDoc(docRef, {score: intScore}, { merge: true });
};

