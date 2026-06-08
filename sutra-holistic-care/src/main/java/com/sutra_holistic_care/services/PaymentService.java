package com.sutra_holistic_care.services;

import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.sutra_holistic_care.req.PaymentVerifyRequest;
import com.sutra_holistic_care.req.PaymentOrderResponse;
import com.sutra_holistic_care.entities.*;
import com.sutra_holistic_care.exceptions.BusinessException;
import com.sutra_holistic_care.repositories.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentService {

    private final RazorpayClient razorpayClient;
    private final PaymentRepository paymentRepository;
    private final OrderService orderService;
    private final RegistrationService registrationService;
    private final ConsultationService consultationService;

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    @Value("${razorpay.currency}")
    private String currency;

    public PaymentOrderResponse createOrderPayment(String orderId) {
        Order order = orderService.getOrder(orderId);
        return createRazorpayOrder(order.getTotalAmount(), orderId,
                "Payment for " + order.getProduct().getName(),
                Payment.PaymentType.ORDER);
    }

    public PaymentOrderResponse createRegistrationPayment(String registrationId) {
        Registration reg = registrationService.getRegistration(registrationId);
        return createRazorpayOrder(reg.getFeePaid(), registrationId,
                "Seminar Registration: " + reg.getSeminarTopic(),
                Payment.PaymentType.SEMINAR_REGISTRATION);
    }

    public PaymentOrderResponse createConsultationPayment(String consultationId) {
        Consultation c = consultationService.getConsultation(consultationId);
        return createRazorpayOrder(c.getFee(), consultationId,
                "Consultation with Dr. Ananya Vaid",
                Payment.PaymentType.CONSULTATION);
    }

    private PaymentOrderResponse createRazorpayOrder(Long amount, String referenceId,
                                                     String description, Payment.PaymentType type) {
        try {
            JSONObject options = new JSONObject();
            options.put("amount", amount * 100L); // Razorpay expects paise
            options.put("currency", currency);
            options.put("receipt", referenceId);

            com.razorpay.Order rzpOrder = razorpayClient.orders.create(options);
            String rzpOrderId = rzpOrder.get("id");

            // Persist payment record
            Payment payment = Payment.builder()
                    .razorpayOrderId(rzpOrderId)
                    .referenceId(referenceId)
                    .paymentType(type)
                    .amount(amount)
                    .currency(currency)
                    .status(Payment.PaymentStatus.CREATED)
                    .paidAt(null)
                    .build();
            paymentRepository.save(payment);

            return PaymentOrderResponse.builder()
                    .razorpayOrderId(rzpOrderId)
                    .referenceId(referenceId)
                    .amount(amount * 100L)
                    .currency(currency)
                    .keyId(keyId)
                    .description(description)
                    .build();

        } catch (RazorpayException e) {
            log.error("Razorpay order creation failed: {}", e.getMessage());
            throw new BusinessException("Payment gateway error: " + e.getMessage());
        }
    }

    public Payment verifyAndConfirmPayment(PaymentVerifyRequest request) {
        // Verify HMAC signature
        if (!verifySignature(request.getRazorpayOrderId(), request.getRazorpayPaymentId(),
                request.getRazorpaySignature())) {
            throw new BusinessException("Payment verification failed: invalid signature");
        }

        Payment payment = paymentRepository.findByRazorpayOrderId(request.getRazorpayOrderId())
                .orElseThrow(() -> new BusinessException("Payment record not found"));

        payment.setRazorpayPaymentId(request.getRazorpayPaymentId());
        payment.setRazorpaySignature(request.getRazorpaySignature());
        payment.setStatus(Payment.PaymentStatus.PAID);
        payment.setPaidAt(LocalDateTime.now());
        Payment saved = paymentRepository.save(payment);

        // Downstream confirmation
        switch (payment.getPaymentType()) {
            case ORDER -> orderService.confirmPayment(payment.getReferenceId(), payment.getRazorpayPaymentId());
            case SEMINAR_REGISTRATION ->
                    registrationService.confirmPayment(payment.getReferenceId(), payment.getRazorpayPaymentId());
            case CONSULTATION ->
                    consultationService.confirmPayment(payment.getReferenceId(), payment.getRazorpayPaymentId());
        }

        return saved;
    }

    private boolean verifySignature(String orderId, String paymentId, String signature) {
        try {
            String payload = orderId + "|" + paymentId;
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(keySecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            byte[] hash = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : hash) sb.append(String.format("%02x", b));
            return sb.toString().equals(signature);
        } catch (Exception e) {
            log.error("Signature verification error: {}", e.getMessage());
            return false;
        }
    }
}