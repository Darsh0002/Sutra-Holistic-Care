package com.sutra_holistic_care.controllers;

import com.sutra_holistic_care.entities.Order;
import com.sutra_holistic_care.req.ApiResponse;
import com.sutra_holistic_care.req.OrderRequest;
import com.sutra_holistic_care.services.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<ApiResponse<Order>> createOrder(@RequestBody OrderRequest request) {
        Order order = orderService.createOrder(request);
        return ResponseEntity.ok(ApiResponse.success("Order created successfully", order));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Order>> getOrder(@PathVariable String id) {
        Order order = orderService.getOrder(id);
        return ResponseEntity.ok(ApiResponse.success(order));
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<ApiResponse<List<Order>>> getOrdersByEmail(@PathVariable String email) {
        List<Order> orders = orderService.getOrdersByEmail(email);
        return ResponseEntity.ok(ApiResponse.success(orders));
    }

    /**
     * Cancel an unpaid order — called by the frontend when the user
     * dismisses or fails the Razorpay payment modal.
     * Only deletes the record if it is still in PENDING status (never paid).
     */
    @DeleteMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<Void>> cancelOrder(@PathVariable String id) {
        orderService.cancelUnpaidOrder(id);
        return ResponseEntity.ok(ApiResponse.success("Order cancelled", null));
    }
}
