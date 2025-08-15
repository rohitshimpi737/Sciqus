package com.sciqus.backend.controller;

import com.sciqus.backend.dto.*;
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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/student")
public class StudentController {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private CourseService courseService;
    
    @Autowired
    private EnrollmentService enrollmentService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // ================================
    // DASHBOARD & OVERVIEW ENDPOINTS
    // ================================

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Map<String, Object>> getStudentDashboard() {
        User student = getCurrentStudent();
        Map<String, Object> dashboard = new HashMap<>();
        
        // Basic student info
        dashboard.put("studentName", student.getFirstName() + " " + student.getLastName());
        dashboard.put("username", student.getUsername());
        dashboard.put("email", student.getEmail());
        
        // Enrollment stats
        List<Enrollment> enrollments = enrollmentService.getEnrollmentsByStudent(student);
        dashboard.put("totalEnrollments", enrollments.size());
        dashboard.put("hasEnrollments", !enrollments.isEmpty());
        
        // Available courses count
        List<Course> availableCourses = courseService.getActiveCourses();
        dashboard.put("availableCourses", availableCourses.size());
        
        return ResponseEntity.ok(dashboard);
    }

    @GetMapping("/profile")
    @PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN')")
    public ResponseEntity<UserResponseDto> getStudentProfile() {
        User student = getCurrentStudent();
        return ResponseEntity.ok(mapToUserResponseDto(student));
    }

    @GetMapping("/course")
    @PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN')")
    public ResponseEntity<StudentCourseInfoDto> getStudentCourse() {
        User student = getCurrentStudent();
        List<Enrollment> enrollments = enrollmentService.getEnrollmentsByStudent(student);
        
        if (enrollments.isEmpty()) {
            StudentCourseInfoDto response = new StudentCourseInfoDto();
            response.setStudentName(student.getFirstName() + " " + student.getLastName());
            response.setMessage("Student is not enrolled in any course");
            response.setEnrolledCourse(null);
            return ResponseEntity.ok(response);
        }
        
        // Get the first active enrollment (assuming one course per student for now)
        Enrollment enrollment = enrollments.get(0);
        Course course = enrollment.getCourse();
        
        StudentCourseInfoDto.EnrolledCourseDto courseDto = new StudentCourseInfoDto.EnrolledCourseDto();
        courseDto.setCourseId(course.getCourseId());
        courseDto.setCourseName(course.getCourseName());
        courseDto.setCourseCode(course.getCourseCode());
        courseDto.setCourseDuration(course.getCourseDuration());
        
        StudentCourseInfoDto response = new StudentCourseInfoDto();
        response.setStudentName(student.getFirstName() + " " + student.getLastName());
        response.setMessage("Student enrolled course information");
        response.setEnrolledCourse(courseDto);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/account-status")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Map<String, Object>> getAccountStatus() {
        User student = getCurrentStudent();
        Map<String, Object> status = new HashMap<>();
        status.put("isActive", student.getIsActive());
        status.put("role", student.getRole().toString());
        status.put("emailVerified", true); // Assuming email is verified for simplicity
        
        return ResponseEntity.ok(status);
    }

    // ================================
    // ENROLLMENT MANAGEMENT ENDPOINTS
    // ================================

