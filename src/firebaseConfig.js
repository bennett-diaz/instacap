import { initializeApp } from "firebase/app";
import { getPerformance } from "firebase/performance";
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import "firebase/compat/auth";
import compatApp from "firebase/compat/app";
import { getRemoteConfig } from 'firebase/remote-config';
import { getFirestore } from 'firebase/firestore';


// to deploy to firebase URL, run this in the CLI:
// firebase deploy

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
    apiKey: "AIzaSyAJjD0525MWsFEBtBuk5DpSIhzkjY7eli8",
    authDomain: "instacap-gemini-firebase.firebaseapp.com",
    projectId: "instacap-gemini-firebase",
    storageBucket: "instacap-gemini-firebase.appspot.com",
    messagingSenderId: "640160133965",
    appId: "1:640160133965:web:582748980c9a1626febd04"
};

const app = initializeApp(firebaseConfig);
compatApp.initializeApp(firebaseConfig);

export const functions = getFunctions(app);
export const perf = getPerformance(app);
// export const myPerformanceObj = getPerformance();
export const myAuthObj = compatApp.auth()
export const myReConfigObj = getRemoteConfig();
export const db = getFirestore(app);

// export const myAuthObj = getAuth(app);
// export const analytics = getAnalytics(app);


if (process.env.NODE_ENV === 'development') {
    connectFunctionsEmulator(functions, 'localhost', 5002);
}


// MIGRATE TO BELOW
// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// // import { } from 'firebase/performance';




