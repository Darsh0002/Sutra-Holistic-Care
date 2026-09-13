package com.sutra_holistic_care.controllers;

import com.sutra_holistic_care.entities.StaffActivityLog;
import com.sutra_holistic_care.req.ApiResponse;
import com.sutra_holistic_care.services.StaffActivityLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/logs")
@RequiredArgsConstructor
public class ActivityLogController {

    private final StaffActivityLogService logService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<StaffActivityLog>>> getActivityLogs() {
        List<StaffActivityLog> logs = logService.getAllLogs();
        return ResponseEntity.ok(ApiResponse.success("Staff activity logs fetched successfully", logs));
    }
}
