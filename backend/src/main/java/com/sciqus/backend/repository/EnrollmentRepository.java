package com.sciqus.backend.repository;

import com.sciqus.backend.entity.Enrollment;
import com.sciqus.backend.entity.User;
import com.sciqus.backend.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    
    List<Enrollment> findByStudent(User student);
    List<Enrollment> findByCourse(Course course);
    Optional<Enrollment> findByStudentAndCourse(User student, Course course);
    boolean existsByStudentAndCourse(User student, Course course);
    long countByCourse(Course course);
    
    @Query("SELECT e.student FROM Enrollment e WHERE e.course.courseId = :courseId")
    List<User> findStudentsByCourseId(@Param("courseId") Long courseId);
    
    @Query("SELECT e.student FROM Enrollment e WHERE e.course.courseId = :courseId AND e.student.id = :studentId")
    Optional<User> findStudentInCourse(@Param("courseId") Long courseId, @Param("studentId") Long studentId);
}
