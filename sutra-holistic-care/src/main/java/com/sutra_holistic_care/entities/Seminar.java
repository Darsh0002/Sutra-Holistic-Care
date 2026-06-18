package com.sutra_holistic_care.entities;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Document(collection = "seminars")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Seminar {

    @Id
    private String id;

    private String topic;

    private Long fee;

    private LocalDate date;

    private LocalTime time;

    private String language;

    private String seminarLink; // Google Meet / Zoom / YouTube link for the webinar

    private Integer totalSeats;

    private Integer bookedSeats;

    private boolean active = true;

    public int getAvailableSeats() {
        int booked = bookedSeats != null ? bookedSeats : 0;
        int total = totalSeats != null ? totalSeats : 0;
        return Math.max(0, total - booked);
    }
}