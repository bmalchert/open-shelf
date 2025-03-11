// client/src/context/AuthContext.js
import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set up axios defaults
  const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  
  // Create an axios instance with base URL
  const api = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  // Add token to requests if it exists
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['x-auth-token'] = token;
    } else {
      delete api.defaults.headers.common['x-auth-token'];
    }
  }, [token, api.defaults.headers.common]);

  // Load user from token
  const loadUser = useCallback(async () => {
    setLoading(true);
    
    if (token) {
      try {
        const res = await api.get('/api/auth/me');
        setUser(res.data);
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Load user error:', err);
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        setError('Session expired. Please log in again.');
      }
    }
    
    setLoading(false);
  }, [token, api]);

  // Load user on initial app load and when token changes
  useEffect(() => {
    loadUser();
  }, [token, loadUser]);

  // Register user
  const register = async (userData) => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.post('/api/auth/register', userData);
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      await loadUser();
      return true;
    } catch (err) {
      console.error('Register error:', err);
      setError(
        err.response?.data?.msg || 
        'Registration failed. Please try again.'
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.post('/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      await loadUser();
      return true;
    } catch (err) {
      console.error('Login error:', err);
      setError(
        err.response?.data?.msg || 
        'Invalid credentials. Please try again.'
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.put('/api/users/profile', profileData);
      setUser(res.data);
      return true;
    } catch (err) {
      console.error('Update profile error:', err);
      setError(
        err.response?.data?.msg || 
        'Failed to update profile. Please try again.'
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    setLoading(true);
    setError(null);

    try {
      await api.put('/api/users/password', { currentPassword, newPassword });
      return true;
    } catch (err) {
      console.error('Change password error:', err);
      setError(
        err.response?.data?.msg || 
        'Failed to change password. Please try again.'
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Clear any errors
  const clearError = () => setError(null);

  return (
    <AuthContext.Provider 
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        error,
        register,
        login,
        logout,
        updateProfile,
        changePassword,
        clearError,
        api
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;