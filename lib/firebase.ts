import { initializeApp, getApps, getApp } from "firebase/app";
import type { FirebaseApp } from "firebase/app";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";
import type { Firestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import type { Auth, GoogleAuthProvider as GoogleAuthProviderType, GithubAuthProvider as GithubAuthProviderType } from "firebase/auth";
import { getStorage } from "firebase/storage";
import type { FirebaseStorage } from "firebase/storage";

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

function isClientEnvironment() {
  return typeof globalThis !== 'undefined' && typeof globalThis.window !== 'undefined' && typeof globalThis.document !== 'undefined';
}

function initializeClientFirebase() {
  if (app || !isClientEnvironment()) {
    return;
  }

  const firebaseApp = initFirebase();
  if (!firebaseApp) {
    return;
  }

  app = firebaseApp;

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

if (isClientEnvironment()) {
  initializeClientFirebase();
}

export function getFirebaseAuth() {
  if (!auth && isClientEnvironment()) {
    initializeClientFirebase();
  }

  return auth;
}

export function getFirebaseDb() {
  if (!db && isClientEnvironment()) {
    initializeClientFirebase();
  }

  return db;
}

export function getFirebaseStorage() {
  if (!storage && isClientEnvironment()) {
    initializeClientFirebase();
  }

  return storage;
}

export function getFirebaseProviders() {
  if ((!googleProvider || !githubProvider) && isClientEnvironment()) {
    initializeClientFirebase();
  }

  return { googleProvider, githubProvider };
}

export { auth, db, storage, googleProvider, githubProvider };