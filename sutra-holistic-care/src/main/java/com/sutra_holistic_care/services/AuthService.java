package com.sutra_holistic_care.services;

import com.sutra_holistic_care.req.AdminLoginRequest;
import com.sutra_holistic_care.req.AdminRegisterRequest;
import com.sutra_holistic_care.req.AuthResponse;
import com.sutra_holistic_care.entities.Admin;
import com.sutra_holistic_care.exceptions.BusinessException;
import com.sutra_holistic_care.exceptions.ResourceNotFoundException;
import com.sutra_holistic_care.repositories.AdminRepository;
import com.sutra_holistic_care.utils.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public AuthResponse registerSuperAdmin(AdminRegisterRequest request) {
        request.setRole("SUPER_ADMIN");
        return registerAdmin(request);
    }

    public AuthResponse registerAdmin(AdminRegisterRequest request) {
        if (adminRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("Email already registered");
        }

        String role = (request.getRole() != null && !request.getRole().isBlank()) 
                ? request.getRole().toUpperCase() 
                : "STAFF";

        Admin admin = Admin.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .mobile(request.getMobile())
                .role(role)
                .createdAt(java.time.LocalDateTime.now())
                .build();

        Admin saved = adminRepository.save(admin);
        String token = jwtUtils.generateToken(saved.getEmail(), saved.getRole());

        return AuthResponse.builder()
                .token(token)
                .id(saved.getId())
                .name(saved.getName())
                .email(saved.getEmail())
                .role(saved.getRole())
                .build();
    }

    public AuthResponse loginAdmin(AdminLoginRequest request) {
        Admin admin = adminRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found with email: " + request.getEmail()));

        if (!passwordEncoder.matches(request.getPassword(), admin.getPassword())) {
            throw new BusinessException("Invalid credentials");
        }

        // Migration fallback for legacy accounts without a role set
        if (admin.getRole() == null || admin.getRole().isBlank()) {
            admin.setRole("SUPER_ADMIN");
            adminRepository.save(admin);
        }

        String token = jwtUtils.generateToken(admin.getEmail(), admin.getRole());

        return AuthResponse.builder()
                .token(token)
                .id(admin.getId())
                .name(admin.getName())
                .email(admin.getEmail())
                .role(admin.getRole())
                .build();
    }
}