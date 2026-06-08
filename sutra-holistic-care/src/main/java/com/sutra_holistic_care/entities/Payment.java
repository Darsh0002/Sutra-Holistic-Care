package com.sutra_holistic_care.entities;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "payments")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Payment {

    @Id
    private String id;

    private String razorpayOrderId;

    private String razorpayPaymentId;

    private String razorpaySignature;

    // References: orderId, registrationId, or consultationId
    private String referenceId;

    private PaymentType paymentType;

    private Long amount;

    private String currency;

    private PaymentStatus status;

    private LocalDateTime paidAt;

    public enum PaymentType {
        ORDER, SEMINAR_REGISTRATION, CONSULTATION
    }

    public enum PaymentStatus {
        CREATED, PAID, FAILED, REFUNDED
    }
}