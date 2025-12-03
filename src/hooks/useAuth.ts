// src/hooks/useAuth.ts
'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/firebase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const auth = getFirebaseAuth();

      if (!auth) {
        console.warn('Firebase não está disponível');
        setLoading(false);
        return;
      }

      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        setUser(firebaseUser);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('Erro ao inicializar autenticação:', error);
      setLoading(false);
    }
  }, []);

  return { user, loading };
}
