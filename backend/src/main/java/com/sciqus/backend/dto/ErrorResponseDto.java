package com.sciqus.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponseDto {
    private boolean success = false;
    private String message;
    private String error;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'")
    private LocalDateTime timestamp;
    
    public ErrorResponseDto(String message, String error) {
        this.success = false;
        this.message = message;
        this.error = error;
        this.timestamp = LocalDateTime.now();
    }
    
    // Common error types
    public static ErrorResponseDto invalidCredentials() {
        return new ErrorResponseDto("Invalid credentials", "INVALID_CREDENTIALS");
    }
    
    public static ErrorResponseDto userNotFound() {
        return new ErrorResponseDto("User not found", "USER_NOT_FOUND");
    }
    
    public static ErrorResponseDto usernameExists() {
        return new ErrorResponseDto("Username is already taken", "USERNAME_ALREADY_EXISTS");
    }
    
    public static ErrorResponseDto emailExists() {
        return new ErrorResponseDto("Email is already in use", "EMAIL_ALREADY_EXISTS");
    }
    
    public static ErrorResponseDto unauthorized() {
        return new ErrorResponseDto("Unauthorized access", "UNAUTHORIZED");
    }
    
    public static ErrorResponseDto forbidden() {
        return new ErrorResponseDto("Access forbidden", "FORBIDDEN");
    }
    
    public static ErrorResponseDto invalidInput(String message) {
        return new ErrorResponseDto(message, "INVALID_INPUT");
    }
    
    public static ErrorResponseDto internalError() {
        return new ErrorResponseDto("Internal server error", "INTERNAL_SERVER_ERROR");
    }
}
