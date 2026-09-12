'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile } from '@/types';
import { auth, googleProvider, isFirebaseConfigured } from '@/lib/firebase';
import { StorageManager } from '@/lib/storage';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from 'firebase/auth';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isFirebaseAvailable: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string) => Promise<void>;
  setupRecaptcha: (containerId: string) => RecaptchaVerifier | null;
  sendPhoneVerificationCode: (
    phoneNumber: string,
    verifier: RecaptchaVerifier
  ) => Promise<ConfirmationResult>;
  confirmPhoneCode: (
    confirmationResult: ConfirmationResult,
    code: string
  ) => Promise<void>;
  logOut: () => Promise<void>;
}

const GUEST_USER: UserProfile = {
  uid: 'guest-learner',
  email: 'learner@nihongoflow.local',
  displayName: 'Nihongo Learner',
  isAnonymous: true,
  joinedDate: new Date().toISOString(),
};

const AuthContext = createContext<AuthContextType>({
  user: GUEST_USER,
  loading: false,
  isFirebaseAvailable: false,
  signInWithGoogle: async () => {},
  signInWithEmail: async () => {},
  signUpWithEmail: async () => {},
  setupRecaptcha: () => null,
  sendPhoneVerificationCode: async () => ({} as ConfirmationResult),
  confirmPhoneCode: async () => {},
  logOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(GUEST_USER);
  const [loading, setLoading] = useState<boolean>(isFirebaseConfigured);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setUser(GUEST_USER);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (fbUser: User | null) => {
      if (fbUser) {
        const userProfile: UserProfile = {
          uid: fbUser.uid,
          email: fbUser.phoneNumber || fbUser.email || 'Learner',
          displayName: fbUser.displayName || fbUser.phoneNumber || fbUser.email?.split('@')[0] || 'Learner',
          isAnonymous: fbUser.isAnonymous,
          avatar: fbUser.photoURL || undefined,
          joinedDate: fbUser.metadata.creationTime || new Date().toISOString(),
        };
        setUser(userProfile);
        StorageManager.saveUserProfile(userProfile);
      } else {
        // Fallback to local guest profile so learner can still save progress locally
        setUser(GUEST_USER);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const isSigningInRef = React.useRef(false);

  const signInWithGoogle = async () => {
    if (!isFirebaseConfigured || !auth) {
      alert('Firebase is not configured yet. Operating in Guest/Local Mode.');
      return;
    }
    if (isSigningInRef.current) {
      return;
    }
    isSigningInRef.current = true;

    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '';
      // Gracefully handle popup closed or Firebase internal assertion
      if (msg.includes('Pending promise was never set') || msg.includes('popup-closed-by-user') || msg.includes('cancelled-popup-request')) {
        console.warn('Google sign-in popup was cancelled or completed:', msg);
        return;
      }
      throw err;
    } finally {
      isSigningInRef.current = false;
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    if (!isFirebaseConfigured || !auth) {
      alert('Firebase is not configured yet. Operating in Guest/Local Mode.');
      return;
    }
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const signUpWithEmail = async (email: string, pass: string) => {
    if (!isFirebaseConfigured || !auth) {
      alert('Firebase is not configured yet. Operating in Guest/Local Mode.');
      return;
    }
    await createUserWithEmailAndPassword(auth, email, pass);
  };

  // --- PHONE AUTHENTICATION HELPERS ---
  const setupRecaptcha = (containerId: string): RecaptchaVerifier | null => {
    if (!auth || typeof window === 'undefined') return null;
    try {
      return new RecaptchaVerifier(auth, containerId, {
        size: 'invisible',
        callback: () => {
          // reCAPTCHA solved
        },
        'expired-callback': () => {
          // Response expired
        },
      });
    } catch (err) {
      console.warn('RecaptchaVerifier setup error:', err);
      return null;
    }
  };

  const sendPhoneVerificationCode = async (
    phoneNumber: string,
    verifier: RecaptchaVerifier
  ): Promise<ConfirmationResult> => {
    if (!auth) throw new Error('Firebase Auth is not initialized');
    return await signInWithPhoneNumber(auth, phoneNumber, verifier);
  };

  const confirmPhoneCode = async (
    confirmationResult: ConfirmationResult,
    code: string
  ): Promise<void> => {
    const credential = await confirmationResult.confirm(code);
    const fbUser = credential.user;
    if (fbUser) {
      const userProfile: UserProfile = {
        uid: fbUser.uid,
        email: fbUser.phoneNumber || fbUser.email,
        displayName: fbUser.displayName || fbUser.phoneNumber || 'Learner',
        isAnonymous: false,
        avatar: fbUser.photoURL || undefined,
        joinedDate: fbUser.metadata.creationTime || new Date().toISOString(),
      };
      setUser(userProfile);
      StorageManager.saveUserProfile(userProfile);
    }
  };

  const logOut = async () => {
    if (auth && isFirebaseConfigured) {
      await signOut(auth);
    }
    setUser(GUEST_USER);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isFirebaseAvailable: isFirebaseConfigured,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        setupRecaptcha,
        sendPhoneVerificationCode,
        confirmPhoneCode,
        logOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
