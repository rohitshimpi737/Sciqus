package com.sciqus.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentCourseInfoDto {
    private String studentName;
    private String message;
    private EnrolledCourseDto enrolledCourse;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EnrolledCourseDto {
        private Long courseId;
        private String courseName;
        private String courseCode;
        private Integer courseDuration;
    }
}
