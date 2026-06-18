package com.sutra_holistic_care.entities;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Unified subscriber / customer CRM record.
 * One document per unique mobile number.
 * Accumulated automatically whenever a user places an order,
 * books a consultation, or registers for a seminar.
 */
@Data
@Document(collection = "subscribers")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Subscriber {

    @Id
    private String id;

    /** Full name (latest known) */
    private String name;

    @Indexed(unique = true)
    private String mobile;

    private String email;

    private Integer age;

    private String sex;

    /**
     * Sources through which this subscriber engaged.
     * E.g. ["ORDER", "CONSULTATION", "SEMINAR"]
     */
    @Builder.Default
    private List<SubscriberSource> sources = new ArrayList<>();

    /** Total confirmed spend (in INR) across all transactions */
    @Builder.Default
    private Long totalSpend = 0L;

    /** Number of orders placed */
    @Builder.Default
    private int orderCount = 0;

    /** Number of consultations booked */
    @Builder.Default
    private int consultationCount = 0;

    /** Number of seminar registrations */
    @Builder.Default
    private int seminarCount = 0;

    /** Timestamp of the very first interaction */
    private LocalDateTime firstSeenAt;

    /** Timestamp of the most recent interaction */
    private LocalDateTime lastSeenAt;

    public enum SubscriberSource {
        ORDER, CONSULTATION, SEMINAR
    }
}
