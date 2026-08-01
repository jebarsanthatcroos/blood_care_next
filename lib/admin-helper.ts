/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from './firebase';
import { doc, getDoc, setDoc, } from 'firebase/firestore';


let adminCache: { [uid: string]: { isAdmin: boolean; timestamp: number } } = {};
const CACHE_DURATION = 5 * 60 * 1000; 

export async function checkAdminStatusWithCache(uid: string): Promise<boolean> {

  if (adminCache[uid] && (Date.now() - adminCache[uid].timestamp) < CACHE_DURATION) {
    console.log('Admin status from cache:', adminCache[uid].isAdmin);
    return adminCache[uid].isAdmin;
  }

  if (!navigator.onLine) {
    console.warn('Device is offline, returning cached or default admin status');
    return adminCache[uid]?.isAdmin || false;
  }

  try {
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Timeout')), 5000);
    });

    const docPromise = getDoc(doc(db, 'users', uid));
    const userDoc = await Promise.race([docPromise, timeoutPromise]) as any;

    if (userDoc?.exists()) {
      const userData = userDoc.data();
      const isAdmin = userData?.role === 'admin' || userData?.isAdmin === true;

      adminCache[uid] = {
        isAdmin,
        timestamp: Date.now()
      };
      
      console.log('Admin status from Firestore:', isAdmin);
      return isAdmin;
    } else {
      try {
        await setDoc(doc(db, 'users', uid), {
          uid: uid,
          role: 'user',
          isAdmin: false,
          createdAt: new Date().toISOString()
        });
      } catch (error) {
        console.warn('Could not create user document:', error);
      }
      
      adminCache[uid] = {
        isAdmin: false,
        timestamp: Date.now()
      };
      
      return false;
    }
  } catch (error: any) {
    console.error('Error checking admin status:', error);
    
  
    if (error.message?.includes('offline') || error.message?.includes('Timeout')) {
      return adminCache[uid]?.isAdmin || false;
    }
    
    return false;
  }
}

export function clearAdminCache(uid?: string) {
  if (uid) {
    delete adminCache[uid];
  } else {
    adminCache = {};
  }
}


export function setAdminCache(uid: string, isAdmin: boolean) {
  adminCache[uid] = {
    isAdmin,
    timestamp: Date.now()
  };
}

export function isOnline(): boolean {
  return typeof navigator !== 'undefined' && navigator.onLine;
}