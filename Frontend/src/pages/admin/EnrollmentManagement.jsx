import React, { useState, useEffect } from 'react';
import { 
  Users, 
  BookOpen, 
  Search, 
  UserPlus, 
  UserMinus,
  Eye,
  Filter,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { adminAPI } from '../../services/api';

const EnrollmentManagement = () => {
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEnrollModal, setShowEnrollModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch courses and users
      const [coursesResponse, usersResponse] = await Promise.all([
        adminAPI.getAllCourses(),
        adminAPI.getAllUsers()
      ]);
      
      if (coursesResponse.data && Array.isArray(coursesResponse.data)) {
        setCourses(coursesResponse.data);
      }
      
      if (usersResponse.data && Array.isArray(usersResponse.data)) {
        // Filter only students
        const students = usersResponse.data.filter(user => user.role === 'STUDENT');
        setUsers(students);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setError('Failed to connect to server. Using offline mode.');
      
      // Fallback mock data
      setCourses([
        {
          courseId: 1,
          courseName: 'Introduction to React',
          courseCode: 'CS-101',
          courseDuration: 12,
          isActive: true
        },
        {
          courseId: 2,
          courseName: 'Advanced JavaScript',
          courseCode: 'CS-201',
          courseDuration: 16,
          isActive: true
        }
      ]);
      
      setUsers([
        {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          role: 'STUDENT'
        },
        {
          id: 2,
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@example.com',
          role: 'STUDENT'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourseStudents = async (courseId) => {
    try {
      const response = await adminAPI.getCourseStudents(courseId);
      if (response.data && Array.isArray(response.data)) {
        setEnrollments(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch course students:', error);
      // Mock enrollment data for demo
      setEnrollments([]);
    }
  };

  const fetchAllEnrollments = async () => {
    try {
      const response = await adminAPI.getAllEnrollments();
      return response.data;
    } catch (error) {
      console.error('Failed to fetch all enrollments:', error);
      return [];
    }
  };

  const handleEnrollStudent = async (courseId, studentId) => {
    try {
      const response = await adminAPI.enrollStudentInCourse(courseId, studentId);
      alert('Student enrolled successfully!');
      
      // Refresh course students if viewing a course
      if (selectedCourse && selectedCourse.courseId === courseId) {
        await fetchCourseStudents(courseId);
      }
    } catch (error) {
      console.error('Enrollment failed:', error);
      
      // Specific error messages based on status and response
      let errorMessage = 'Failed to enroll student. ';
      if (error.response?.status === 400) {
        const backendMessage = error.response?.data?.message || '';
        if (backendMessage.includes('already enrolled')) {
          errorMessage += 'Student is already enrolled in this course.';
        } else if (backendMessage.includes("Field 'user_id' doesn't have a default value")) {
          errorMessage += 'Database configuration error. Please contact the system administrator.';
        } else if (backendMessage.includes('could not execute statement')) {
          errorMessage += 'Database error occurred. The enrollment table may need to be updated.';
        } else {
          errorMessage += 'Invalid request. Please check the course and student details.';
        }
      } else if (error.response?.status === 404) {
        errorMessage += 'Course or student not found.';
      } else if (error.response?.status === 500) {
        errorMessage += 'Server error. There may be a database configuration issue.';
      } else {
        errorMessage += 'Please try again.';
      }
      
      alert(errorMessage);
    }
  };

  const handleUnenrollStudent = async (courseId, studentId) => {
    // Note: Unenroll functionality is not implemented in the backend yet
    alert('Unenroll functionality is not available yet. This feature needs to be implemented in the backend.');
  };

  const handleViewCourseStudents = async (course) => {
    setSelectedCourse(course);
    await fetchCourseStudents(course.courseId);
  };

  const filteredUsers = users.filter(user =>
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCourses = courses.filter(course =>
    course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.courseCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Enrollment Management</h2>
          <p className="text-gray-600">Manage student course enrollments</p>
        </div>
        
        <button
          onClick={() => setShowEnrollModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Enroll Student
        </button>
      </div>

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 flex items-center">
          <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
          <span className="text-yellow-800">{error}</span>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search courses or students..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Courses List */}
        <div className="bg-white shadow-sm rounded-lg border">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              Available Courses
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {filteredCourses.map((course) => (
                <div
                  key={course.courseId}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{course.courseName}</h4>
                      <p className="text-sm text-gray-500">
                        {course.courseCode} • {course.courseDuration} weeks
                      </p>
                      <div className="flex items-center mt-2">
                        {course.isActive ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            <XCircle className="h-3 w-3 mr-1" />
                            Inactive
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleViewCourseStudents(course)}
                      className="p-2 text-gray-400 hover:text-blue-600 rounded-full hover:bg-blue-50"
                      title="View enrolled students"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Students List or Course Students */}
        <div className="bg-white shadow-sm rounded-lg border">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <Users className="h-5 w-5 mr-2" />
              {selectedCourse ? `Students in ${selectedCourse.courseName}` : 'Available Students'}
            </h3>
            {selectedCourse && (
              <button
                onClick={() => setSelectedCourse(null)}
                className="mt-2 text-sm text-blue-600 hover:text-blue-800"
              >
                ← Back to all students
              </button>
            )}
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {selectedCourse ? (
                // Show enrolled students
                enrollments.length > 0 ? (
                  enrollments.map((student) => (
                    <div
                      key={student.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {student.firstName} {student.lastName}
                          </h4>
                          <p className="text-sm text-gray-500">{student.email}</p>
                        </div>
                        <button
                          onClick={() => handleUnenrollStudent(selectedCourse.courseId, student.id)}
                          className="p-2 text-gray-300 cursor-not-allowed rounded-full"
                          title="Unenroll functionality not available yet"
                        >
                          <UserMinus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">No students enrolled in this course</p>
                )
              ) : (
                // Show all available students
                filteredUsers.map((student) => (
                  <div
                    key={student.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {student.firstName} {student.lastName}
                        </h4>
                        <p className="text-sm text-gray-500">{student.email}</p>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                          {student.role}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Enroll Student Modal */}
      {showEnrollModal && (
        <EnrollStudentModal
          courses={courses}
          students={users}
          onClose={() => setShowEnrollModal(false)}
          onEnroll={handleEnrollStudent}
        />
      )}
    </div>
  );
};

// Enroll Student Modal Component
const EnrollStudentModal = ({ courses, students, onClose, onEnroll }) => {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedCourse || !selectedStudent) {
      alert('Please select both a course and a student');
      return;
    }

    setLoading(true);
    try {
      await onEnroll(selectedCourse, selectedStudent);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Enroll Student in Course</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Course
              </label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Choose a course...</option>
                {courses.length > 0 ? (
                  courses.map((course) => (
                    <option key={course.courseId} value={course.courseId}>
                      {course.courseName} ({course.courseCode}) 
                      {course.isActive === false ? ' (Inactive)' : ''}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>No courses available</option>
                )}
              </select>
              {/* Debug info - remove in production */}
              <div className="text-xs text-gray-500 mt-1">
                Total courses: {courses.length}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Student
              </label>
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Choose a student...</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.firstName} {student.lastName} ({student.email})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Enrolling...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Enroll Student
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentManagement;
