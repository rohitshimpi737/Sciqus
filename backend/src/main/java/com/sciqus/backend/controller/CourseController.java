package com.sciqus.backend.controller;

import com.sciqus.backend.dto.CourseDto;
import com.sciqus.backend.dto.CourseResponseDto;
import com.sciqus.backend.dto.CourseStatusDto;
import com.sciqus.backend.entity.Course;
import com.sciqus.backend.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/courses")
public class CourseController {
    
    @Autowired
    private CourseService courseService;
    
    @GetMapping
    public ResponseEntity<List<CourseResponseDto>> getAllCourses() {
        List<Course> courses = courseService.getAllCourses();
        List<CourseResponseDto> courseDtos = courses.stream()
                .map(this::mapToCourseResponseDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(courseDtos);
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STUDENT')")
    public ResponseEntity<CourseResponseDto> getCourseById(@PathVariable Long id) {
        Course course = courseService.getCourseById(id)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + id));
        return ResponseEntity.ok(mapToCourseResponseDto(course));
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<CourseResponseDto>> searchCourses(@RequestParam String keyword) {
        List<Course> courses = courseService.searchCourses(keyword);
        List<CourseResponseDto> courseDtos = courses.stream()
                .map(this::mapToCourseResponseDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(courseDtos);
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CourseResponseDto> createCourse(@RequestBody CourseDto courseDto) {
        Course course = mapToCourse(courseDto);
        Course savedCourse = courseService.createCourse(course);
        return ResponseEntity.ok(mapToCourseResponseDto(savedCourse));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CourseResponseDto> updateCourse(@PathVariable Long id, @RequestBody CourseDto courseDto) {
        Course existingCourse = courseService.getCourseById(id)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + id));
        
        existingCourse.setCourseName(courseDto.getCourseName());
        existingCourse.setCourseCode(courseDto.getCourseCode());
        existingCourse.setCourseDuration(courseDto.getCourseDuration());
        existingCourse.setDescription(courseDto.getDescription());
        
        Course updatedCourse = courseService.updateCourse(existingCourse);
        return ResponseEntity.ok(mapToCourseResponseDto(updatedCourse));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
        return ResponseEntity.ok("Course deleted successfully");
    }
    
    // Activate a course
    @PutMapping("/{id}/course-status/activate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CourseResponseDto> activateCourse(@PathVariable Long id) {
        Course course = courseService.getCourseById(id)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + id));
        
        course.setIsActive(true);
        Course updatedCourse = courseService.updateCourse(course);
        return ResponseEntity.ok(mapToCourseResponseDto(updatedCourse));
    }
    
    // Deactivate a course
    @PutMapping("/{id}/course-status/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CourseResponseDto> deactivateCourse(@PathVariable Long id) {
        Course course = courseService.getCourseById(id)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + id));
        
        course.setIsActive(false);
        Course updatedCourse = courseService.updateCourse(course);
        return ResponseEntity.ok(mapToCourseResponseDto(updatedCourse));
    }
    
    // Toggle course status (active/inactive)
    @PutMapping("/{id}/course-status/toggle")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CourseResponseDto> toggleCourseStatus(@PathVariable Long id) {
        Course course = courseService.getCourseById(id)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + id));
        
        course.setIsActive(!course.getIsActive());
        Course updatedCourse = courseService.updateCourse(course);
        return ResponseEntity.ok(mapToCourseResponseDto(updatedCourse));
    }
    
    // Get only active courses
    @GetMapping("/filter/active")
    public ResponseEntity<List<CourseResponseDto>> getActiveCourses() {
        List<Course> activeCourses = courseService.getActiveCourses();
        List<CourseResponseDto> courseDtos = activeCourses.stream()
                .map(this::mapToCourseResponseDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(courseDtos);
    }
    
    // Get only inactive courses
    @GetMapping("/filter/inactive")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<CourseResponseDto>> getInactiveCourses() {
        List<Course> inactiveCourses = courseService.getInactiveCourses();
        List<CourseResponseDto> courseDtos = inactiveCourses.stream()
                .map(this::mapToCourseResponseDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(courseDtos);
    }
    
    // Get course status
    @GetMapping("/{id}/course-status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CourseStatusDto> getCourseStatus(@PathVariable Long id) {
        Course course = courseService.getCourseById(id)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + id));
        
        CourseStatusDto statusDto = new CourseStatusDto();
        statusDto.setCourseId(course.getCourseId());
        statusDto.setCourseName(course.getCourseName());
        statusDto.setIsActive(course.getIsActive());
        statusDto.setStatus(course.getIsActive() ? "ACTIVE" : "INACTIVE");
        
        return ResponseEntity.ok(statusDto);
    }
    
    private Course mapToCourse(CourseDto courseDto) {
        Course course = new Course();
        course.setCourseName(courseDto.getCourseName());
        course.setCourseCode(courseDto.getCourseCode());
        course.setCourseDuration(courseDto.getCourseDuration());
        course.setDescription(courseDto.getDescription());
        return course;
    }
    
    private CourseResponseDto mapToCourseResponseDto(Course course) {
        CourseResponseDto dto = new CourseResponseDto();
        dto.setCourseId(course.getCourseId());
        dto.setCourseName(course.getCourseName());
        dto.setCourseCode(course.getCourseCode());
        dto.setCourseDuration(course.getCourseDuration());
        dto.setDescription(course.getDescription());
        dto.setIsActive(course.getIsActive());
        dto.setCreatedAt(course.getCreatedAt());
        dto.setUpdatedAt(course.getUpdatedAt());
        return dto;
    }
}
