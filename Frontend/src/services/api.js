import axios from 'axios';
import { config } from '../config';

const API_BASE_URL = config.apiBaseUrl;

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API with correct field names for your backend
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => {
    // Transform the credentials to match backend expectations
    const loginData = {
      usernameOrEmail: credentials.email,
      password: credentials.password
    };
    
    return api.post('/auth/login', loginData);
  },
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
};

// Course API
export const courseAPI = {
  getAllCourses: () => api.get('/course'),
  getCourse: (id) => api.get(`/course/${id}`),
  createCourse: (courseData) => api.post('/course', courseData),
  updateCourse: (id, courseData) => api.put(`/course/${id}`, courseData),
  deleteCourse: (id) => api.delete(`/course/${id}`),
};

// User API
export const userAPI = {
  getAllUsers: () => api.get('/user'),
  getUser: (id) => api.get(`/user/${id}`),
  updateUser: (id, userData) => api.put(`/user/${id}`, userData),
  deleteUser: (id) => api.delete(`/user/${id}`),
  updateUserRole: (id, role) => api.put(`/user/${id}/role`, { role }),
};

// Student API
export const studentAPI = {
  enrollInCourse: (courseId) => api.post(`/student/enroll/${courseId}`),
  getMyInfo: () => api.get('/student/info'),
  getMyCourses: () => api.get('/student/courses'),
  getMyEnrollments: () => api.get('/student/enrollments'),
  getAvailableCourses: () => api.get('/courses/available'),
  getCourseDetails: (courseId) => api.get(`/courses/${courseId}`),
  getAllCourses: () => api.get('/courses'),
  getDashboard: () => api.get('/student/dashboard'),
  updateProfile: (profileData) => api.put('/student/profile', profileData),
  changePassword: (passwordData) => api.put('/student/change-password', passwordData),
};

// Admin API
export const adminAPI = {
  // User management - Updated to match your backend
  getAllUsers: () => api.get('/users'),
  createUser: (userData) => api.post('/users', userData),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
  activateUser: (id) => api.patch(`/users/${id}/activate`),
  deactivateUser: (id) => api.patch(`/users/${id}/deactivate`),
  updateUserRole: (id, role) => api.put(`/users/${id}/role`, { role }),
  
  // Course management - Updated to match your backend
  getAllCourses: () => api.get('/courses'),
  getCourseById: (id) => api.get(`/courses/${id}`),
  searchCourses: (keyword) => api.get(`/courses/search?keyword=${encodeURIComponent(keyword)}`),
  createCourse: (courseData) => api.post('/courses', courseData),
  updateCourse: (id, courseData) => api.put(`/courses/${id}`, courseData),
  deleteCourse: (id) => api.delete(`/courses/${id}`),
  
  // Enrollment management - Updated to match actual backend controller
  // Note: DELETE endpoint for unenrolling students is not yet implemented in backend
  enrollStudentInCourse: (courseId, studentId) => api.post(`/courses/${courseId}/students/${studentId}`, {}),
  getCourseStudents: (courseId) => api.get(`/courses/${courseId}/students`),
  getSpecificStudentInCourse: (courseId, studentId) => api.get(`/courses/${courseId}/students/${studentId}`),
  getAllEnrollments: () => api.get(`/enrollments`),
  
  // Student self-enrollment
  studentSelfEnroll: (courseId) => api.post(`/courses/${courseId}/enroll`, {}),
  
  getStudentCourses: (studentId) => api.get(`/students/${studentId}/courses`), // May not be implemented yet
  
  // Statistics and analytics (keeping as fallback)
  getDashboardStats: () => api.get('/admin/stats'),
  getUserStats: () => api.get('/admin/stats/users'),
  getCourseStats: () => api.get('/admin/stats/courses'),
  getSystemActivity: () => api.get('/admin/activity'),
  
  // System health
  getSystemHealth: () => api.get('/admin/health'),
};

// Health API
export const healthAPI = {
  check: () => api.get('/health'),
  // Alternative health check endpoints to try
  ping: () => api.get('/'),
  actuator: () => api.get('/actuator/health'),
};

export default api;
