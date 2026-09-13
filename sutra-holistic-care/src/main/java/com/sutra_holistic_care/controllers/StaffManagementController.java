package com.sutra_holistic_care.controllers;

import com.sutra_holistic_care.entities.Admin;
import com.sutra_holistic_care.req.AdminRegisterRequest;
import com.sutra_holistic_care.req.ApiResponse;
import com.sutra_holistic_care.services.StaffManagementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/staff")
@RequiredArgsConstructor
public class StaffManagementController {

    private final StaffManagementService staffManagementService;

    @PostMapping
    public ResponseEntity<ApiResponse<Admin>> addStaff(@RequestBody AdminRegisterRequest request) {
        Admin staff = staffManagementService.addStaff(request);
        return ResponseEntity.ok(ApiResponse.success("Staff account created successfully", staff));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Admin>>> getAllStaff() {
        List<Admin> staffList = staffManagementService.getAllStaff();
        return ResponseEntity.ok(ApiResponse.success("Fetched staff list", staffList));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteStaff(@PathVariable String id) {
        staffManagementService.deleteStaff(id);
        return ResponseEntity.ok(ApiResponse.success("Staff account deleted successfully", id));
    }
}
