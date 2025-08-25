// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCnbWEV4_PvI8fjs03FnJBjmWNjn952fjM",
  authDomain: "irctc-project-74989.firebaseapp.com",
  projectId: "irctc-project-74989",
  storageBucket: "irctc-project-74989.firebasestorage.app",
  messagingSenderId: "211893025999",
  appId: "1:211893025999:web:0b8d7f04706cd180470bba"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleAuthProvider = new (GoogleAuthProvider);