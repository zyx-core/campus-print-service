import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Replace with your actual Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA0T8N5Z1BisO8Z8IhbS0Cyj2JJHD4shPk",
    authDomain: "printapp-374c1.firebaseapp.com",
    projectId: "printapp-374c1",
    storageBucket: "printapp-374c1.firebasestorage.app",
    messagingSenderId: "990883468146",
    appId: "1:990883468146:web:104246d4d413a4157c03eb",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
import { getStorage } from "firebase/storage";
export const storage = getStorage(app);
