// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB_LLvVAFpEUDyMtpJtHQBv8T_IOXExq7w",
  authDomain: "social-blog-8f138.firebaseapp.com",
  projectId: "social-blog-8f138",
  storageBucket: "social-blog-8f138.appspot.com",
  messagingSenderId: "132036502824",
  appId: "1:132036502824:web:64ec4a699b36f92b735c1d",
  measurementId: "G-71D5SSL7MW",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };

export default app;
