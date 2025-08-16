import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { adminAPI } from '../../services/api';
import { 
  Users, 
  BookOpen, 
  GraduationCap, 
  UserCheck,
  Plus,
  TrendingUp,
  Activity
} from 'lucide-react';
import UserManagement from './UserManagement';
import CourseManagement from './CourseManagement';
import EnrollmentManagement from './EnrollmentManagement';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    activeStudents: 0,
    totalAdmins: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiConnected, setApiConnected] = useState(false);

  // Fetch dashboard statistics from backend
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try to fetch dashboard stats from backend
        const response = await adminAPI.getDashboardStats();
        
        if (response.data.success) {
          const backendStats = response.data.data;
          // Map backend stats to frontend expected format
          setStats({
            totalUsers: backendStats.totalUsers || 0,
            totalCourses: backendStats.totalCourses || 0,
            activeStudents: backendStats.totalStudents || 0, // Map totalStudents to activeStudents
            activeCourses: backendStats.activeCourses || 0,
            totalAdmins: (backendStats.totalUsers || 0) - (backendStats.totalStudents || 0) // Calculate admins
          });
          setApiConnected(true);
        } else {
          throw new Error(response.data.message || 'Failed to fetch dashboard stats');
        }
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
        setError(error.message);
        setApiConnected(false);
        
        // Fallback to mock data if API fails
        setStats({
          totalUsers: 48,
          totalCourses: 12,
          activeStudents: 35,
          totalAdmins: 5
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const dashboardStats = [
    { 
      name: 'Total Users', 
      value: stats.totalUsers, 
      icon: Users, 
      color: 'bg-blue-500'
    },
    { 
      name: 'Total Courses', 
      value: stats.totalCourses, 
      icon: BookOpen, 
      color: 'bg-green-500'
    },
    { 
      name: 'Active Students', 
      value: stats.activeStudents, 
      icon: UserCheck, 
      color: 'bg-purple-500'
    },
    { 
      name: 'Admins/Teachers', 
      value: stats.totalAdmins, 
      icon: GraduationCap, 
      color: 'bg-orange-500'
    },
  ];

  const tabs = [
    { id: 'overview', name: 'Overview', icon: TrendingUp },
    { id: 'users', name: 'User Management', icon: Users },
    { id: 'courses', name: 'Course Management', icon: BookOpen },
    { id: 'enrollments', name: 'Enrollments', icon: UserCheck },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab stats={dashboardStats} onNavigate={setActiveTab} />;
      case 'users':
        return <UserManagement />;
      case 'courses':
        return <CourseManagement />;
      case 'enrollments':
        return <EnrollmentManagement />;
      default:
        return <OverviewTab stats={dashboardStats} onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Admin Dashboard
        </h1>
        <p className="mt-2 text-gray-600">
          Welcome back, {user?.name}! Manage your Sciqus platform from here.
        </p>
        <div className="mt-2 flex items-center space-x-2">
          <div className={`h-2 w-2 rounded-full ${apiConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
          <span className="text-sm text-gray-600">
            Backend API: {apiConnected ? 'Connected' : 'Disconnected (Demo Mode)'}
          </span>
        </div>
        {error && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  API Connection Issue
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>Unable to connect to backend API. Using offline mode with sample data.</p>
                  <p className="text-xs mt-1">Error: {error}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
              >
                <IconComponent className="h-5 w-5" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        renderTabContent()
      )}
    </div>
  );
};

// Overview Tab Component
const OverviewTab = ({ stats, onNavigate }) => {
  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={stat.name}
              className="bg-white overflow-hidden shadow-sm rounded-lg border"
            >
              <div className="p-6">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 p-3 rounded-md ${stat.color}`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.name}
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {stat.value}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white shadow-sm rounded-lg border">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Recent Activity
            </h3>
            <div className="space-y-4">
              {[
                { action: 'New user registration', user: 'John Doe', time: '2 minutes ago', type: 'user' },
                { action: 'Course "React Basics" updated', user: 'Jane Smith', time: '1 hour ago', type: 'course' },
                { action: 'Student enrolled in "Advanced JavaScript"', user: 'Mike Johnson', time: '3 hours ago', type: 'enrollment' },
                { action: 'New admin account created', user: 'Sarah Wilson', time: '5 hours ago', type: 'user' },
              ].map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      activity.type === 'user' ? 'bg-blue-100' :
                      activity.type === 'course' ? 'bg-green-100' :
                      'bg-purple-100'
                    }`}>
                      {activity.type === 'user' ? (
                        <Users className={`h-4 w-4 ${
                          activity.type === 'user' ? 'text-blue-600' : 'text-gray-600'
                        }`} />
                      ) : activity.type === 'course' ? (
                        <BookOpen className="h-4 w-4 text-green-600" />
                      ) : (
                        <UserCheck className="h-4 w-4 text-purple-600" />
                      )}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.user} • {activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow-sm rounded-lg border">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 gap-3">
              <button 
                onClick={() => onNavigate('users')}
                className="flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-700 font-medium transition-colors"
              >
                <span className="flex items-center">
                  <Plus className="h-5 w-5 mr-2" />
                  Add New User
                </span>
              </button>
              <button 
                onClick={() => onNavigate('courses')}
                className="flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 rounded-lg text-green-700 font-medium transition-colors"
              >
                <span className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Create New Course
                </span>
              </button>
              <button 
                onClick={() => onNavigate('enrollments')}
                className="flex items-center justify-between p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-purple-700 font-medium transition-colors"
              >
                <span className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Manage Enrollments
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
