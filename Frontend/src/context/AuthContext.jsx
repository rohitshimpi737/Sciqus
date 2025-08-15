import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        // Verify token is still valid and check user status
        authAPI.getCurrentUser()
          .then(response => {
            // Update user data based on your new backend structure
            if (response.data.success) {
              const userData = response.data.data.user;
              
              // Check if user is deactivated
              if (userData.active === false || userData.status === 'INACTIVE' || userData.status === 'DEACTIVATED') {
                // User has been deactivated, log them out
                console.log('User deactivated:', userData); // Debug log
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setUser(null);
                // Show alert or redirect to login with message
                window.location.href = '/login?message=account_deactivated';
                return;
              }
              
              setUser(userData);
            } else {
              setUser(parsedUser); // Keep existing user data if API call fails
            }
          })
          .catch(() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
          });
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      
      // Debug: Log the full response to understand the structure
      console.log('🔍 Full Login Response:', response.data);
      console.log('🔍 Response Success:', response.data.success);
      console.log('🔍 Response Data:', response.data.data);
      
      // Handle new backend response structure
      if (response.data.success) {
        const { user, token } = response.data.data;
        
        // Debug: Log the user object to understand its structure
        console.log('👤 User Object from Login:', user);
        console.log('👤 User Active Property:', user.active);
        console.log('👤 User Status Property:', user.status);
        
        // Check if user is deactivated
        if (user.active === false || user.status === 'INACTIVE' || user.status === 'DEACTIVATED') {
          console.log('❌ Login blocked - user deactivated:', user); // Debug log
          return { 
            success: false, 
            error: 'Your account has been deactivated. Please contact administrator.' 
          };
        }
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        
        return { success: true, data: response.data };
      } else {
        return { 
          success: false, 
          error: response.data.message || 'Login failed' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      
      // Handle new backend response structure
      if (response.data.success) {
        return { success: true, data: response.data };
      } else {
        return { 
          success: false, 
          error: response.data.message || 'Registration failed' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    isStudent: user?.role === 'USER', // Backend uses 'USER' for students
    // Treat admin as teacher for backward compatibility
    isTeacher: user?.role === 'ADMIN',
    // User status checks - more permissive approach
    isActive: user ? (user.active !== false && user.status !== 'INACTIVE' && user.status !== 'DEACTIVATED') : false,
    isDeactivated: user ? (user.active === false || user.status === 'INACTIVE' || user.status === 'DEACTIVATED') : false,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
