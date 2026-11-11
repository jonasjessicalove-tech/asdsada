import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updatePassword
} from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  changePassword: (newPass: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Check local mock admin session for admin@x.com if Firebase Auth has not provisioned the user yet
  const [isLocalAdmin, setIsLocalAdmin] = useState<boolean>(() => {
    return localStorage.getItem('savio_admin_session') === 'true';
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Check if admin
        const adminEmail = currentUser.email?.toLowerCase();
        if (
          adminEmail === 'jonasjessicalove@gmail.com' ||
          adminEmail === 'admin@x.com'
        ) {
          setIsAdmin(true);
          try {
            await setDoc(doc(db, 'admins', currentUser.uid), {
              uid: currentUser.uid,
              email: currentUser.email,
              role: 'admin',
              createdAt: new Date().toISOString()
            }, { merge: true });
          } catch {
            // ignore
          }
        } else {
          try {
            const adminDoc = await getDoc(doc(db, 'admins', currentUser.uid));
            setIsAdmin(adminDoc.exists());
          } catch {
            setIsAdmin(false);
          }
        }
      } else {
        setIsAdmin(isLocalAdmin);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isLocalAdmin]);

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const loginWithEmail = async (email: string, pass: string) => {
    const cleanEmail = email.trim().toLowerCase();
    
    // First attempt genuine Firebase authentication
    try {
      await signInWithEmailAndPassword(auth, cleanEmail, pass);
      return;
    } catch (fbErr: any) {
      // If user is not yet created in Firebase Auth for initial admin@x.com / admin4321, auto-provision
      if (cleanEmail === 'admin@x.com') {
        if (fbErr.code === 'auth/user-not-found' || fbErr.code === 'auth/invalid-credential') {
          try {
            await createUserWithEmailAndPassword(auth, cleanEmail, pass);
            return;
          } catch {
            // Fallback to local admin session if Email Auth provider is disabled in Firebase console
            if (pass === 'admin4321' || localStorage.getItem('savio_admin_custom_pass') === pass) {
              localStorage.setItem('savio_admin_session', 'true');
              setIsLocalAdmin(true);
              setIsAdmin(true);
              return;
            }
          }
        }

        // Direct check for default temporary credentials
        if (pass === 'admin4321' || localStorage.getItem('savio_admin_custom_pass') === pass) {
          localStorage.setItem('savio_admin_session', 'true');
          setIsLocalAdmin(true);
          setIsAdmin(true);
          return;
        }
      }
      throw fbErr;
    }
  };

  const logout = async () => {
    localStorage.removeItem('savio_admin_session');
    setIsLocalAdmin(false);
    setIsAdmin(false);
    await signOut(auth);
  };

  const changePassword = async (newPass: string) => {
    if (auth.currentUser) {
      await updatePassword(auth.currentUser, newPass);
    } else {
      localStorage.setItem('savio_admin_custom_pass', newPass);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin: isAdmin || isLocalAdmin,
        loading,
        loginWithGoogle,
        loginWithEmail,
        logout,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
