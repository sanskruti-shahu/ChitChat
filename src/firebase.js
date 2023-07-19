import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import 'firebase/compat/storage';
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyAqBDqJOTPZMUhgymK0P7daCB6cmLq7aKQ",
  authDomain: "chatapp-1c486.firebaseapp.com",
  projectId: "chatapp-1c486",
  storageBucket: "chatapp-1c486.appspot.com",
  messagingSenderId: "2199580215",
  appId: "1:2199580215:web:34255b59bbfe6370a459b2"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();