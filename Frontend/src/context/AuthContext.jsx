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
        // Verify token is still valid
        authAPI.getCurrentUser()
          .then(response => {
            // Update user data based on your new backend structure
            if (response.data.success) {
              const userData = response.data.data.user;
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
      
      // Handle new backend response structure
      if (response.data.success) {
        const { user, token } = response.data.data;
        
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
      console.log('Attempting registration with data:', userData);
      const response = await authAPI.register(userData);
      console.log('Registration response:', response);
      
      // Check if registration was successful
      // Backend returns UserResponseDto directly, not wrapped in ApiResponseDto
      if (response.data && response.data.id) {
        console.log('Registration successful, user ID:', response.data.id);
        return { success: true, data: response.data };
      } else {
        console.log('Registration failed - no user ID in response');
        return { 
          success: false, 
          error: response.data.message || 'Registration failed - invalid response' 
        };
      }
    } catch (error) {
      console.error('Registration error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      
      // Handle specific error cases
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || 'Registration failed';
        
        if (status === 409) {
          return { 
            success: false, 
            error: message || 'Username or email already exists' 
          };
        } else if (status === 400) {
          return { 
            success: false, 
            error: message || 'Invalid registration data' 
          };
        } else {
          return { 
            success: false, 
            error: message 
          };
        }
      }
      
      return { 
        success: false, 
        error: 'Registration failed. Please try again.' 
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
    isStudent: user?.role === 'STUDENT' || user?.role === 'USER', // Support both STUDENT and USER
    // Treat admin as teacher for backward compatibility
    isTeacher: user?.role === 'ADMIN',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
