import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// import other services you might use

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY, // Use environment variables
  authDomain: "au-central-hub.firebaseapp.com",
  projectId: "au-central-hub",
  storageBucket: "au-central-hub.appspot.com",
  messagingSenderId: "397094455801",
  appId: "1:397094455801:web:cbd2e4e74d08a770d35528",
  measurementId: "G-296K3B20XK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export { auth };
