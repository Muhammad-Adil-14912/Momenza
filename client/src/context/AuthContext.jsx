import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('momenza_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('momenza_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('momenza_token');
      if (savedToken) {
        try {
          const res = await api.get('/auth/me');
          if (res.data?.success) {
            setUser(res.data.user);
            localStorage.setItem('momenza_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.warn('Session expired or invalid token:', err.message);
          localStorage.removeItem('momenza_token');
          localStorage.removeItem('momenza_user');
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const handleAuthSuccess = (tokenStr, userData) => {
    setToken(tokenStr);
    setUser(userData);
    localStorage.setItem('momenza_token', tokenStr);
    localStorage.setItem('momenza_user', JSON.stringify(userData));
  };

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data?.success) {
      handleAuthSuccess(res.data.token, res.data.user);
      return res.data;
    }
    throw new Error(res.data?.message || 'Login failed');
  };

  const register = async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password });
    if (res.data?.success) {
      handleAuthSuccess(res.data.token, res.data.user);
      return res.data;
    }
    throw new Error(res.data?.message || 'Registration failed');
  };

  const demoLogin = async () => {
    const res = await api.post('/auth/demo');
    if (res.data?.success) {
      handleAuthSuccess(res.data.token, res.data.user);
      return res.data;
    }
    throw new Error(res.data?.message || 'Demo login failed');
  };

  const googleLogin = async (googleProfile) => {
    const res = await api.post('/auth/google', googleProfile);
    if (res.data?.success) {
      handleAuthSuccess(res.data.token, res.data.user);
      return res.data;
    }
    throw new Error(res.data?.message || 'Google authentication failed');
  };

  const logout = () => {
    localStorage.removeItem('momenza_token');
    localStorage.removeItem('momenza_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: Boolean(token && user),
        login,
        register,
        demoLogin,
        googleLogin,
        logout
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
