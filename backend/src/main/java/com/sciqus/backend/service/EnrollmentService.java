package com.sciqus.backend.service;

import com.sciqus.backend.entity.Course;
import com.sciqus.backend.entity.Enrollment;
import com.sciqus.backend.entity.User;
import com.sciqus.backend.repository.EnrollmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class EnrollmentService {
    
    @Autowired
    private EnrollmentRepository enrollmentRepository;
    
    @Transactional
    public Enrollment enrollStudentInCourse(User student, Course course) {
        // Validate input parameters
        if (student == null) {
            throw new IllegalArgumentException("Student cannot be null");
        }
        if (course == null) {
            throw new IllegalArgumentException("Course cannot be null");
        }
        
        // Check if student is already enrolled
        if (enrollmentRepository.existsByStudentAndCourse(student, course)) {
            throw new RuntimeException("Student " + student.getFirstName() + " " + student.getLastName() + 
                                     " is already enrolled in course " + course.getCourseName());
        }
        
        // Create new enrollment
        Enrollment enrollment = new Enrollment();
        enrollment.setStudent(student);
        enrollment.setCourse(course);
        
        return enrollmentRepository.save(enrollment);
    }
    
    public List<Enrollment> getEnrollmentsByStudent(User student) {
        if (student == null) {
            throw new IllegalArgumentException("Student cannot be null");
        }
        return enrollmentRepository.findByStudent(student);
    }
    
    public List<Enrollment> getEnrollmentsByCourse(Course course) {
        if (course == null) {
            throw new IllegalArgumentException("Course cannot be null");
        }
        return enrollmentRepository.findByCourse(course);
    }
    
    public Optional<Enrollment> findEnrollment(User student, Course course) {
        if (student == null || course == null) {
            return Optional.empty();
        }
        return enrollmentRepository.findByStudentAndCourse(student, course);
    }
    
    @Transactional
    public boolean unenrollStudentFromCourse(User student, Course course) {
        if (student == null || course == null) {
            throw new IllegalArgumentException("Student and Course cannot be null");
        }
        
        Optional<Enrollment> enrollment = enrollmentRepository.findByStudentAndCourse(student, course);
        if (enrollment.isPresent()) {
            enrollmentRepository.delete(enrollment.get());
            return true;
        }
        return false;
    }
    
    public long getEnrollmentCountForCourse(Course course) {
        if (course == null) {
            return 0;
        }
        return enrollmentRepository.countByCourse(course);
    }
    
    // Convenience method for controller
    public Enrollment enrollStudent(User student, Course course) {
        return enrollStudentInCourse(student, course);
    }
    
    // Get all students enrolled in a specific course
    public List<User> getStudentsByCourseId(Long courseId) {
        if (courseId == null) {
            throw new IllegalArgumentException("Course ID cannot be null");
        }
        return enrollmentRepository.findStudentsByCourseId(courseId);
    }
    
    // Check if a specific student is enrolled in a course
    public boolean isStudentEnrolledInCourse(Long courseId, Long studentId) {
        if (courseId == null || studentId == null) {
            return false;
        }
        return enrollmentRepository.findStudentInCourse(courseId, studentId).isPresent();
    }
    
    // Get specific student from course (throws exception if not found)
    public User getStudentInCourse(Long courseId, Long studentId) {
        if (courseId == null || studentId == null) {
            throw new IllegalArgumentException("Course ID and Student ID cannot be null");
        }
        return enrollmentRepository.findStudentInCourse(courseId, studentId)
                .orElseThrow(() -> new RuntimeException("Student with ID " + studentId + " is not enrolled in course with ID " + courseId));
    }
    
    // Get all enrollments in the system
    public List<Enrollment> getAllEnrollments() {
        return enrollmentRepository.findAll();
    }
    
    // Check if student can be enrolled (additional business logic can be added here)
    public boolean canStudentEnrollInCourse(User student, Course course) {
        if (student == null || course == null) {
            return false;
        }
        
        // Check if already enrolled
        if (enrollmentRepository.existsByStudentAndCourse(student, course)) {
            return false;
        }
        
        // Check if course is active
        if (!course.getIsActive()) {
            return false;
        }
        
        // Check if student is active
        if (!student.getIsActive()) {
            return false;
        }
        
        // Add more business rules here if needed (e.g., course capacity, prerequisites, etc.)
        
        return true;
    }
    
    // Get enrollment statistics for a course
    public EnrollmentStats getCourseEnrollmentStats(Long courseId) {
        if (courseId == null) {
            throw new IllegalArgumentException("Course ID cannot be null");
        }
        
        long enrolledCount = enrollmentRepository.findStudentsByCourseId(courseId).size();
        
        return new EnrollmentStats(courseId, enrolledCount);
    }
    
    // Inner class for enrollment statistics
    public static class EnrollmentStats {
        private Long courseId;
        private long enrolledStudents;
        
        public EnrollmentStats(Long courseId, long enrolledStudents) {
            this.courseId = courseId;
            this.enrolledStudents = enrolledStudents;
        }
        
        public Long getCourseId() { return courseId; }
        public long getEnrolledStudents() { return enrolledStudents; }
    }
}
