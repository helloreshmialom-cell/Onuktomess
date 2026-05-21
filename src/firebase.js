import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, onValue, update } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAbS6RZ2bVCeSYQh0SX6b4mcH2n86VZPQA",
  authDomain: "forhadmess.firebaseapp.com",
  databaseURL: "https://forhadmess-default-rtdb.firebaseio.com",
  projectId: "forhadmess",
  storageBucket: "forhadmess.firebasestorage.app",
  messagingSenderId: "581658720384",
  appId: "1:581658720384:web:fc8b2553fe7ba58aa74e65",
  measurementId: "G-74Z51S7HGL"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

export { ref, set, get, onValue, update };
