package com.sutra_holistic_care.entities;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Data
@Document(collection = "consultations")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Consultation {

    @Id
    private String id;

    private String patientName;

    private String email;

    private String mobile;

    private int age;

    private String sex;

    private String chiefComplaint;

    private LocalDate consultationDate;

    private LocalTime timeSlot;

    private ConsultationStatus status;

    private String videoLink;

    private String paymentId;

    private Long fee;

    private LocalDateTime bookedAt;

    private String doctorNotes;

    public enum ConsultationStatus {
        PENDING, CONFIRMED, COMPLETED, CANCELLED
    }
}