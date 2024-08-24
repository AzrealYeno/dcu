import { db } from './firebase';
import { doc, setDoc } from "firebase/firestore";

export const saveAward = async (event, year, empireId, award) =>
 {
    const docRef = doc(db, "events/" + event + "/years/" + year + "/awards/" + empireId);
    await setDoc(docRef, {award: award});
};