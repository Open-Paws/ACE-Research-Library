import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null); // 'admin' or 'user'

  useEffect(() => {
    // Check if user is logged in from localStorage
    const auth = localStorage.getItem('ace_auth');
    if (auth) {
      const { isAuthenticated: authStatus, role } = JSON.parse(auth);
      setIsAuthenticated(authStatus);
      setUserRole(role);
    }
  }, []);

  const login = (username, password, role = 'user') => {
    // Hardcoded admin credentials
    if (role === 'admin') {
      if (username === 'admin' && password === 'admin123') {
        setIsAuthenticated(true);
        setUserRole('admin');
        localStorage.setItem('ace_auth', JSON.stringify({ isAuthenticated: true, role: 'admin' }));
        return { success: true };
      } else {
        return { success: false, error: 'Invalid admin credentials' };
      }
    } else {
      // For users, no login required (public access)
      setIsAuthenticated(true);
      setUserRole('user');
      localStorage.setItem('ace_auth', JSON.stringify({ isAuthenticated: true, role: 'user' }));
      return { success: true };
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    localStorage.removeItem('ace_auth');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

