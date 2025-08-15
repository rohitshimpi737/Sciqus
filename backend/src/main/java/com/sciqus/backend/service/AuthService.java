package com.sciqus.backend.service;

import com.sciqus.backend.dto.JwtResponseDto;
import com.sciqus.backend.dto.LoginDto;
import com.sciqus.backend.dto.UserRegistrationDto;
import com.sciqus.backend.dto.UserResponseDto;
import com.sciqus.backend.entity.User;
import com.sciqus.backend.exception.UserAlreadyExistsException;
import com.sciqus.backend.util.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private JwtUtils jwtUtils;
    
    @Value("${app.jwtExpirationMs}")
    private int jwtExpirationMs;
    
    public JwtResponseDto login(LoginDto loginDto) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginDto.getUsernameOrEmail(),
                        loginDto.getPassword()
                )
        );
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User user = userService.getUserByUsername(userDetails.getUsername()).orElse(null);
        
        // Convert milliseconds to seconds for expiresIn
        long expiresInSeconds = jwtExpirationMs / 1000;
        
        return new JwtResponseDto(
            jwt, 
            user.getId(), 
            user.getUsername(), 
            user.getEmail(), 
            user.getRole().toString(),
            user.getIsActive(),
            user.getFirstName(),
            user.getLastName(),
            user.getPhoneNumber(),
            expiresInSeconds
        );
    }
    
    public UserResponseDto register(UserRegistrationDto registerDto) {
        if (userService.existsByUsername(registerDto.getUsername())) {
            throw new UserAlreadyExistsException("Username is already taken!");
        }
        
        if (userService.existsByEmail(registerDto.getEmail())) {
            throw new UserAlreadyExistsException("Email is already in use!");
        }
        
        User user = new User();
        user.setUsername(registerDto.getUsername());
        user.setEmail(registerDto.getEmail());
        user.setPassword(registerDto.getPassword());
        user.setFirstName(registerDto.getFirstName());
        user.setLastName(registerDto.getLastName());
        user.setPhoneNumber(registerDto.getPhoneNumber());
        user.setRole(User.Role.STUDENT);
        
        User savedUser = userService.createUser(user);
        
        return mapToUserResponseDto(savedUser);
    }
    
    public UserResponseDto getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User user = userService.getUserByUsername(username).orElse(null);
        return mapToUserResponseDto(user);
    }
    
    private UserResponseDto mapToUserResponseDto(User user) {
        UserResponseDto dto = new UserResponseDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setRole(user.getRole().toString());
        dto.setIsActive(user.getIsActive());
        dto.setCourseId(user.getCourseId());
        return dto;
    }
}
