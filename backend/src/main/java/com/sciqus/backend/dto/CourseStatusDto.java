package com.sciqus.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseStatusDto {
    private Long courseId;
    private String courseName;
    private Boolean isActive;
    private String status; // "ACTIVE" or "INACTIVE"
}
