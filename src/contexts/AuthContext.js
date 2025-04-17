import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { message } from 'antd';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Memoize user data to prevent unnecessary re-renders
  const userData = useMemo(() => ({
    admin: {
      id: 1,
      username: 'admin',
      name: 'Admin User',
      role: 'admin',
      email: 'admin@example.com',
      permissions: ['dashboard', 'leads', 'users', 'analytics']
    },
    staff: {
      id: 2,
      username: 'emp123',
      name: 'Staff User',
      role: 'staff',
      email: 'staff@example.com',
      permissions: ['leads']
    }
  }), []);

  useEffect(() => {
    // Check for stored user data on mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (username, password) => {
    try {
      // In a real app, this would be an API call
      if (username === 'admin' && password === 'admin') {
        setUser(userData.admin);
        localStorage.setItem('user', JSON.stringify(userData.admin));
        message.success('Welcome back, Admin!');
        return { success: true, redirectTo: '/dashboard' };
      } else if (username === 'emp123' && password === 'emp123') {
        setUser(userData.staff);
        localStorage.setItem('user', JSON.stringify(userData.staff));
        message.success('Welcome back!');
        return { success: true, redirectTo: '/dashboard/leads' };
      } else {
        message.error('Invalid credentials');
        return { success: false };
      }
    } catch (error) {
      message.error('Login failed. Please try again.');
      return { success: false };
    }
  }, [userData]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
    message.success('Logged out successfully');
  }, []);

  const updateUser = useCallback((userData) => {
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }, [user]);

  const hasPermission = useCallback((permission) => {
    return user?.permissions?.includes(permission) || false;
  }, [user]);

  const value = useMemo(() => ({
    user,
    loading,
    login,
    logout,
    updateUser,
    hasPermission,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isStaff: user?.role === 'staff'
  }), [user, loading, login, logout, updateUser, hasPermission]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 