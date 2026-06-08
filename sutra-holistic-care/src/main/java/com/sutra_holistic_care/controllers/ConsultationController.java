package com.sutra_holistic_care.controllers;

import com.sutra_holistic_care.entities.Consultation;
import com.sutra_holistic_care.req.ApiResponse;
import com.sutra_holistic_care.req.ConsultationRequest;
import com.sutra_holistic_care.services.ConsultationService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/user/consultations")
@RequiredArgsConstructor
public class ConsultationController {

    private final ConsultationService consultationService;

    @PostMapping
    public ResponseEntity<ApiResponse<Consultation>> bookConsultation(@RequestBody ConsultationRequest request) {
        Consultation consultation = consultationService.bookConsultation(request);
        return ResponseEntity.ok(ApiResponse.success("Consultation booked successfully", consultation));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Consultation>> getConsultation(@PathVariable String id) {
        Consultation consultation = consultationService.getConsultation(id);
        return ResponseEntity.ok(ApiResponse.success(consultation));
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<ApiResponse<List<Consultation>>> getConsultationsByEmail(@PathVariable String email) {
        List<Consultation> consultations = consultationService.getConsultationsByEmail(email);
        return ResponseEntity.ok(ApiResponse.success(consultations));
    }

    @GetMapping("/slots")
    public ResponseEntity<ApiResponse<List<String>>> getAvailableSlots(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<String> slots = consultationService.getAvailableSlots(date);
        return ResponseEntity.ok(ApiResponse.success(slots));
    }
}
