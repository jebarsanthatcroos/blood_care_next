/* eslint-disable @typescript-eslint/no-require-imports */
import { initializeApp, getApps, getApp } from "firebase/app";
import type { FirebaseApp } from "firebase/app";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";
import type { Firestore } from "firebase/firestore";
import type { Auth } from "firebase/auth";
import type { FirebaseStorage } from "firebase/storage";
import type { GoogleAuthProvider as GoogleAuthProviderType, GithubAuthProvider as GithubAuthProviderType } from "firebase/auth";

const clientCredentials = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

function isBuildLikeEnvironment() {
  return process.env.NEXT_PHASE === "phase-production-build" || process.env.CI === "true";
}

function hasFirebaseConfig() {
  return Boolean(
    clientCredentials.apiKey &&
      clientCredentials.authDomain &&
      clientCredentials.projectId &&
      clientCredentials.appId
  );
}

function initFirebase() {
  if (getApps().length > 0) {
    return getApp();
  }

  if (!hasFirebaseConfig() || isBuildLikeEnvironment()) {
    return null;
  }

  return initializeApp(clientCredentials);
}

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;
let googleProvider: GoogleAuthProviderType | null = null;
let githubProvider: GithubAuthProviderType | null = null;

function initializeClientFirebase() {
  if (app) {
    return;
  }

  const firebaseApp = initFirebase();
  if (!firebaseApp) {
    return;
  }

  app = firebaseApp;

  const { getAuth, GoogleAuthProvider, GithubAuthProvider } = require('firebase/auth') as typeof import('firebase/auth');
  const { getStorage } = require('firebase/storage') as typeof import('firebase/storage');

  auth = getAuth(firebaseApp);
  db = initializeFirestore(firebaseApp, {
    localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
  });
  storage = getStorage(firebaseApp);
  googleProvider = new GoogleAuthProvider();
  githubProvider = new GithubAuthProvider();

  googleProvider.setCustomParameters({
    prompt: 'select_account',
  });

  githubProvider.setCustomParameters({
    prompt: 'select_account',
  });
}

initializeClientFirebase();

export { auth, db, storage, googleProvider, githubProvider };