import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { studentAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import Alert from '../../components/Alert';
import { 
  BookOpen, 
  Play, 
  CheckCircle, 
  Clock, 
  Calendar,
  TrendingUp,
  User,
  Home,
  Search,
  Filter,
  Star,
  BarChart,
  Award
} from 'lucide-react';

const MyLearning = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [filteredEnrollments, setFilteredEnrollments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  const statusOptions = [
    { value: 'all', label: 'All Courses' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'not_started', label: 'Not Started' }
  ];

  useEffect(() => {
    fetchMyLearning();
    
    // Set up auto-refresh every 45 seconds for enrollment data
    const refreshInterval = setInterval(() => {
      fetchMyLearning();
    }, 45000);
    
    // Cleanup interval on component unmount
    return () => clearInterval(refreshInterval);
  }, []);

  useEffect(() => {
    filterEnrollments();
  }, [searchTerm, selectedStatus, enrollments]);

  const fetchMyLearning = async () => {
    try {
      setLoading(true);
      const enrollmentResponse = await studentAPI.getMyEnrollments();
      console.log('My enrollments data:', enrollmentResponse.data); // Debug log
      
      // Enrich enrollment data with course details
      const enrichedEnrollments = await Promise.all(
        (enrollmentResponse.data || []).map(async (enrollment) => {
          try {
            // For now, we'll work with the data we have
            // In a real system, you'd fetch additional course details here
            return {
              ...enrollment,
              // Map backend properties to frontend expectations
              courseTitle: enrollment.courseName,
              courseDescription: `Course: ${enrollment.courseName}`, // Placeholder since backend doesn't provide description in enrollment
              enrolledDate: new Date(enrollment.enrollmentDate).toLocaleDateString(),
              progress: 0, // Default progress since backend doesn't track progress yet
              id: enrollment.enrollmentId
            };
          } catch (error) {
            console.error('Error enriching enrollment:', error);
            return {
              ...enrollment,
              courseTitle: enrollment.courseName,
              courseDescription: `Course: ${enrollment.courseName}`,
              enrolledDate: new Date(enrollment.enrollmentDate).toLocaleDateString(),
              progress: 0,
              id: enrollment.enrollmentId
            };
          }
        })
      );
      
      setEnrollments(enrichedEnrollments);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
      showAlert('Failed to load your courses', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filterEnrollments = () => {
    let filtered = enrollments;

    // Filter by search term using correct property names
    if (searchTerm) {
      filtered = filtered.filter(enrollment =>
        enrollment.courseTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enrollment.courseDescription?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enrollment.courseName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status based on progress
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(enrollment => {
        const progress = enrollment.progress || 0;
        switch (selectedStatus) {
          case 'completed':
            return progress >= 100;
          case 'in_progress':
            return progress > 0 && progress < 100;
          case 'not_started':
            return progress === 0;
          default:
            return true;
        }
      });
    }
    
    setFilteredEnrollments(filtered);
  };

  const getEnrollmentStatus = (enrollmentDate) => {
    const enrolledDate = new Date(enrollmentDate);
    const daysSinceEnrollment = Math.floor((new Date() - enrolledDate) / (1000 * 60 * 60 * 24));
    
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        <CheckCircle className="h-3 w-3 mr-1" />
        Enrolled {daysSinceEnrollment} days ago
      </span>
    );
  };

  const getStatusBadge = (progress) => {
    if (progress >= 100) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Completed
        </span>
      );
    } else if (progress > 0) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Clock className="h-3 w-3 mr-1" />
          In Progress
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          <BookOpen className="h-3 w-3 mr-1" />
          Not Started
        </span>
      );
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 100) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress > 0) return 'bg-yellow-500';
    return 'bg-gray-300';
  };

  const showAlert = (message, type) => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Navigation */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Play className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Learning</h1>
              <p className="text-gray-600">Continue your learning journey</p>
            </div>
          </div>
          
          {/* Student Navigation */}
          <div className="flex items-center gap-6">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
            
            <Link
              to="/courses"
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <BookOpen className="h-4 w-4" />
              Browse Courses
            </Link>
            
            <div className="flex items-center gap-2 text-green-600 px-4 py-2 rounded-lg font-medium bg-green-50">
              <Play className="h-4 w-4" />
              My Learning
            </div>
            
            <Link
              to="/student/profile"
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <User className="h-4 w-4" />
              Profile
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {alert && (
          <div className="mb-6">
            <Alert type={alert.type} message={alert.message} />
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Courses</p>
                <p className="text-2xl font-bold text-gray-900">{enrollments.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">
                  {enrollments.filter(e => (e.progress || 0) > 0 && (e.progress || 0) < 100).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {enrollments.filter(e => (e.progress || 0) >= 100).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Certificates</p>
                <p className="text-2xl font-bold text-gray-900">
                  {enrollments.filter(e => (e.progress || 0) >= 100).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search your courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white min-w-[180px]"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Course List */}
        {filteredEnrollments.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            {enrollments.length === 0 ? (
              <>
                <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No courses enrolled</h3>
                <p className="text-gray-600 mb-4">Start your learning journey by enrolling in courses</p>
                <Link
                  to="/courses"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Browse Courses
                </Link>
              </>
            ) : (
              <>
                <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No courses match your filters</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria</p>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEnrollments.map((enrollment) => (
              <div key={enrollment.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {enrollment.courseTitle}
                        </h3>
                        {getStatusBadge(enrollment.progress || 0)}
                      </div>

                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {enrollment.courseDescription}
                      </p>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Progress</span>
                          <span className="text-sm font-medium text-gray-700">
                            {enrollment.progress || 0}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(enrollment.progress || 0)}`}
                            style={{ width: `${enrollment.progress || 0}%` }}
                          />
                        </div>
                      </div>

                      {/* Course Info */}
                      <div className="flex items-center text-sm text-gray-500 gap-4">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>Enrolled {enrollment.enrolledDate || 'Recently'}</span>
                        </div>
                        {enrollment.lastAccessed && (
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>Last accessed {enrollment.lastAccessed}</span>
                          </div>
                        )}
                        {enrollment.rating && (
                          <div className="flex items-center">
                            <Star className="h-4 w-4 mr-1 text-yellow-400 fill-current" />
                            <span>{enrollment.rating}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="ml-6 flex flex-col gap-2">
                      <Link
                        to={`/courses/${enrollment.courseId}/learn`}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium text-sm transition-colors text-center"
                      >
                        {(enrollment.progress || 0) >= 100 ? 'Review' : (enrollment.progress || 0) > 0 ? 'Continue' : 'Start Learning'}
                      </Link>
                      
                      <Link
                        to={`/courses/${enrollment.courseId}`}
                        className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded font-medium text-sm transition-colors text-center"
                      >
                        Course Details
                      </Link>

                      {(enrollment.progress || 0) >= 100 && (
                        <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-medium text-sm transition-colors">
                          <Award className="h-4 w-4 inline mr-1" />
                          Certificate
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyLearning;
