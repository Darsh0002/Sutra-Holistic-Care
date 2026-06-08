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

    public AuthResponse registerAdmin(AdminRegisterRequest request) {
        if (adminRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("Email already registered");
        }

        Admin admin = Admin.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .mobile(request.getMobile())
                .build();

        Admin saved = adminRepository.save(admin);
        String token = jwtUtils.generateToken(saved.getEmail(), "ADMIN");

        return AuthResponse.builder()
                .token(token)
                .id(saved.getId())
                .name(saved.getName())
                .email(saved.getEmail())
                .role("ADMIN")
                .build();
    }

    public AuthResponse loginAdmin(AdminLoginRequest request) {
        Admin admin = adminRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found with email: " + request.getEmail()));

        if (!passwordEncoder.matches(request.getPassword(), admin.getPassword())) {
            throw new BusinessException("Invalid credentials");
        }

        String token = jwtUtils.generateToken(admin.getEmail(), "ADMIN");

        return AuthResponse.builder()
                .token(token)
                .id(admin.getId())
                .name(admin.getName())
                .email(admin.getEmail())
                .role("ADMIN")
                .build();
    }
}