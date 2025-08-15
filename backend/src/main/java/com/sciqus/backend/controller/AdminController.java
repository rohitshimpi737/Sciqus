package com.sciqus.backend.controller;

import com.sciqus.backend.dto.ApiResponseDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.sciqus.backend.service.UserService;
import com.sciqus.backend.service.CourseService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private CourseService courseService;
    
    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponseDto<Map<String, Object>>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Get basic statistics
        stats.put("totalUsers", userService.getTotalUserCount());
        stats.put("totalStudents", userService.getStudentCount());
        stats.put("totalCourses", courseService.getTotalCourseCount());
        stats.put("activeCourses", courseService.getActiveCourseCount());
        
        return ResponseEntity.ok(ApiResponseDto.success("Dashboard stats retrieved successfully", stats));
    }
    
    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponseDto<?>> getAllUsers() {
        return ResponseEntity.ok(ApiResponseDto.success("Users retrieved successfully", userService.getAllUsers()));
    }
    
    @GetMapping("/courses")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponseDto<?>> getAllCoursesForAdmin() {
        return ResponseEntity.ok(ApiResponseDto.success("Courses retrieved successfully", courseService.getAllCourses()));
    }
}
