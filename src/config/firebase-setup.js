// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBTC2mwu5cD2IaY3rJ5Fj5uVFbzDSG_X7Y",
  authDomain: "readit-22759.firebaseapp.com",
  projectId: "readit-22759",
  storageBucket: "readit-22759.appspot.com",
  messagingSenderId: "683209202032",
  appId: "1:683209202032:web:3c1bbe04c666cf836917b5",
  databaseURL: "https://readit-22759-default-rtdb.europe-west1.firebasedatabase.app/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app);