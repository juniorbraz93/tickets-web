
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAMNsSY8s7jnhQ-THbRMYCJU8LErOtLbcs",
  authDomain: "tickets-web-c2df8.firebaseapp.com",
  projectId: "tickets-web-c2df8",
  storageBucket: "tickets-web-c2df8.appspot.com",
  messagingSenderId: "311042514563",
  appId: "1:311042514563:web:bb1528ae1a837578be05b6",
  measurementId: "G-JEH3M2SZ1E"
};

const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

export { auth, db, storage };