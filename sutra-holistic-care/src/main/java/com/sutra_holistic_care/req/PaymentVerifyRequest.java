package com.sutra_holistic_care.req;

import lombok.Data;

@Data
public class PaymentVerifyRequest {
    private String razorpayOrderId;

    private String razorpayPaymentId;

    private String razorpaySignature;

    private String referenceId; // our orderId / registrationId / consultationId
}