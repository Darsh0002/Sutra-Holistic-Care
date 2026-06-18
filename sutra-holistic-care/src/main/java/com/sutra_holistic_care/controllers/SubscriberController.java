package com.sutra_holistic_care.controllers;

import com.sutra_holistic_care.entities.Subscriber;
import com.sutra_holistic_care.req.ApiResponse;
import com.sutra_holistic_care.services.SubscriberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Admin-only endpoints for the subscriber / marketing CRM.
 * Secured via the existing JWT filter (admin role required).
 */
@RestController
@RequestMapping("/api/admin/subscribers")
@RequiredArgsConstructor
public class SubscriberController {

    private final SubscriberService subscriberService;

    /** Return all subscribers ordered by most-recently-seen */
    @GetMapping
    public ResponseEntity<ApiResponse<List<Subscriber>>> getAllSubscribers() {
        return ResponseEntity.ok(ApiResponse.success(subscriberService.getAllSubscribers()));
    }

    /** Search subscribers by name, email, or mobile */
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<Subscriber>>> searchSubscribers(
            @RequestParam String q) {
        return ResponseEntity.ok(ApiResponse.success(subscriberService.searchSubscribers(q)));
    }

    /** Summary counts for the overview dashboard */
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getSubscriberStats() {
        Map<String, Long> stats = Map.of(
                "total",         subscriberService.getTotalCount(),
                "fromOrders",    subscriberService.getCountBySource(Subscriber.SubscriberSource.ORDER),
                "fromConsults",  subscriberService.getCountBySource(Subscriber.SubscriberSource.CONSULTATION),
                "fromSeminars",  subscriberService.getCountBySource(Subscriber.SubscriberSource.SEMINAR)
        );
        return ResponseEntity.ok(ApiResponse.success(stats));
    }
}
