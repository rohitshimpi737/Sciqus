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
      usernameOrEmail: credentials.usernameOrEmail,
      password: credentials.password
    };
    
    return api.post('/auth/login', loginData);
  },
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
};

// Course API - Fixed to match backend /api/courses
export const courseAPI = {
  getAllCourses: () => api.get('/courses'),
  getCourse: (id) => api.get(`/courses/${id}`),
  createCourse: (courseData) => api.post('/courses', courseData),
  updateCourse: (id, courseData) => api.put(`/courses/${id}`, courseData),
  deleteCourse: (id) => api.delete(`/courses/${id}`),
};

// User API - Fixed to match backend /api/users
export const userAPI = {
  getAllUsers: () => api.get('/users'),
  getUser: (id) => api.get(`/users/${id}`),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
  updateUserRole: (id, role) => api.put(`/users/${id}/role`, { role }),
};

// Student API - Fixed to match backend /api/student
export const studentAPI = {
  enrollInCourse: (courseId) => api.post(`/student/enroll/${courseId}`),
  getMyInfo: () => api.get('/student/profile'),
  getMyCourses: () => api.get('/student/course'),
  getMyEnrollments: () => api.get('/student/enrollments'),
  getAvailableCourses: () => api.get('/student/available-courses'),
  getCourseDetails: (courseId) => api.get(`/courses/${courseId}`),
  getAllCourses: () => api.get('/courses'),
  getDashboard: () => api.get('/student/dashboard'),
  updateProfile: (profileData) => api.put('/student/profile', profileData),
  changePassword: (passwordData) => api.put('/student/change-password', passwordData),
};

// Admin API - Complete admin functionality
export const adminAPI = {
  // Statistics and analytics
  getDashboardStats: () => api.get('/admin/stats'),
  getAllUsers: () => api.get('/admin/users'),
  getAllCoursesForAdmin: () => api.get('/admin/courses'),
  getUserStats: () => api.get('/admin/stats/users'),
  getCourseStats: () => api.get('/admin/stats/courses'),
  
  // User management (using regular user endpoints with admin auth)
  createUser: (userData) => api.post('/users', userData),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
  updateUserRole: (id, role) => api.put(`/users/${id}/role`, { role }),
  
  // User activation/deactivation (using user endpoints)
  activateUser: (id) => api.put(`/users/${id}`, { isActive: true }),
  deactivateUser: (id) => api.put(`/users/${id}`, { isActive: false }),
  
  // Course management (using regular course endpoints with admin auth)
  createCourse: (courseData) => api.post('/courses', courseData),
  updateCourse: (id, courseData) => api.put(`/courses/${id}`, courseData),
  deleteCourse: (id) => api.delete(`/courses/${id}`),
  getActiveCourses: () => api.get('/courses/filter/active'),
  getInactiveCourses: () => api.get('/courses/filter/inactive'),
  getAllCourses: () => api.get('/courses'),
  toggleCourseStatus: (id) => api.put(`/courses/${id}/course-status/toggle`),
  
  // Enrollment management
  enrollStudentInCourse: (courseId, studentId) => api.post(`/courses/${courseId}/students/${studentId}`, {}),
  getCourseStudents: (courseId) => api.get(`/courses/${courseId}/students`),
  getSpecificStudentInCourse: (courseId, studentId) => api.get(`/courses/${courseId}/students/${studentId}`),
  getAllEnrollments: () => api.get(`/enrollments`),
  
  // Student self-enrollment (alternative endpoint)
  studentSelfEnroll: (courseId) => api.post(`/courses/${courseId}/enroll`, {}),
  
  // System health and activity
  getSystemHealth: () => api.get('/admin/health'),
  getSystemActivity: () => api.get('/admin/activity'),
};

// Health API - System health check endpoints
export const healthAPI = {
  check: () => api.get('/health'),
  ping: () => api.get('/'),
  actuator: () => api.get('/actuator/health'),
};

export default api;
