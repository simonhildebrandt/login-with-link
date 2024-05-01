import { initializeApp } from 'firebase/app';
import {
  getAuth,
  connectAuthEmulator
} from "firebase/auth";
import {
  getFirestore,
  connectFirestoreEmulator
} from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDxrhUQ4Kt_3S-Dd1sYU2oTd4hmygO-7Jk",
  authDomain: "login-with-link.firebaseapp.com",
  projectId: "login-with-link",
  storageBucket: "login-with-link.appspot.com",
  messagingSenderId: "571495988688",
  appId: "1:571495988688:web:389958e5f918f3b3ba0dd5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
connectAuthEmulator(auth, "http://127.0.0.1:9099");
connectFirestoreEmulator(db, '127.0.0.1', 8080);


export { db, auth };
