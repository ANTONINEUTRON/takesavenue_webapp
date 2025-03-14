import { getApp, getApps, initializeApp } from "firebase-admin/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase-admin/firestore";
import { credential } from "firebase-admin";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase-admin/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    type: process.env.FIREBASE_TYPE,
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    clientId: process.env.FIREBASE_CLIENT_ID,
    authUri: process.env.FIREBASE_AUTH_URI,
    tokenUri: process.env.FIREBASE_TOKEN_URI,
    authProviderX509CertUrl: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
    clientX509CertUrl: process.env.FIREBASE_CLIENT_CERT_URL,
};

var admin = require("firebase-admin");

const app = getApps().length !==0 
    ? getApps()[0]
    : admin.initializeApp({credential: admin.credential.cert(firebaseConfig)});
    
export const cFirestore = getFirestore(app)
export const cAuth = getAuth(app);