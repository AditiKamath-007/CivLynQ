import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithGoogle as fbSignInWithGoogle, 
  signInWithEmail as fbSignInWithEmail,
  signUpWithEmail as fbSignUpWithEmail,
  logout as fbLogout,
  getIdToken
} from '../services/firebase';
import { setAuthToken } from '../services/api';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const userToken = await getIdToken(user);
          setAuthToken(userToken);
          setToken(userToken);
          setCurrentUser(user);
        } catch (error) {
          console.error('Error fetching token:', error);
          setAuthToken(null);
          setToken(null);
          setCurrentUser(null);
        }
      } else {
        setAuthToken(null);
        setToken(null);
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  /**
   * Google popup sign-in (existing behavior).
   */
  const login = async () => {
    setLoading(true);
    try {
      const result = await fbSignInWithGoogle();
      const userToken = await getIdToken(result.user);
      setAuthToken(userToken);
      setToken(userToken);
      setCurrentUser(result.user);
      return result.user;
    } catch (error) {
      console.error('Login error:', error);
      setAuthToken(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Email + password sign-in (Firebase Auth).
   */
  const loginWithEmail = async (email, password) => {
    setLoading(true);
    try {
      const result = await fbSignInWithEmail(email, password);
      const userToken = await getIdToken(result.user);
      setAuthToken(userToken);
      setToken(userToken);
      setCurrentUser(result.user);
      return result.user;
    } catch (error) {
      console.error('Email login error:', error);
      setAuthToken(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Email + password sign-up (creates account + sets displayName).
   */
  const signup = async (email, password, displayName) => {
    setLoading(true);
    try {
      const result = await fbSignUpWithEmail(email, password, displayName);
      const userToken = await getIdToken(result.user);
      setAuthToken(userToken);
      setToken(userToken);
      setCurrentUser(result.user);
      return result.user;
    } catch (error) {
      console.error('Signup error:', error);
      setAuthToken(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await fbLogout();
      setAuthToken(null);
      setToken(null);
      setCurrentUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data) => {
    setLoading(true);
    try {
      // Mock update for now since updateUserProfile was removed from firebase.js
      const updatedUser = { ...currentUser, ...data };
      setCurrentUser(updatedUser);
      // Optional: Save mock user to localStorage if needed
      if (localStorage.getItem('mock_user')) {
        localStorage.setItem('mock_user', JSON.stringify(updatedUser));
      }
      return updatedUser;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentUser,
    user: currentUser,
    token,
    loading,
    isAuthenticated: !!currentUser,
    login,
    loginWithEmail,
    signup,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
