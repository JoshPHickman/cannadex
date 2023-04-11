// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { getAuth, } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCY2PpCLr2ZKLvXBAsrw2n1YdY63rc0XBA",
  authDomain: "cannabis-journal-5edeb.firebaseapp.com",
  databaseURL: 'https://cannabis-journal-5edeb.firebaseio.com',
  projectId: "cannabis-journal-5edeb",
  storageBucket: "cannabis-journal-5edeb.appspot.com",
  messagingSenderId: "65041789245",
  appId: "1:65041789245:web:bead4816f69b1f93d59554"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize google auth provider
const auth = getAuth(app);

console.log( auth)
export {db, auth}