package com.sciqus.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JwtResponseDto {
    private boolean success = true;
    private String message = "Login successful";
    private AuthData data;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AuthData {
        private UserInfo user;
        private String token;
        private String tokenType = "Bearer";
        private long expiresIn = 86400; // 24 hours in seconds
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserInfo {
        private Long id;
        private String email;
        private String username;
        private String role;
        private Boolean isActive;
        private String firstName;
        private String lastName;
        private String phoneNumber;
    }
    
    // Constructor for creating the response with complete user info
    public JwtResponseDto(String accessToken, Long id, String username, String email, String role, 
                         Boolean isActive, String firstName, String lastName, String phoneNumber, long expiresIn) {
        this.success = true;
        this.message = "Login successful";
        this.data = new AuthData(
            new UserInfo(id, email, username, role, isActive, firstName, lastName, phoneNumber),
            accessToken,
            "Bearer",
            expiresIn
        );
    }
    
    // Constructor for creating the response (with default expiry)
    public JwtResponseDto(String accessToken, Long id, String username, String email, String role, 
                         Boolean isActive, String firstName, String lastName, String phoneNumber) {
        this(accessToken, id, username, email, role, isActive, firstName, lastName, phoneNumber, 86400);
    }
    
    // Backward compatibility constructor
    public JwtResponseDto(String accessToken, Long id, String username, String email, String role, long expiresIn) {
        this(accessToken, id, username, email, role, true, null, null, null, expiresIn);
    }
    
    // Backward compatibility constructor
    public JwtResponseDto(String accessToken, Long id, String username, String email, String role) {
        this(accessToken, id, username, email, role, 86400);
    }
}
