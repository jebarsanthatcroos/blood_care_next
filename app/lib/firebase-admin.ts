import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'node:fs';
import path from 'node:path';

export function getServiceAccountJson() {
  const candidates = [
    process.env.FIREBASE_SERVICE_ACCOUNT_JSON,
    process.env.FIREBASE_SERVICE_ACCOUNT_PATH && fs.existsSync(process.env.FIREBASE_SERVICE_ACCOUNT_PATH)
      ? fs.readFileSync(process.env.FIREBASE_SERVICE_ACCOUNT_PATH, 'utf8')
      : '',
    fs.existsSync('/run/secrets/firebase-service-account.json')
      ? fs.readFileSync('/run/secrets/firebase-service-account.json', 'utf8')
      : '',
    fs.existsSync(path.resolve(process.cwd(), 'serviceAccountKey.json'))
      ? fs.readFileSync(path.resolve(process.cwd(), 'serviceAccountKey.json'), 'utf8')
      : '',
  ];

  const serviceAccount = candidates.find(
    (value): value is string => typeof value === 'string' && value.trim().length > 0
  );

  if (!serviceAccount) {
    throw new Error('Firebase Admin SDK credentials are not configured. Set FIREBASE_SERVICE_ACCOUNT_JSON or provide serviceAccountKey.json.');
  }

  return serviceAccount;
}

function getCredential() {
  const serviceAccount = getServiceAccountJson();

  try {
    return cert(JSON.parse(serviceAccount));
  } catch (error) {
    throw new Error('Firebase Admin SDK credentials are invalid JSON.', { cause: error });
  }
}

function getAdminApp() {
  return getApps().length > 0
    ? getApps()[0]
    : initializeApp({ credential: getCredential() });
}

export function getAdminAuth() {
  return getAuth(getAdminApp());
}

export function getAdminDb() {
  return getFirestore(getAdminApp());
}
