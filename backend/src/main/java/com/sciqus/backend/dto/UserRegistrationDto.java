package com.sciqus.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.sciqus.backend.entity.User;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserRegistrationDto {
    private String name; // Full name from frontend
    private String email;
    private String password;
    private String role; // Role from frontend (STUDENT, TEACHER)
    private String phoneNumber;
    
    // Legacy fields for backward compatibility
    private String username;
    private String firstName;
    private String lastName;
    
    // Helper method to get first name from full name
    public String getFirstName() {
        if (firstName != null) return firstName;
        if (name == null) return null;
        String[] parts = name.trim().split("\\s+");
        return parts[0];
    }
    
    // Helper method to get last name from full name
    public String getLastName() {
        if (lastName != null) return lastName;
        if (name == null) return null;
        String[] parts = name.trim().split("\\s+");
        return parts.length > 1 ? String.join(" ", java.util.Arrays.copyOfRange(parts, 1, parts.length)) : "";
    }
    
    // Helper method to generate username from email or use provided username
    public String getUsername() {
        // If username is provided by user, use it
        if (username != null && !username.trim().isEmpty()) {
            return username.trim().toLowerCase();
        }
        // Otherwise, generate from email as fallback
        if (email == null || email.isEmpty()) return null;
        String emailUsername = email.split("@")[0];
        return emailUsername.replaceAll("[^a-zA-Z0-9_]", "_").toLowerCase();
    }
    
    // Helper method to get role enum
    public User.Role getRoleEnum() {
        if (role == null) return User.Role.STUDENT;
        try {
            return User.Role.valueOf(role.toUpperCase());
        } catch (IllegalArgumentException e) {
            return User.Role.STUDENT;
        }
    }
}
