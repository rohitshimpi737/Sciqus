package com.sciqus.backend.service;

import com.sciqus.backend.entity.Course;
import com.sciqus.backend.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CourseService {
    
    @Autowired
    private CourseRepository courseRepository;
    
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }
    
    public Optional<Course> getCourseById(Long courseId) {
        return courseRepository.findById(courseId);
    }
    
    public Optional<Course> getCourseByCode(String courseCode) {
        return courseRepository.findByCourseCode(courseCode);
    }
    
    public List<Course> searchCourses(String keyword) {
        return courseRepository.searchCourses(keyword);
    }
    
    public Course createCourse(Course course) {
        if (courseRepository.existsByCourseCode(course.getCourseCode())) {
            throw new RuntimeException("Course with code " + course.getCourseCode() + " already exists");
        }
        return courseRepository.save(course);
    }
    
    public Course updateCourse(Course course) {
        return courseRepository.save(course);
    }
    
    public void deleteCourse(Long courseId) {
        courseRepository.deleteById(courseId);
    }
    
    public boolean existsByCourseCode(String courseCode) {
        return courseRepository.existsByCourseCode(courseCode);
    }
    
    public long getTotalCourseCount() {
        return courseRepository.count();
    }
    
    public long getActiveCourseCount() {
        return courseRepository.countByIsActiveTrue();
    }
    
    public List<Course> getActiveCourses() {
        return courseRepository.findByIsActiveTrue();
    }
    
    public List<Course> getInactiveCourses() {
        return courseRepository.findByIsActiveFalse();
    }
    
    public Course toggleCourseStatus(Long courseId) {
        Course course = getCourseById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + courseId));
        course.setIsActive(!course.getIsActive());
        return updateCourse(course);
    }
    
    public Course activateCourse(Long courseId) {
        Course course = getCourseById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + courseId));
        course.setIsActive(true);
        return updateCourse(course);
    }
    
    public Course deactivateCourse(Long courseId) {
        Course course = getCourseById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + courseId));
        course.setIsActive(false);
        return updateCourse(course);
    }
}