    @GetMapping("/enrollments")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<EnrollmentResponseDto>> getMyEnrollments() {
        User student = getCurrentStudent();
        List<Enrollment> enrollments = enrollmentService.getEnrollmentsByStudent(student);
        List<EnrollmentResponseDto> enrollmentDtos = enrollments.stream()
                .map(this::mapToEnrollmentResponseDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(enrollmentDtos);
    }

    @GetMapping("/available-courses")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<CourseResponseDto>> getAvailableCourses() {
        User student = getCurrentStudent();
        
        // Get all active courses
        List<Course> allActiveCourses = courseService.getActiveCourses();
        
        // Get student's enrolled courses
        List<Enrollment> enrollments = enrollmentService.getEnrollmentsByStudent(student);
        List<Long> enrolledCourseIds = enrollments.stream()
                .map(enrollment -> enrollment.getCourse().getCourseId())
                .collect(Collectors.toList());
        
        // Filter out already enrolled courses
        List<Course> availableCourses = allActiveCourses.stream()
                .filter(course -> !enrolledCourseIds.contains(course.getCourseId()))
                .collect(Collectors.toList());

        List<CourseResponseDto> courseDtos = availableCourses.stream()
                .map(this::mapToCourseResponseDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(courseDtos);
    }

    @PostMapping("/enroll/{courseId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<String> enrollInCourse(@PathVariable Long courseId) {
        User student = getCurrentStudent();
        Course course = courseService.getCourseById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        
        enrollmentService.enrollStudentInCourse(student, course);
        
        return ResponseEntity.ok("Successfully enrolled in course: " + course.getCourseName());
    }

    @DeleteMapping("/enrollments/{courseId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<String> unenrollFromCourse(@PathVariable Long courseId) {
        User student = getCurrentStudent();
        Course course = courseService.getCourseById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        enrollmentService.unenrollStudentFromCourse(student, course);
        
        return ResponseEntity.ok("Successfully unenrolled from course: " + course.getCourseName());
    }

    // ================================
    // PROFILE MANAGEMENT ENDPOINTS
    // ================================

    @PutMapping("/profile")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<UserResponseDto> updateProfile(@RequestBody UserResponseDto profileDto) {
        User student = getCurrentStudent();

        // Only allow updating certain fields
        student.setFirstName(profileDto.getFirstName());
        student.setLastName(profileDto.getLastName());
        student.setPhoneNumber(profileDto.getPhoneNumber());
        // Note: Cannot change username, email, role via this endpoint

        User updatedStudent = userService.updateUser(student);
        return ResponseEntity.ok(mapToUserResponseDto(updatedStudent));
    }

    @PutMapping("/contact-info")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<UserResponseDto> updateContactInfo(@RequestBody ContactInfoRequest request) {
        User student = getCurrentStudent();

        // Update contact information
        student.setEmail(request.getEmail());
        student.setPhoneNumber(request.getPhoneNumber());
        
        User updatedStudent = userService.updateUser(student);
        return ResponseEntity.ok(mapToUserResponseDto(updatedStudent));
    }

    @PutMapping("/change-password")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<String> changePassword(@RequestBody ChangePasswordRequest request) {
        User student = getCurrentStudent();

        // Verify current password
        if (!passwordEncoder.matches(request.getCurrentPassword(), student.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        // Update password
        student.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userService.updateUser(student);

        return ResponseEntity.ok("Password changed successfully");
    }

    // ================================
    // HELPER METHODS
    // ================================

    private User getCurrentStudent() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userService.getUserByUsername(username)
                .orElseThrow(() -> new RuntimeException("Student not found"));
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

    private CourseResponseDto mapToCourseResponseDto(Course course) {
        CourseResponseDto dto = new CourseResponseDto();
        dto.setCourseId(course.getCourseId());
        dto.setCourseName(course.getCourseName());
        dto.setCourseCode(course.getCourseCode());
        dto.setCourseDuration(course.getCourseDuration());
        dto.setDescription(course.getDescription());
        dto.setIsActive(course.getIsActive());
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

    // ================================
    // REQUEST DTOs
    // ================================

    public static class ChangePasswordRequest {
        private String currentPassword;
        private String newPassword;
        
        public String getCurrentPassword() { return currentPassword; }
        public void setCurrentPassword(String currentPassword) { this.currentPassword = currentPassword; }
        public String getNewPassword() { return newPassword; }
        public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
    }

    public static class ContactInfoRequest {
        private String email;
        private String phoneNumber;
        
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPhoneNumber() { return phoneNumber; }
        public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    }
}
