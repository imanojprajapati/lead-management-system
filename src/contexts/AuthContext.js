import React, { createContext, useContext, useState, useEffect } from 'react';
import { message } from 'antd';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data on mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      // In a real app, this would be an API call
      if (username === 'admin' && password === 'admin') {
        const adminUser = {
          id: 1,
          username: 'admin',
          name: 'Admin User',
          role: 'admin',
          email: 'admin@example.com',
          permissions: ['dashboard', 'leads', 'users', 'analytics']
        };
        setUser(adminUser);
        localStorage.setItem('user', JSON.stringify(adminUser));
        message.success('Welcome back, Admin!');
        return { success: true, redirectTo: '/dashboard' };
      } else if (username === 'emp123' && password === 'emp123') {
        const staffUser = {
          id: 2,
          username: 'emp123',
          name: 'Staff User',
          role: 'staff',
          email: 'staff@example.com',
          permissions: ['leads']
        };
        setUser(staffUser);
        localStorage.setItem('user', JSON.stringify(staffUser));
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
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    message.success('Logged out successfully');
  };

  const updateUser = (userData) => {
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const hasPermission = (permission) => {
    return user?.permissions?.includes(permission) || false;
  };

  const value = {
    user,
    loading,
    login,
    logout,
    updateUser,
    hasPermission,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isStaff: user?.role === 'staff'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 