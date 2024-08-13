import "firebase/compat/auth";
import compatApp from "firebase/compat/app";
import { getRemoteConfig } from 'firebase/remote-config';
import { getPerformance } from "firebase/performance";
// import { getAuth } from "firebase/auth";

import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import { getFirestore } from 'firebase/firestore';
// import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyAJjD0525MWsFEBtBuk5DpSIhzkjY7eli8",
    authDomain: "instacap.ai",
    projectId: "instacap-gemini-firebase",
    storageBucket: "instacap-gemini-firebase.appspot.com",
    messagingSenderId: "640160133965",
    appId: "1:640160133965:web:582748980c9a1626febd04"
};

// const app = initializeApp(firebaseConfig);
compatApp.initializeApp(firebaseConfig);



export const functions = getFunctions();
export const perf = getPerformance();
// export const myPerformanceObj = getPerformance();
export const myAuthObj = compatApp.auth()
export const myReConfigObj = getRemoteConfig();
export const db = getFirestore();

// export const myAuthObj = getAuth(app);
// export const analytics = getAnalytics(app);


if (process.env.NODE_ENV === 'development') {
    connectFunctionsEmulator(functions, 'localhost', 5001);
}


// MIGRATE TO BELOW
// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// // import { } from 'firebase/performance';




