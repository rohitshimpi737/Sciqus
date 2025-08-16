import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye,
  Users,
  Clock,
  Star,
  Calendar,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { adminAPI } from '../../services/api';

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await adminAPI.getAllCoursesForAdmin();
        
        // Backend returns ApiResponseDto format: {success: boolean, message: string, data: array}
        if (response.data && response.data.success && Array.isArray(response.data.data)) {
          setCourses(response.data.data);
          setFilteredCourses(response.data.data);
        } else {
          throw new Error('Invalid response format from server');
        }
      } catch (error) {
        console.error('Failed to fetch courses:', error);
        setError('Failed to connect to server. Using offline mode.');
        
        // Fallback mock data with backend-compatible structure
        const mockCourses = [
          {
            courseId: 1,
            courseName: 'Introduction to React',
            courseCode: 'CS-101',
            courseDuration: 12,
            description: 'Learn the fundamentals of React development',
            isActive: true,
            createdAt: '2024-01-15T10:00:00',
            updatedAt: '2024-01-15T10:00:00'
          },
          {
            courseId: 2,
            courseName: 'Advanced JavaScript',
            courseCode: 'CS-201',
            courseDuration: 16,
            description: 'Deep dive into advanced JavaScript concepts',
            isActive: true,
            createdAt: '2024-01-20T10:00:00',
            updatedAt: '2024-01-20T10:00:00'
          },
          {
            courseId: 3,
            courseName: 'Data Science Fundamentals',
            courseCode: 'DS-101',
            courseDuration: 20,
            description: 'Introduction to data science and analytics',
            isActive: false,
            createdAt: '2024-02-01T10:00:00',
            updatedAt: '2024-02-01T10:00:00'
          },
          {
            courseId: 4,
            courseName: 'Web Design Principles',
            courseCode: 'WD-101',
            courseDuration: 8,
            description: 'Learn modern web design and UX principles',
            isActive: true,
            createdAt: '2023-12-01T10:00:00',
            updatedAt: '2023-12-01T10:00:00'
          }
        ];
        
        setCourses(mockCourses);
        setFilteredCourses(mockCourses);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Alternative function to fetch courses by specific status using backend endpoints
  const fetchCoursesByStatus = async (status) => {
    try {
      let response;
      if (status === 'active') {
        response = await adminAPI.getActiveCourses();
      } else if (status === 'inactive') {
        response = await adminAPI.getInactiveCourses();
      } else {
        response = await adminAPI.getAllCourses();
      }
      
      if (response.data && Array.isArray(response.data)) {
        setCourses(response.data);
        setFilteredCourses(response.data);
      }
    } catch (error) {
      console.error(`Failed to fetch ${status} courses:`, error);
      // Fall back to client-side filtering
    }
  };

  // Filter courses based on search term and status
  useEffect(() => {
    let filtered = courses;

    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (course.instructor && course.instructor.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedStatus !== 'all') {
      if (selectedStatus === 'active') {
        // Handle both boolean and string values for isActive field
        filtered = filtered.filter(course => 
          course.isActive === true || course.isActive === 'true' || course.active === true
        );
      } else if (selectedStatus === 'inactive') {
        // Handle both boolean and string values for isActive field
        filtered = filtered.filter(course => 
          course.isActive === false || course.isActive === 'false' || course.active === false || 
          course.isActive == null || course.active == null
        );
      }
    }

    setFilteredCourses(filtered);
  }, [courses, searchTerm, selectedStatus]);

  const handleAddCourse = () => {
    setSelectedCourse(null);
    setShowAddCourseModal(true);
  };

  const handleEditCourse = (course) => {
    setSelectedCourse(course);
    setShowAddCourseModal(true);
  };

  const handleDeleteCourse = async (courseId) => {
    if (confirm('Are you sure you want to delete this course?')) {
      try {
        const response = await adminAPI.deleteCourse(courseId);
        
        // Assuming successful delete returns success status or 200 OK
        if (response.status === 200 || response.status === 204) {
          setCourses(courses.filter(course => course.courseId !== courseId));
          alert('Course deleted successfully!');
        } else {
          throw new Error('Failed to delete course');
        }
      } catch (error) {
        console.error('Failed to delete course:', error);
        alert('Failed to delete course. Please try again.');
        
        // Still update UI for demo purposes if API fails
        setCourses(courses.filter(course => course.courseId !== courseId));
      }
    }
  };

  const handleToggleCourseStatus = async (course) => {
    const action = course.isActive ? 'deactivate' : 'activate';
    
    if (confirm(`Are you sure you want to ${action} "${course.courseName}"?`)) {
      try {
        // Use the correct backend endpoint for toggling course status
        const response = await adminAPI.toggleCourseStatus(course.courseId);
        
        if (response.status === 200 && response.data) {
          // Update the course's status with the response from backend
          setCourses(courses.map(c => 
            c.courseId === course.courseId ? { ...c, isActive: response.data.isActive } : c
          ));
          const newStatus = response.data.isActive ? 'activated' : 'deactivated';
          alert(`Course ${newStatus} successfully!`);
          
          // Update filtered courses as well
          setFilteredCourses(filteredCourses.map(c => 
            c.courseId === course.courseId ? { ...c, isActive: response.data.isActive } : c
          ));
        } else {
          throw new Error(`Failed to ${action} course`);
        }
      } catch (error) {
        console.error(`Failed to ${action} course:`, error);
        
        let errorMessage = `Failed to ${action} course. `;
        if (error.response?.status === 404) {
          errorMessage += 'Course not found.';
        } else if (error.response?.status === 403) {
          errorMessage += 'You do not have permission to modify course status.';
        } else {
          errorMessage += 'Please try again.';
        }
        alert(errorMessage);
      }
    }
  };

  const getStatusBadgeColor = (isActive) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Course Management</h2>
          <p className="text-gray-600">Manage all courses in your system</p>
          {error && (
            <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                API connection issue: Using offline mode. {error}
              </p>
            </div>
          )}
        </div>
        <button
          onClick={handleAddCourse}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Course
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search courses by title, instructor, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="relative">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div key={course.courseId} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="p-6">
              {/* Course Header */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {course.courseName}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {course.courseCode} • {course.courseDuration} weeks
                  </p>
                  {course.instructor && (
                    <p className="text-sm text-gray-500">
                      by {course.instructor}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleEditCourse(course)}
                    className="p-1 text-gray-400 hover:text-blue-600"
                    title="Edit course"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleToggleCourseStatus(course)}
                    className={`p-1 ${
                      course.isActive ? 'text-gray-400 hover:text-orange-600' : 'text-gray-400 hover:text-green-600'
                    }`}
                    title={course.isActive ? 'Deactivate course' : 'Activate course'}
                  >
                    {course.isActive ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => handleDeleteCourse(course.courseId)}
                    className="p-1 text-gray-400 hover:text-red-600"
                    title="Delete course"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Course Description */}
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {course.description}
              </p>

              {/* Course Stats */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{course.enrolledStudents || 0} students</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{new Date(course.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Badges */}
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(course.isActive)}`}>
                    {course.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <button
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No courses found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || selectedStatus !== 'all' 
              ? 'Try adjusting your search criteria' 
              : 'Get started by creating a new course'}
          </p>
        </div>
      )}

      {/* Add/Edit Course Modal */}
      {showAddCourseModal && (
        <AddCourseModal
          course={selectedCourse}
          onClose={() => {
            setShowAddCourseModal(false);
            setSelectedCourse(null);
          }}
          onSave={async (courseData) => {
            try {
              if (selectedCourse) {
                // Update existing course
                const response = await adminAPI.updateCourse(selectedCourse.courseId, courseData);
                
                // Assuming your backend returns the updated course object or 200 OK
                if (response.status === 200 && response.data) {
                  const updatedCourse = response.data;
                  setCourses(courses.map(course =>
                    course.courseId === selectedCourse.courseId ? updatedCourse : course
                  ));
                  alert('Course updated successfully!');
                } else {
                  throw new Error('Failed to update course');
                }
              } else {
                // Add new course
                const response = await adminAPI.createCourse(courseData);
                
                // Assuming your backend returns the created course object
                if (response.status === 200 || response.status === 201) {
                  const newCourse = response.data;
                  setCourses([...courses, newCourse]);
                  alert('Course created successfully!');
                } else {
                  throw new Error('Failed to create course');
                }
              }
            } catch (error) {
              console.error('Failed to save course:', error);
              alert('Failed to save course: ' + error.message);
              
              // Fallback: Still update UI for demo purposes
              if (selectedCourse) {
                setCourses(courses.map(course =>
                  course.courseId === selectedCourse.courseId ? { ...course, ...courseData } : course
                ));
              } else {
                const newCourse = {
                  ...courseData,
                  id: Date.now(),
                  enrolledStudents: 0,
                  isActive: true,
                  createdAt: new Date().toISOString().split('T')[0]
                };
                setCourses([...courses, newCourse]);
              }
            }
            
            setShowAddCourseModal(false);
            setSelectedCourse(null);
          }}
        />
      )}
    </div>
  );
};

// Add/Edit Course Modal Component
const AddCourseModal = ({ course, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    courseName: course?.courseName || '',
    courseCode: course?.courseCode || '',
    courseDuration: course?.courseDuration || 8,
    description: course?.description || ''
  });
  const [loading, setLoading] = useState(false);

  // Reset form when course prop changes
  useEffect(() => {
    setFormData({
      courseName: course?.courseName || '',
      courseCode: course?.courseCode || '',
      courseDuration: course?.courseDuration || 8,
      description: course?.description || ''
    });
  }, [course]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onSave(formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-lg w-full p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {course ? 'Edit Course' : 'Add New Course'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course Name
            </label>
            <input
              type="text"
              required
              value={formData.courseName}
              onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Introduction to React"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course Code
              </label>
              <input
                type="text"
                required
                value={formData.courseCode}
                onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., CS-101"
              />
            </div>
            
            <div>
              <label htmlFor="courseDuration" className="block text-sm font-medium text-gray-700 mb-1">
                Duration (weeks)
              </label>
              <input
                type="number"
                id="courseDuration"
                name="courseDuration"
                required
                min="1"
                max="52"
                value={formData.courseDuration}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData({ 
                    ...formData, 
                    courseDuration: value === '' ? '' : parseInt(value) || 1
                  });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter duration in weeks (e.g., 12)"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Provide a detailed description of the course content and objectives"
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50"
            >
              {loading ? 'Saving...' : (course ? 'Update' : 'Create')} Course
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseManagement;
