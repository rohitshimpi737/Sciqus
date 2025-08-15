package com.sciqus.backend.repository;

import com.sciqus.backend.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    
    Optional<Course> findByCourseCode(String courseCode);
    List<Course> findByCourseNameContainingIgnoreCase(String courseName);
    boolean existsByCourseCode(String courseCode);
    
    @Query("SELECT c FROM Course c WHERE c.courseName LIKE %:keyword% OR c.courseCode LIKE %:keyword% OR c.description LIKE %:keyword%")
    List<Course> searchCourses(@Param("keyword") String keyword);
    
    Long countByIsActiveTrue();
    List<Course> findByIsActiveTrue();
    List<Course> findByIsActiveFalse();
    Long countByIsActiveFalse();
}
