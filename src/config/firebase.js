import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth, GoogleAuthProvider} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyDxL8uQD7GKR0C_rdHKSfFBdX17TkeIFJQ",
    authDomain: "rv-connect-98f7a.firebaseapp.com",
    projectId: "rv-connect-98f7a",
    storageBucket: "rv-connect-98f7a.appspot.com",
    messagingSenderId: "47057202049",
    appId: "1:47057202049:web:012631b67544e3247a5680",
    measurementId: "G-14BFJCW4HB",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);