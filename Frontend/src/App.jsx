import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar, ProtectedRoute } from './components';
import UserStatusGuard from './components/UserStatusGuard';
import { 
  Landing, 
  Login, 
  Register, 
  Dashboard,
  Unauthorized,
  StudentProfile,
  CourseCatalog,
  CourseDetails
} from './pages';

function App() {
  return (
    <AuthProvider>
      <Router>
        <UserStatusGuard>
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
            
            {/* Legacy temporary routes */}
            <Route
              path="/users"
              element={
                <ProtectedRoute roles={['ADMIN', 'TEACHER']}>
                  <div className="p-8 text-center">
                    <h1 className="text-2xl font-bold">Users Management</h1>
                    <p>Coming soon...</p>
                  </div>
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
        </UserStatusGuard>
      </Router>
    </AuthProvider>
  );
}

export default App;
