package com.sutra_holistic_care.req;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PaymentOrderResponse {
    private String razorpayOrderId;
    private String referenceId;
    private Long amount;          // in paise
    private String currency;
    private String keyId;
    private String description;
}