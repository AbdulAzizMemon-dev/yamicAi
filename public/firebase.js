// public/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDEwGqog3nI6UER5oJRJ2aK627nDEgdLHk",
    authDomain: "yamicai.firebaseapp.com",
    projectId: "yamicai",
    storageBucket: "yamicai.firebasestorage.app",
    messagingSenderId: "500726656726",
    appId: "1:500726656726:web:6fa4ca99eed8bed57aa377"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
