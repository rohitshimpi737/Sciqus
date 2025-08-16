import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar, ProtectedRoute } from './components';
import { 
  Landing, 
  Login, 
  Register, 
  Dashboard,
  Unauthorized,
  StudentProfile,
  CourseCatalog,
  CourseDetails,
  MyLearning,
  AdminDashboard,
  UserManagement,
  CourseManagement
} from './pages';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            
            {/* Student Routes */}
            <Route
              path="/student/profile"
              element={
                <ProtectedRoute>
                  <StudentProfile />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/courses"
              element={
                <ProtectedRoute>
                  <CourseCatalog />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/courses/:courseId"
              element={
                <ProtectedRoute>
                  <CourseDetails />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/my-learning"
              element={
                <ProtectedRoute>
                  <MyLearning />
                </ProtectedRoute>
              }
            />
            
            {/* Admin Routes */}
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute roles={['ADMIN']}>
                  <UserManagement />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/admin/courses"
              element={
                <ProtectedRoute roles={['ADMIN']}>
                  <CourseManagement />
                </ProtectedRoute>
              }
            />
            
            {/* Legacy temporary routes */}
            <Route
              path="/users"
              element={
                <ProtectedRoute roles={['ADMIN', 'TEACHER']}>
                  <UserManagement />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/unauthorized"
              element={<Unauthorized />}
            />
            
            {/* Redirect any unknown routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
