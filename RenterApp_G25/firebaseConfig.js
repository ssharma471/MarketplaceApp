// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD-QPv2mRUKFWC1N-jTVCK_uOueyh3bRTw",
  authDomain: "marketplace-c47af.firebaseapp.com",
  projectId: "marketplace-c47af",
  storageBucket: "marketplace-c47af.appspot.com",
  messagingSenderId: "809287628716",
  appId: "1:809287628716:web:50d87a004f771d4ee96c09"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Services (database, auth, etc)
const db = getFirestore(app);
const auth = getAuth(app)

export { db, auth }