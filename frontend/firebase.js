// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_APTKEY,
    authDomain: "padharo-acaf6.firebaseapp.com",
    projectId: "padharo-acaf6",
    storageBucket: "padharo-acaf6.firebasestorage.app",
    messagingSenderId: "138401805846",
    appId: "1:138401805846:web:5133cd085b3f0b7d9ea737"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export { app, auth };
