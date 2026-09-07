'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { User, UserRole } from '../lib/firestore-types';
import { friendlyAuthError } from '../lib/auth-errors';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, phone?: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch user data from Firestore
  const fetchUserData = async (firebaseUser: FirebaseUser): Promise<User | null> => {
    try {
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (userDoc.exists()) {
        const userData = { id: userDoc.id, ...userDoc.data() } as User;

        // Keep the Firestore doc's emailVerified in sync with Firebase Auth
        if (firebaseUser.emailVerified && !userData.emailVerified) {
          await updateDoc(doc(db, 'users', firebaseUser.uid), {
            emailVerified: true,
            updatedAt: Timestamp.now()
          });
          userData.emailVerified = true;
        }

        return userData;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  };

  // Exchange a fresh ID token for the HttpOnly session cookie middleware relies on
  const createSessionCookie = async (firebaseUser: FirebaseUser) => {
    try {
      const idToken = await firebaseUser.getIdToken();
      await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken })
      });
    } catch (error) {
      console.error('Error creating session cookie:', error);
    }
  };

  const clearSessionCookie = async () => {
    try {
      await fetch('/api/auth/session', { method: 'DELETE' });
    } catch (error) {
      console.error('Error clearing session cookie:', error);
    }
  };

  // Monitor auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setFirebaseUser(firebaseUser);
        const userData = await fetchUserData(firebaseUser);
        setUser(userData);
      } else {
        setFirebaseUser(null);
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const result = await signInWithEmailAndPassword(auth, email, password);
      await createSessionCookie(result.user);
      const userData = await fetchUserData(result.user);
      setUser(userData);

      toast.success('Successfully signed in!');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast.error(friendlyAuthError(error, 'Failed to sign in'));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string, name: string, phone?: string) => {
    try {
      setLoading(true);
      
      // Create user in Firebase Auth
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile
      await updateProfile(result.user, { displayName: name });
      
      // Create user document in Firestore
      const userData: Omit<User, 'id'> = {
        name,
        email,
        emailVerified: false,
        image: null,
        imagePublicId: null,
        role: UserRole.MEMBER,
        bio: null,
        phone: phone || null,
        address: null,
        gender: null,
        dateOfBirth: null,
        occupation: null,
        maritalStatus: null,
        anniversary: null,
        joinedChurchDate: null,
        emergencyContact: null,
        notificationPrefs: null,
        theme: null,
        privacySettings: null,
        departmentIds: [],
        ledDepartmentIds: [],
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };
      
      await setDoc(doc(db, 'users', result.user.uid), userData);

      // Send email verification
      await sendEmailVerification(result.user);

      await createSessionCookie(result.user);

      // Fetch updated user data
      const newUserData = await fetchUserData(result.user);
      setUser(newUserData);

      toast.success('Account created! Please check your email for verification.');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast.error(friendlyAuthError(error, 'Failed to create account'));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await createSessionCookie(result.user);

      // Check if user exists in Firestore
      let userData = await fetchUserData(result.user);
      
      // If user doesn't exist, create new user document
      if (!userData) {
        const newUserData: Omit<User, 'id'> = {
          name: result.user.displayName || 'Unknown',
          email: result.user.email || '',
          emailVerified: result.user.emailVerified,
          image: result.user.photoURL,
          imagePublicId: null,
          role: UserRole.MEMBER,
          bio: null,
          phone: null,
          address: null,
          gender: null,
          dateOfBirth: null,
          occupation: null,
          maritalStatus: null,
          anniversary: null,
          joinedChurchDate: null,
          emergencyContact: null,
          notificationPrefs: null,
          theme: null,
          privacySettings: null,
          departmentIds: [],
          ledDepartmentIds: [],
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        };
        
        await setDoc(doc(db, 'users', result.user.uid), newUserData);
        userData = await fetchUserData(result.user);
      }
      
      setUser(userData);
      toast.success('Successfully signed in with Google!');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Google sign in error:', error);
      toast.error(friendlyAuthError(error, 'Failed to sign in with Google'));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
      await clearSessionCookie();
      setUser(null);
      setFirebaseUser(null);
      toast.success('Successfully signed out');
      router.push('/');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error('Failed to sign out');
      throw error;
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent!');
    } catch (error: any) {
      console.error('Reset password error:', error);
      toast.error(friendlyAuthError(error, 'Failed to send reset email'));
      throw error;
    }
  };

  // Update user profile
  const updateUserProfile = async (data: Partial<User>) => {
    if (!firebaseUser || !user) {
      throw new Error('No authenticated user');
    }

    try {
      setLoading(true);

      // Never allow self-service writes to privileged/identity fields
      const {
        id,
        role,
        email,
        emailVerified,
        departmentIds,
        ledDepartmentIds,
        createdAt,
        ...safeData
      } = data;

      const updateData = {
        ...safeData,
        updatedAt: Timestamp.now()
      };

      await updateDoc(doc(db, 'users', firebaseUser.uid), updateData);
      
      // Update local state
      setUser(prev => prev ? { ...prev, ...updateData } : null);
      
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      console.error('Update profile error:', error);
      toast.error('Failed to update profile');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Refresh user data
  const refreshUser = async () => {
    if (!firebaseUser) return;
    
    try {
      const userData = await fetchUserData(firebaseUser);
      setUser(userData);
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  const value: AuthContextType = {
    user,
    firebaseUser,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    logout,
    resetPassword,
    updateUserProfile,
    refreshUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};