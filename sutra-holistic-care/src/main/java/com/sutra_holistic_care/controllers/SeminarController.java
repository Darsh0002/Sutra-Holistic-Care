package com.sutra_holistic_care.controllers;

import com.sutra_holistic_care.entities.Seminar;
import com.sutra_holistic_care.req.ApiResponse;
import com.sutra_holistic_care.services.SeminarService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user/seminars")
@RequiredArgsConstructor
public class SeminarController {

    private final SeminarService seminarService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Seminar>>> getUpcomingSeminars() {
        List<Seminar> seminars = seminarService.getUpcomingSeminars();
        return ResponseEntity.ok(ApiResponse.success(seminars));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Seminar>> getSeminar(@PathVariable String id) {
        Seminar seminar = seminarService.getSeminar(id);
        return ResponseEntity.ok(ApiResponse.success(seminar));
    }
}
