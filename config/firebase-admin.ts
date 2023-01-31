import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import {getStorage,} from 'firebase-admin/storage';
import {getAuth} from 'firebase-admin/auth';
import admin from "firebase-admin"
const serviceAccount = require('../firebase-admin.json');

if(!admin.apps.length && serviceAccount) {
    
    initializeApp({
        credential: cert(serviceAccount)
    });
    
}

const adminFiredb = getFirestore();
const adminAuth = getAuth();
const adminStorage = getStorage()

export { adminFiredb, adminAuth, adminStorage };