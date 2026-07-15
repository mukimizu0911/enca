// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// Firebase設定
const firebaseConfig = {
    apiKey: "AIzaSyBz5iesIr-6vQziGSf81N_TaJd08zanq14",
    authDomain: "enca-da78b.firebaseapp.com",
    projectId: "enca-da78b",
    storageBucket: "enca-da78b.firebasestorage.app",
    messagingSenderId: "141720658977",
    appId: "1:141720658977:web:6025bd724a7ae1db392f60"
};

// Firebase初期化
const app = initializeApp(firebaseConfig);

// Authentication
const auth = getAuth(app);

// Firestore
const db = getFirestore(app);

export { auth, db };