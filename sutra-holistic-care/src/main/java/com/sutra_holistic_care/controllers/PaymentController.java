package com.sutra_holistic_care.controllers;

import com.sutra_holistic_care.entities.Payment;
import com.sutra_holistic_care.req.ApiResponse;
import com.sutra_holistic_care.req.PaymentOrderResponse;
import com.sutra_holistic_care.req.PaymentVerifyRequest;
import com.sutra_holistic_care.services.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/order/{orderId}")
    public ResponseEntity<ApiResponse<PaymentOrderResponse>> createOrderPayment(@PathVariable String orderId) {
        PaymentOrderResponse response = paymentService.createOrderPayment(orderId);
        return ResponseEntity.ok(ApiResponse.success("Payment order created", response));
    }

    @PostMapping("/registration/{registrationId}")
    public ResponseEntity<ApiResponse<PaymentOrderResponse>> createRegistrationPayment(@PathVariable String registrationId) {
        PaymentOrderResponse response = paymentService.createRegistrationPayment(registrationId);
        return ResponseEntity.ok(ApiResponse.success("Payment order created", response));
    }

    @PostMapping("/consultation/{consultationId}")
    public ResponseEntity<ApiResponse<PaymentOrderResponse>> createConsultationPayment(@PathVariable String consultationId) {
        PaymentOrderResponse response = paymentService.createConsultationPayment(consultationId);
        return ResponseEntity.ok(ApiResponse.success("Payment order created", response));
    }

    @PostMapping("/verify")
    public ResponseEntity<ApiResponse<Payment>> verifyPayment(@RequestBody PaymentVerifyRequest request) {
        Payment payment = paymentService.verifyAndConfirmPayment(request);
        return ResponseEntity.ok(ApiResponse.success("Payment verified successfully", payment));
    }
}
