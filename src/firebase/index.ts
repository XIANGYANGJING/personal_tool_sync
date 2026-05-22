import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAvRja9uMvw50xWs3S2_g1mzYkpz8Wgga4",
  authDomain: "self-improvement-b3fe9.firebaseapp.com",
  projectId: "self-improvement-b3fe9",
  storageBucket: "self-improvement-b3fe9.firebasestorage.app",
  messagingSenderId: "934329541551",
  appId: "1:934329541551:web:126a7e59ac8d4d3dd4055a",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const signIn = () => import('firebase/auth').then(({ signInAnonymously }) => signInAnonymously(auth));

export { subscribeToGoals, addGoalToFirestore, updateGoalInFirestore, deleteGoalFromFirestore } from './firestore';
export { subscribeToActions, addActionToFirestore, deleteActionFromFirestore } from './firestore';
export { subscribeToActionLogs, addActionLogToFirestore, deleteActionLogFromFirestore, subscribeToGoalLogs } from './firestore';
export { subscribeToPrinciples, addPrincipleToFirestore, updatePrincipleHit } from './firestore';
export { subscribeToAchievements, addAchievementToFirestore } from './firestore';