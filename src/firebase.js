// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDyFbpuAsc1StHkuepPsUKCULRivlrfEPs",
  authDomain: "limpopo-fd942.firebaseapp.com",
  projectId: "limpopo-fd942",
  storageBucket: "limpopo-fd942.firebasestorage.app",
  messagingSenderId: "667236347435",
  appId: "1:667236347435:web:9db4893643fc3ffe1dc46e",
  measurementId: "G-2YVSK3HBQ7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);