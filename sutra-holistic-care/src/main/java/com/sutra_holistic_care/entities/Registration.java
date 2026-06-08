package com.sutra_holistic_care.entities;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "registrations")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Registration {

    @Id
    private String id;

    private String name;

    private int age;

    private String sex;

    private String mobile;

    private String email;

    private String seminarId;

    private String seminarTopic;

    private Long feePaid;

    private RegistrationStatus status;

    private String paymentId;

    private LocalDateTime registeredAt;

    public enum RegistrationStatus {
        PENDING_PAYMENT, CONFIRMED, CANCELLED
    }
}