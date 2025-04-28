// services/authService.js
import { auth, db } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

// Register a new user
export const register = async (email, password, displayName = '') => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  await sendEmailVerification(user);

  // Create user record in Firestore
  const userDoc = doc(db, 'users', user.uid);
  await setDoc(userDoc, {
    uid: user.uid,
    email: user.email,
    displayName,
    avatarUrl: '',
    role: 'operator',
    createdAt: Date.now()
  });

  return user;
};

// Login existing user
export const login = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Logout current user
export const logout = () => {
  return signOut(auth);
};

// Listen to auth changes
export const observeAuth = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Fetch user data from Firestore
export const getUserProfile = async (uid) => {
  const userDoc = await getDoc(doc(db, 'users', uid));
  return userDoc.exists() ? userDoc.data() : null;
};