// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB9qbZa0tSzwDxjRcfC2wroGnTSf7j9vkQ",
  authDomain: "stock-management-a3276.firebaseapp.com",
  projectId: "stock-management-a3276",
  storageBucket: "stock-management-a3276.appspot.com",
  messagingSenderId: "852278279567",
  appId: "1:852278279567:web:ab70eed7438fd36286dffa",
  measurementId: "G-Z972CZ47DQ",
};

// Initialize Firebase
export const FireApp = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
