package com.sutra_holistic_care.services;

import com.sutra_holistic_care.req.ConsultationRequest;
import com.sutra_holistic_care.entities.Consultation;
import com.sutra_holistic_care.exceptions.BusinessException;
import com.sutra_holistic_care.exceptions.ResourceNotFoundException;
import com.sutra_holistic_care.repositories.ConsultationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ConsultationService {

    private final ConsultationRepository consultationRepository;

    @Value("${app.consultation.fee}")
    private Long consultationFee;

    private static final List<LocalTime> ALL_SLOTS = List.of(
            LocalTime.of(9, 0), LocalTime.of(10, 0), LocalTime.of(11, 0),
            LocalTime.of(12, 0), LocalTime.of(14, 0), LocalTime.of(15, 0),
            LocalTime.of(16, 0), LocalTime.of(17, 0)
    );

    public Consultation bookConsultation(ConsultationRequest request) {
        boolean slotTaken = consultationRepository
                .existsByConsultationDateAndTimeSlot(request.getConsultationDate(), request.getTimeSlot());
        if (slotTaken) {
            throw new BusinessException("This time slot is already booked. Please choose another.");
        }

        Consultation consultation = Consultation.builder()
                .patientName(request.getPatientName())
                .email(request.getEmail())
                .mobile(request.getMobile())
                .age(request.getAge())
                .sex(request.getSex())
                .chiefComplaint(request.getChiefComplaint())
                .consultationDate(request.getConsultationDate())
                .timeSlot(request.getTimeSlot())
                .status(Consultation.ConsultationStatus.PENDING)
                .fee(consultationFee)
                .bookedAt(LocalDateTime.now())
                .build();

        return consultationRepository.save(consultation);
    }

    public Consultation getConsultation(String id) {
        return consultationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Consultation", id));
    }

    public List<Consultation> getAllConsultations() {
        return consultationRepository.findAllByOrderByBookedAtDesc();
    }

    public List<Consultation> getConsultationsByDate(LocalDate date) {
        return consultationRepository.findByConsultationDateOrderByTimeSlotAsc(date);
    }

    public List<Consultation> getConsultationsByEmail(String email) {
        return consultationRepository.findByEmailOrderByBookedAtDesc(email);
    }

    public List<Consultation> getConsultationsByStatus(Consultation.ConsultationStatus status) {
        return consultationRepository.findByStatusOrderByConsultationDateAsc(status);
    }

    public Consultation updateStatus(String id, Consultation.ConsultationStatus status) {
        Consultation c = getConsultation(id);
        c.setStatus(status);
        return consultationRepository.save(c);
    }

    public Consultation sendVideoLink(String id, String videoLink) {
        Consultation c = getConsultation(id);
        c.setVideoLink(videoLink);
        c.setStatus(Consultation.ConsultationStatus.CONFIRMED);
        return consultationRepository.save(c);
    }

    public Consultation addDoctorNotes(String id, String notes) {
        Consultation c = getConsultation(id);
        c.setDoctorNotes(notes);
        c.setStatus(Consultation.ConsultationStatus.COMPLETED);
        return consultationRepository.save(c);
    }

    public void confirmPayment(String consultationId, String paymentId) {
        Consultation c = getConsultation(consultationId);
        c.setPaymentId(paymentId);
        c.setStatus(Consultation.ConsultationStatus.CONFIRMED);
        consultationRepository.save(c);
    }

    public List<String> getAvailableSlots(LocalDate date) {
        List<Consultation> booked = consultationRepository.findByConsultationDateOrderByTimeSlotAsc(date);
        List<LocalTime> bookedSlots = booked.stream()
                .map(Consultation::getTimeSlot)
                .collect(Collectors.toList());

        return ALL_SLOTS.stream()
                .filter(slot -> !bookedSlots.contains(slot))
                .map(LocalTime::toString)
                .collect(Collectors.toList());
    }
}