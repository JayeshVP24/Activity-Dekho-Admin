import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import {getStorage,} from 'firebase-admin/storage';
import {getAuth} from 'firebase-admin/auth';
import admin, { credential } from "firebase-admin"
import fetch from "node-fetch"
// const serviceAccount = require('../firebase-admin.json');

const credUrl = process.env.CREDENTIALS_PATH as string
const credKey = process.env.CREDENTIALS_KEY as string

const url = credUrl + "&token=" + encodeURIComponent(credKey)

const serviceAccount2 = await fetch(url).then((res) => res.json())
// console.log(serviceAccount2)

if(!admin.apps.length && serviceAccount2) {
    
    initializeApp({
        credential: credential.cert(serviceAccount2),
    });
    
}

const adminFiredb = getFirestore();
const adminAuth = getAuth();
const adminStorage = getStorage()

export { adminFiredb, adminAuth, adminStorage };