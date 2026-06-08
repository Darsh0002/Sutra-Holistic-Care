package com.sutra_holistic_care.repositories;

import com.sutra_holistic_care.entities.Consultation;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.time.LocalDate;
import java.util.List;

public interface ConsultationRepository extends MongoRepository<Consultation, String> {
    List<Consultation> findByConsultationDateOrderByTimeSlotAsc(LocalDate date);
    List<Consultation> findByEmailOrderByBookedAtDesc(String email);
    List<Consultation> findAllByOrderByBookedAtDesc();
    List<Consultation> findByStatusOrderByConsultationDateAsc(Consultation.ConsultationStatus status);
    boolean existsByConsultationDateAndTimeSlot(java.time.LocalDate date, java.time.LocalTime slot);
    long countByStatus(Consultation.ConsultationStatus status);
}