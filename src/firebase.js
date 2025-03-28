import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAd-nYuQmPZgbxurL3lttIPugfkhl1H-kw",
  authDomain: "high-bridge-a3632.firebaseapp.com",
  projectId: "high-bridge-a3632",
  storageBucket: "high-bridge-a3632.firebasestorage.app",
  messagingSenderId: "180497537037",
  appId: "1:180497537037:web:eaad1ddc8dbd0303859d44",
  measurementId: "G-2J10P0YJP7",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
