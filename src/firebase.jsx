// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDfhZAcU-uC-jXXfSU2dBGvFrKWIdJT6Ho",
  authDomain: "traffic-lights-taskmanager.firebaseapp.com",
  projectId: "traffic-lights-taskmanager",
  storageBucket: "traffic-lights-taskmanager.appspot.com",
  messagingSenderId: "882682738419",
  appId: "1:882682738419:web:89336bf8c4ff87c6922986",
  measurementId: "G-JF8J5WQEYX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;