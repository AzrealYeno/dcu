// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDi9cQ_I98VP7IZDzc2GR2o0ruIo0a7y4A",
    authDomain: "dcu-digicreatehub.firebaseapp.com",
    projectId: "dcu-digicreatehub",
    storageBucket: "dcu-digicreatehub.appspot.com",
    messagingSenderId: "820657286607",
    appId: "1:820657286607:web:bb1946575e1cff63c8f6ba",
    measurementId: "G-7NKZ0YE9VZ"
};
// Initialize Firebase

const app = initializeApp(firebaseConfig);
// Export firestore database
// It will be imported into your react app whenever it is needed
export const db = getFirestore(app);