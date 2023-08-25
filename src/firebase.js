// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithCustomToken } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
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


export { getAuth, signInWithCustomToken };
