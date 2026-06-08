package com.sutra_holistic_care.req;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class ConsultationRequest {
    private String patientName;

    private String email;

    private String mobile;

    private int age;

    private String sex;

    private String chiefComplaint;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate consultationDate;

    @JsonFormat(pattern = "HH:mm")
    private LocalTime timeSlot;
}