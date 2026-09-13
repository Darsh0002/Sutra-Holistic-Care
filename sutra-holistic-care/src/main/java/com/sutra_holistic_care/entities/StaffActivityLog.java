package com.sutra_holistic_care.entities;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "staff_activity_logs")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StaffActivityLog {

    @Id
    private String id;

    private String staffId;

    private String staffName;

    private String staffEmail;

    private String role;

    private String action;

    private String entityType;

    private String entityId;

    private String details;

    private LocalDateTime timestamp;
}
