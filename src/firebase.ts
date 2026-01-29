import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD_3krWXxOk-cRqu5DHl5k_jWEySl7dfiU",
  authDomain: "scheduler-a63a0.firebaseapp.com",
  projectId: "scheduler-a63a0",
  storageBucket: "scheduler-a63a0.firebasestorage.app",
  messagingSenderId: "639950737633",
  appId: "1:639950737633:web:c7fba963b09f78433da7a0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

console.log('[Firebase] Initialized successfully');
console.log('Project ID:', firebaseConfig.projectId);

// Enable offline persistence for Electron desktop app
enableIndexedDbPersistence(db)
  .then(() => {
    console.log('[Firebase] Offline persistence enabled');
  })
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn(
        '[Firebase] Multiple tabs open: offline persistence can only be enabled in one tab at a time.'
      );
    } else if (err.code === 'unimplemented') {
      console.warn('[Firebase] Browser does not support offline persistence');
    } else {
      console.error('[Firebase] Error enabling persistence:', err);
    }
  });
