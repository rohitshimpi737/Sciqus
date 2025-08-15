import React from 'react';
import { useAuth } from '../context/AuthContext';
import { AdminDashboard } from './admin';
import { StudentDashboard } from './student';

const Dashboard = () => {
  const { user, isAdmin, isStudent } = useAuth();

  // Render role-specific dashboards
  if (isAdmin) {
    return <AdminDashboard />;
  }

  if (isStudent) {
    return <StudentDashboard />;
  }

  // Default fallback - shouldn't reach here with proper authentication
  return <StudentDashboard />;
};

export default Dashboard;
