// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const initAuth = () => {
      try {
        const token = localStorage.getItem('access_token');
        const savedUser = localStorage.getItem('user');
        
        console.log('Initializing auth - Token exists:', !!token);
        console.log('Initializing auth - User exists:', !!savedUser);
        
        if (token && savedUser) {
          const userData = JSON.parse(savedUser);
          console.log('Restored user from localStorage:', userData);
          setUser(userData);
        } else {
          console.log('No auth data found in localStorage');
        }
      } catch (error) {
        console.error('Error loading auth from localStorage:', error);
        // Clear corrupted data
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const data = await authAPI.login(credentials);
      
      // Extract user from the response structure: { success: true, data: { user, token } }
      const userData = data.data?.user || data.user || data;
      
      console.log('Login response:', data);
      console.log('Extracted user:', userData);
      
      // Set user state
      setUser(userData);
      
      // Double-check localStorage has the data
      const savedToken = localStorage.getItem('access_token');
      const savedUser = localStorage.getItem('user');
      console.log('After login - Token saved:', !!savedToken);
      console.log('After login - User saved:', !!savedUser);
      
      // Return with user data to ensure it's available immediately
      return { success: true, data, user: userData };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const data = await authAPI.register(userData);
      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};