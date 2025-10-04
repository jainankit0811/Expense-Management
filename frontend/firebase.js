// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
    authDomain: "expense-management-12e02.firebaseapp.com",
    projectId: "expense-management-12e02",
    storageBucket: "expense-management-12e02.firebasestorage.app",
    messagingSenderId: "184791386123",
    appId: "1:184791386123:web:5f212e4c3b9d12a28f9f0e"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export { app, auth };
