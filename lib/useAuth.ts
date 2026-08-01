'use client';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase';

interface AuthState {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
}

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAdmin: false,
    loading: true,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setState({ user: null, isAdmin: false, loading: false });
        return;
      }

      try {
        const tokenResult = await currentUser.getIdTokenResult();
        const isAdmin = tokenResult.claims.admin === true;
        setState({ user: currentUser, isAdmin, loading: false });
      } catch (error) {
        console.warn('Could not refresh auth token claims:', error);
        setState({ user: currentUser, isAdmin: false, loading: false });
      }
    });

    return () => unsubscribe();
  }, []);

  return state;
}