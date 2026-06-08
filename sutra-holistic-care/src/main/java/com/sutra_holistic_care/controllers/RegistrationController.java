package com.sutra_holistic_care.controllers;

import com.sutra_holistic_care.entities.Registration;
import com.sutra_holistic_care.req.ApiResponse;
import com.sutra_holistic_care.req.RegistrationRequest;
import com.sutra_holistic_care.services.RegistrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user/registrations")
@RequiredArgsConstructor
public class RegistrationController {

    private final RegistrationService registrationService;

    @PostMapping
    public ResponseEntity<ApiResponse<Registration>> createRegistration(@RequestBody RegistrationRequest request) {
        Registration registration = registrationService.createRegistration(request);
        return ResponseEntity.ok(ApiResponse.success("Registration created successfully", registration));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Registration>> getRegistration(@PathVariable String id) {
        Registration registration = registrationService.getRegistration(id);
        return ResponseEntity.ok(ApiResponse.success(registration));
    }

    @GetMapping("/mobile/{mobile}")
    public ResponseEntity<ApiResponse<List<Registration>>> getRegistrationsByMobile(@PathVariable String mobile) {
        List<Registration> registrations = registrationService.getRegistrationsByMobile(mobile);
        return ResponseEntity.ok(ApiResponse.success(registrations));
    }
}
