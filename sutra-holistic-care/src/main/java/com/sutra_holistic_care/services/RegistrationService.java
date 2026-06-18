package com.sutra_holistic_care.services;

import com.sutra_holistic_care.req.RegistrationRequest;
import com.sutra_holistic_care.entities.Registration;
import com.sutra_holistic_care.entities.Seminar;
import com.sutra_holistic_care.exceptions.BusinessException;
import com.sutra_holistic_care.exceptions.ResourceNotFoundException;
import com.sutra_holistic_care.repositories.RegistrationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RegistrationService {

    private final RegistrationRepository registrationRepository;
    private final SeminarService seminarService;
    private final SubscriberService subscriberService;

    public Registration createRegistration(RegistrationRequest request) {
        Seminar seminar = seminarService.getSeminar(request.getSeminarId());

        if (!seminar.isActive()) {
            throw new BusinessException("Seminar is no longer active");
        }
        if (seminar.getAvailableSeats() <= 0) {
            throw new BusinessException("No seats available for this seminar");
        }
        if (registrationRepository.existsByMobileAndSeminarId(request.getMobile(), request.getSeminarId())) {
            throw new BusinessException("Mobile Number already registered for this seminar");
        }

        Registration registration = Registration.builder()
                .name(request.getName())
                .age(request.getAge())
                .sex(request.getSex())
                .mobile(request.getMobile())
                .email(request.getEmail())
                .seminarId(seminar.getId())
                .seminarTopic(seminar.getTopic())
                .feePaid(0L) // Seminars are always free
                .status(Registration.RegistrationStatus.CONFIRMED) // Auto-confirm — no payment needed
                .registeredAt(LocalDateTime.now())
                .build();

        Registration saved = registrationRepository.save(registration);
        seminarService.incrementBookedSeats(seminar.getId()); // Claim seat immediately
        subscriberService.upsertFromRegistration(saved);       // Add to CRM
        return saved;
    }

    public Registration getRegistration(String id) {
        return registrationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Registration", id));
    }

    public List<Registration> getAllRegistrations() {
        return registrationRepository.findAll();
    }

    public List<Registration> getRegistrationsBySeminar(String seminarId) {
        return registrationRepository.findBySeminarId(seminarId);
    }

    public List<Registration> getRegistrationsByMobile(String mobile) {
        return registrationRepository.findByMobile(mobile);
    }

    public void confirmPayment(String registrationId, String paymentId) {
        Registration reg = getRegistration(registrationId);
        reg.setStatus(Registration.RegistrationStatus.CONFIRMED);
        reg.setPaymentId(paymentId);
        registrationRepository.save(reg);
        seminarService.incrementBookedSeats(reg.getSeminarId());
        // Capture subscriber for marketing CRM
        subscriberService.upsertFromRegistration(reg);
    }

    public void cancelRegistration(String id) {
        Registration reg = getRegistration(id);
        if (reg.getStatus() == Registration.RegistrationStatus.CONFIRMED) {
            seminarService.decrementBookedSeats(reg.getSeminarId());
        }
        reg.setStatus(Registration.RegistrationStatus.CANCELLED);
        registrationRepository.save(reg);
    }
}