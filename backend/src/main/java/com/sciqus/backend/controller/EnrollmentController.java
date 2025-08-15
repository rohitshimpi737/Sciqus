package com.sciqus.backend.controller;

import com.sciqus.backend.dto.EnrollmentResponseDto;
import com.sciqus.backend.dto.UserResponseDto;
import com.sciqus.backend.entity.Course;
import com.sciqus.backend.entity.Enrollment;
import com.sciqus.backend.entity.User;
import com.sciqus.backend.service.CourseService;
import com.sciqus.backend.service.EnrollmentService;
import com.sciqus.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class EnrollmentController {
    
    @Autowired
    private EnrollmentService enrollmentService;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private CourseService courseService;
    
    // Enroll a student in a course
    @PostMapping("/courses/{courseId}/enroll")
    @PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN')")
    public ResponseEntity<EnrollmentResponseDto> enrollInCourse(@PathVariable Long courseId) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            
            User user = userService.getUserByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            Course course = courseService.getCourseById(courseId)
                    .orElseThrow(() -> new RuntimeException("Course not found with id: " + courseId));
            
            // Check if enrollment is possible
            if (!enrollmentService.canStudentEnrollInCourse(user, course)) {
                throw new RuntimeException("You cannot enroll in this course");
            }
            
            Enrollment enrollment = enrollmentService.enrollStudent(user, course);
            return ResponseEntity.ok(mapToEnrollmentResponseDto(enrollment));
            
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid request: " + e.getMessage());
        }
    }
    
    // Get students enrolled in a course
    @GetMapping("/courses/{courseId}/students")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponseDto>> getStudentsInCourse(@PathVariable Long courseId) {
        List<User> students = enrollmentService.getStudentsByCourseId(courseId);
        List<UserResponseDto> studentDtos = students.stream()
                .map(this::mapToUserResponseDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(studentDtos);
    }
    
    // Enroll Student in Course - using courseId and studentId in path
    @PostMapping("/courses/{courseId}/students/{studentId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EnrollmentResponseDto> enrollStudentInCourse(
            @PathVariable Long courseId, 
            @PathVariable Long studentId) {
        
        try {
            User student = userService.getUserById(studentId)
                    .orElseThrow(() -> new RuntimeException("Student not found with id: " + studentId));
            
            Course course = courseService.getCourseById(courseId)
                    .orElseThrow(() -> new RuntimeException("Course not found with id: " + courseId));
            
            // Check if enrollment is possible
            if (!enrollmentService.canStudentEnrollInCourse(student, course)) {
                throw new RuntimeException("Student cannot be enrolled in this course");
            }
            
            Enrollment enrollment = enrollmentService.enrollStudent(student, course);
            return ResponseEntity.ok(mapToEnrollmentResponseDto(enrollment));
            
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid input: " + e.getMessage());
        }
    }
    
    // Get specific student from course
    @GetMapping("/courses/{courseId}/students/{studentId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponseDto> getStudentInCourse(@PathVariable Long courseId, @PathVariable Long studentId) {
        User student = enrollmentService.getStudentInCourse(courseId, studentId);
        return ResponseEntity.ok(mapToUserResponseDto(student));
    }
    
    // Get all enrollments
    @GetMapping("/enrollments")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<EnrollmentResponseDto>> getAllEnrollments() {
        List<Enrollment> enrollments = enrollmentService.getAllEnrollments();
        List<EnrollmentResponseDto> enrollmentDtos = enrollments.stream()
                .map(this::mapToEnrollmentResponseDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(enrollmentDtos);
    }
    
    // Get enrollment statistics for a course
    @GetMapping("/courses/{courseId}/enrollment-stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EnrollmentService.EnrollmentStats> getCourseEnrollmentStats(@PathVariable Long courseId) {
        EnrollmentService.EnrollmentStats stats = enrollmentService.getCourseEnrollmentStats(courseId);
        return ResponseEntity.ok(stats);
    }
    
    // Check if student can enroll in course
    @GetMapping("/courses/{courseId}/can-enroll")
    @PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN')")
    public ResponseEntity<Boolean> canEnrollInCourse(@PathVariable Long courseId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        User user = userService.getUserByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Course course = courseService.getCourseById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        
        boolean canEnroll = enrollmentService.canStudentEnrollInCourse(user, course);
        return ResponseEntity.ok(canEnroll);
    }
    
    // UNENROLL STUDENT FROM COURSE - CRITICAL MISSING ENDPOINT
    @DeleteMapping("/courses/{courseId}/students/{studentId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> unenrollStudentFromCourse(
            @PathVariable Long courseId,
            @PathVariable Long studentId) {
        
        try {
            User student = userService.getUserById(studentId)
                    .orElseThrow(() -> new RuntimeException("Student not found with id: " + studentId));
            
            Course course = courseService.getCourseById(courseId)
                    .orElseThrow(() -> new RuntimeException("Course not found with id: " + courseId));
            
            boolean unenrolled = enrollmentService.unenrollStudentFromCourse(student, course);
            
            if (unenrolled) {
                return ResponseEntity.ok("Student unenrolled successfully from course");
            } else {
                return ResponseEntity.badRequest().body("Student was not enrolled in this course");
            }
            
        } catch (Exception e) {
            throw new RuntimeException("Error unenrolling student: " + e.getMessage());
        }
    }
    
    private EnrollmentResponseDto mapToEnrollmentResponseDto(Enrollment enrollment) {
        EnrollmentResponseDto dto = new EnrollmentResponseDto();
        dto.setEnrollmentId(enrollment.getId());
        dto.setStudentId(enrollment.getStudent().getId());
        dto.setStudentName(enrollment.getStudent().getFirstName() + " " + enrollment.getStudent().getLastName());
        dto.setCourseId(enrollment.getCourse().getCourseId());
        dto.setCourseName(enrollment.getCourse().getCourseName());
        dto.setEnrollmentDate(enrollment.getEnrolledAt());
        return dto;
    }
    
    private UserResponseDto mapToUserResponseDto(User user) {
        UserResponseDto dto = new UserResponseDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setRole(user.getRole().toString());
        dto.setIsActive(user.getIsActive());
        dto.setCourseId(user.getCourseId());
        return dto;
    }
}
