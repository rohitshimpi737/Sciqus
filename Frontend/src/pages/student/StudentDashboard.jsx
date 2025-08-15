import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { studentAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import Alert from '../../components/Alert';
import { 
  BookOpen, 
  User, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Plus, 
  Home, 
  ArrowRight,
  TrendingUp 
} from 'lucide-react';const StudentDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolling, setEnrolling] = useState(null);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch dashboard stats, enrollments, and available courses
      const [dashboardResponse, enrollmentsResponse, availableCoursesResponse, allCoursesResponse] = await Promise.all([
        studentAPI.getDashboard(),
        studentAPI.getMyEnrollments(),
        studentAPI.getAvailableCourses(),
        studentAPI.getAllCourses()
      ]);

      setDashboardData(dashboardResponse.data);
      
      // Get all courses for mapping
      const allCourses = allCoursesResponse.data || [];
      const rawEnrollments = enrollmentsResponse.data || [];
      
      // Debug: Log the data structure
      console.log('Raw enrollments:', rawEnrollments);
      console.log('All courses:', allCourses);
      
      // Enrich enrollments with full course details
      const enrichedEnrollments = rawEnrollments.map(enrollment => {
        // Find the corresponding course data
        const courseDetails = allCourses.find(course => course.courseId === enrollment.courseId);
        
        if (courseDetails) {
          // Merge enrollment data with course details
          return {
            ...courseDetails,
            enrollmentId: enrollment.enrollmentId,
            enrollmentDate: enrollment.enrollmentDate,
            enrollmentStatus: enrollment.enrollmentStatus
          };
        } else {
          // Fallback if course details not found
          return {
            courseId: enrollment.courseId,
            courseName: enrollment.courseName || 'Unknown Course',
            courseCode: enrollment.courseCode || 'N/A',
            courseDuration: enrollment.courseDuration || 0,
            description: enrollment.description || '',
            isActive: enrollment.isActive !== false, // Default to true if not specified
            enrollmentId: enrollment.enrollmentId,
            enrollmentDate: enrollment.enrollmentDate,
            enrollmentStatus: enrollment.enrollmentStatus
          };
        }
      });

      setEnrollments(enrichedEnrollments);
      setAvailableCourses(availableCoursesResponse.data || []);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
      // Set fallback data for offline mode
      setDashboardData({
        studentName: user?.firstName + ' ' + user?.lastName || 'Student',
        username: user?.username || '',
        email: user?.email || '',
        totalEnrollments: 0,
        hasEnrollments: false,
        availableCourses: 0
      });
      setEnrollments([]);
      setAvailableCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollInCourse = async (courseId, courseName) => {
    try {
      setEnrolling(courseId);
      await studentAPI.enrollInCourse(courseId);
      
      // Show success message and refresh data
      setAlert({
        message: `Successfully enrolled in ${courseName}!`,
        type: 'success'
      });
      setTimeout(() => setAlert(null), 4000);
      await fetchDashboardData(); // Refresh all data
    } catch (error) {
      console.error('Enrollment failed:', error);
      const errorMessage = error.response?.data?.message || 'Failed to enroll in course. Please try again.';
      setAlert({
        message: errorMessage,
        type: 'error'
      });
      setTimeout(() => setAlert(null), 5000);
    } finally {
      setEnrolling(null);
    }
  };

  const CourseCard = ({ course, isEnrolled = false, onEnroll }) => {
    const isEnrolling = enrolling === course.courseId;
    
    return (
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden">
        {/* Course Header */}
        <div className="h-32 bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white relative overflow-hidden">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
          <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-white/10 rounded-full"></div>
          <div className="relative z-10">
            <h3 className="text-lg font-bold mb-2 line-clamp-2">{course.courseName || 'Untitled Course'}</h3>
            <p className="text-blue-100 text-sm">{course.courseCode || 'N/A'}</p>
          </div>
          {isEnrolled && (
            <div className="absolute top-4 right-4">
              <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Enrolled
              </div>
            </div>
          )}
        </div>

        {/* Course Content */}
        <div className="p-6">
          {course.description && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">{course.description}</p>
          )}

          {/* Course Details */}
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{course.courseDuration || 0} months</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className={`h-4 w-4 ${course.isActive !== false ? 'text-green-500' : 'text-gray-400'}`} />
              <span>{course.isActive !== false ? 'Active' : 'Inactive'}</span>
            </div>
          </div>

          {/* Action Button */}
          {isEnrolled ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Enrolled</span>
                {course.enrollmentDate && (
                  <span className="text-xs text-gray-500 ml-2">
                    Since {new Date(course.enrollmentDate).toLocaleDateString()}
                  </span>
                )}
              </div>
              <Link
                to={`/courses/${course.courseId}`}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
              >
                View Details
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <button
              onClick={() => onEnroll(course.courseId, course.courseName)}
              disabled={isEnrolling || !course.isActive}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isEnrolling ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Enrolling...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  {course.isActive ? 'Enroll Now' : 'Course Inactive'}
                </>
              )}
            </button>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Alert Component */}
      {alert && (
        <Alert 
          message={alert.message} 
          type={alert.type} 
          onClose={() => setAlert(null)} 
        />
      )}
      
      {/* Header with Navigation */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {dashboardData?.studentName || 'Student'}!
              </h1>
              <p className="text-gray-600">
                {dashboardData?.username && `@${dashboardData.username} • `}
                {dashboardData?.email}
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>{new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
          </div>
          
          {/* Student Navigation */}
          <div className="flex items-center gap-6">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 text-blue-600 bg-blue-50 px-4 py-2 rounded-lg font-medium"
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              to="/courses"
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <BookOpen className="h-4 w-4" />
              Course Catalog
            </Link>
            <Link
              to="/student/profile"
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <User className="h-4 w-4" />
              My Profile
            </Link>
          </div>
        </div>
      </div>

      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Connection Issue
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>{error}</p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={fetchDashboardData}
                    className="bg-yellow-100 px-3 py-2 rounded-md text-sm font-medium text-yellow-800 hover:bg-yellow-200"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* My Enrolled Courses */}
        {enrollments.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  My Enrolled Courses
                </h2>
                <p className="text-gray-600 mt-1">Continue your learning journey</p>
              </div>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {enrollments.length} course{enrollments.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrollments.map((enrollment) => (
                <CourseCard
                  key={enrollment.enrollmentId}
                  course={enrollment}
                  isEnrolled={true}
                />
              ))}
            </div>
          </div>
        )}

        {/* Available Courses */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-blue-600" />
                Available Courses
              </h2>
              <p className="text-gray-600 mt-1">Discover new courses and expand your knowledge</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {availableCourses.length} course{availableCourses.length !== 1 ? 's' : ''} available
              </span>
              <Link
                to="/courses"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
              >
                View All
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {availableCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableCourses.map((course) => (
                <CourseCard
                  key={course.courseId}
                  course={course}
                  isEnrolled={false}
                  onEnroll={handleEnrollInCourse}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No courses available</h3>
              <p className="text-gray-500">Check back later for new courses!</p>
            </div>
          )}
        </div>

        {enrollments.length === 0 && availableCourses.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="h-20 w-20 text-gray-400 mx-auto mb-6" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">Welcome to Sciqus!</h3>
            <p className="text-gray-500 mb-6">Start your learning journey by exploring our course catalog.</p>
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <BookOpen className="h-5 w-5" />
              Browse Courses
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
