import PropTypes from 'prop-types';
import { createContext, useEffect, useState } from 'react';
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider
} from 'firebase/auth';
import axios from 'axios';
import { auth } from '../firebase/firebase.config';
import usePublic from '../Hooks/usePublic';

export const AuthContext = createContext(null);
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const axiosPublic = usePublic()
  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  const resetPassword = email => {
    setLoading(true);
    return sendPasswordResetEmail(auth, email);
  };

  const logOut = async () => {
    setLoading(true);
    await axios.get(`${import.meta.env.VITE_API_URL}/logout`, {
      withCredentials: true,
    });
    return signOut(auth);
  };

  const updateUserProfile = async (name, photo) => {
    if (!auth.currentUser) return;
    await updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photo,
    });
  };

  const updateUserEmail = async (newEmail, currentPassword) => {
    if (!auth.currentUser) return;

    try {
      // Reauthenticate before updating email
      const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);

      // Update email
      await updateEmail(auth.currentUser, newEmail);
      return { success: true, message: "Email updated successfully" };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const updateUserPassword = async (newPassword, currentPassword) => {
    if (!auth.currentUser) return;

    try {
      // Reauthenticate before updating password
      const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);

      // Update password
      await updatePassword(auth.currentUser, newPassword);
      return { success: true, message: "Password updated successfully" };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };
  // onAuthStateChange
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
  
      if (currentUser) {
        const userInfo = { email: currentUser.email };
        axiosPublic.post('/api/jwt', userInfo, { withCredentials: true })
          .then(res => {
      
            if (res.data.token) {
              localStorage.setItem('token', res.data.token);
              setLoading(false);
            }
          })
      } else {
        localStorage.removeItem('token');
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [axiosPublic]);


  
  const authInfo = {
    user,
    loading,
    setLoading,
    createUser,
    signIn,
    signInWithGoogle,
    resetPassword,
    logOut,
    updateUserProfile,
    updateUserEmail,
    updateUserPassword,
  };

  return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.array,
};

export default AuthProvider;
