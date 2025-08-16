import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { studentAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import Alert from '../../components/Alert';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Star, 
  Users, 
  Clock, 
  ChevronRight,
  Home,
  User,
  Calendar,
  Play,
  TrendingUp 
} from 'lucide-react';

const CourseCatalog = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(null);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    fetchCourses();
    
    // Set up auto-refresh every 30 seconds for real-time data
    const refreshInterval = setInterval(() => {
      fetchCourses();
    }, 30000);
    
    // Cleanup interval on component unmount
    return () => clearInterval(refreshInterval);
  }, []);

  useEffect(() => {
    filterCourses();
  }, [searchTerm, courses]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await studentAPI.getAvailableCourses();
      // Handle the response data correctly
      const coursesData = response.data || [];
      setCourses(coursesData);
      console.log('Fetched courses:', coursesData); // Debug log
    } catch (error) {
      console.error('Error fetching courses:', error);
      showAlert('Failed to load courses', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filterCourses = () => {
    let filtered = courses;

    // Filter by search term using correct property names
    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.courseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.courseCode?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Note: Category filtering removed since backend doesn't provide category field
    // Can be added later when backend includes course categories
    
    setFilteredCourses(filtered);
  };

  const handleEnroll = async (courseId) => {
    if (enrolling) return;

    try {
      setEnrolling(courseId);
      await studentAPI.enrollInCourse(courseId);
      showAlert('Successfully enrolled in course!', 'success');
      fetchCourses(); // Refresh courses
    } catch (error) {
      console.error('Enrollment error:', error);
      const message = error.response?.data?.message || 'Failed to enroll in course';
      showAlert(message, 'error');
    } finally {
      setEnrolling(null);
    }
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
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Course Catalog</h1>
              <p className="text-gray-600">Discover and enroll in amazing courses</p>
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
            
            <div className="flex items-center gap-2 text-blue-600 px-4 py-2 rounded-lg font-medium bg-blue-50">
              <BookOpen className="h-4 w-4" />
              Browse Courses
            </div>
            
            <Link
              to="/my-learning"
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <Play className="h-4 w-4" />
              My Learning
            </Link>
            
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

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search courses by name, code, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Refresh Button */}
            <button
              onClick={fetchCourses}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
            >
              <TrendingUp className="h-4 w-4" />
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Course Grid */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600">
              {searchTerm 
                ? 'Try adjusting your search terms'
                : 'No courses available at the moment'
              }</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div key={course.courseId} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                {/* Course Image/Icon */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-32 rounded-t-lg flex items-center justify-center">
                  <BookOpen className="h-12 w-12 text-white" />
                </div>

                {/* Course Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                      {course.courseCode}
                    </span>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-green-500" />
                      <span className="ml-1 text-sm text-gray-600">
                        {course.courseDuration ? `${course.courseDuration} weeks` : 'Self-paced'}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {course.courseName}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {course.description || 'No description available.'}
                  </p>

                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span className="mr-4">
                      Created: {course.createdAt ? new Date(course.createdAt).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <Link
                      to={`/courses/${course.courseId}`}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center"
                    >
                      Learn More
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>

                    <button
                      onClick={() => handleEnroll(course.courseId)}
                      disabled={enrolling === course.courseId || course.isEnrolled}
                      className={`px-4 py-2 rounded font-medium text-sm transition-colors ${
                        course.isEnrolled
                          ? 'bg-green-100 text-green-700 cursor-not-allowed'
                          : enrolling === course.courseId
                          ? 'bg-blue-300 text-white cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {enrolling === course.courseId ? (
                        'Enrolling...'
                      ) : course.isEnrolled ? (
                        'Enrolled'
                      ) : (
                        'Enroll Now'
                      )}
                    </button>
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

export default CourseCatalog;
