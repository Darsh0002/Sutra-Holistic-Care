package com.sutra_holistic_care.services;

import com.sutra_holistic_care.entities.Consultation;
import com.sutra_holistic_care.entities.Order;
import com.sutra_holistic_care.entities.Registration;
import com.sutra_holistic_care.entities.Subscriber;
import com.sutra_holistic_care.repositories.SubscriberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Manages the unified subscriber CRM collection.
 *
 * Each public upsert method is called by the relevant domain service
 * (Order / Consultation / Registration) when a confirmed interaction occurs.
 * Records are keyed on mobile number – a repeat customer accumulates
 * source tags, spend, and counts rather than creating duplicate entries.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class SubscriberService {

    private final SubscriberRepository subscriberRepository;

    // ── Public upsert methods ─────────────────────────────────────────────────

    /**
     * Called when an order payment is confirmed.
     * Creates or updates the subscriber record for the customer.
     */
    public void upsertFromOrder(Order order) {
        try {
            Subscriber sub = findOrCreate(order.getMobile(), order.getName(), order.getEmail());
            sub.setName(order.getName());
            sub.setEmail(order.getEmail());
            addSource(sub, Subscriber.SubscriberSource.ORDER);
            sub.setTotalSpend(sub.getTotalSpend() + (order.getTotalAmount() != null ? order.getTotalAmount() : 0L));
            sub.setOrderCount(sub.getOrderCount() + 1);
            sub.setLastSeenAt(LocalDateTime.now());
            subscriberRepository.save(sub);
            log.info("Subscriber upserted from ORDER — mobile: {}", order.getMobile());
        } catch (Exception e) {
            log.error("Failed to upsert subscriber from order {}: {}", order.getId(), e.getMessage());
        }
    }

    /**
     * Called when a consultation is booked (booking is the primary lead capture moment).
     */
    public void upsertFromConsultation(Consultation consultation) {
        try {
            Subscriber sub = findOrCreate(consultation.getMobile(), consultation.getPatientName(), consultation.getEmail());
            sub.setName(consultation.getPatientName());
            sub.setEmail(consultation.getEmail());
            if (consultation.getAge() > 0) sub.setAge(consultation.getAge());
            if (consultation.getSex() != null) sub.setSex(consultation.getSex());
            addSource(sub, Subscriber.SubscriberSource.CONSULTATION);
            sub.setTotalSpend(sub.getTotalSpend() + (consultation.getFee() != null ? consultation.getFee() : 0L));
            sub.setConsultationCount(sub.getConsultationCount() + 1);
            sub.setLastSeenAt(LocalDateTime.now());
            subscriberRepository.save(sub);
            log.info("Subscriber upserted from CONSULTATION — mobile: {}", consultation.getMobile());
        } catch (Exception e) {
            log.error("Failed to upsert subscriber from consultation {}: {}", consultation.getId(), e.getMessage());
        }
    }

    /**
     * Called when a seminar registration payment is confirmed.
     */
    public void upsertFromRegistration(Registration registration) {
        try {
            Subscriber sub = findOrCreate(registration.getMobile(), registration.getName(), registration.getEmail());
            sub.setName(registration.getName());
            sub.setEmail(registration.getEmail());
            if (registration.getAge() > 0) sub.setAge(registration.getAge());
            if (registration.getSex() != null) sub.setSex(registration.getSex());
            addSource(sub, Subscriber.SubscriberSource.SEMINAR);
            sub.setTotalSpend(sub.getTotalSpend() + (registration.getFeePaid() != null ? registration.getFeePaid() : 0L));
            sub.setSeminarCount(sub.getSeminarCount() + 1);
            sub.setLastSeenAt(LocalDateTime.now());
            subscriberRepository.save(sub);
            log.info("Subscriber upserted from SEMINAR REGISTRATION — mobile: {}", registration.getMobile());
        } catch (Exception e) {
            log.error("Failed to upsert subscriber from registration {}: {}", registration.getId(), e.getMessage());
        }
    }

    // ── Query methods ──────────────────────────────────────────────────────────

    public List<Subscriber> getAllSubscribers() {
        return subscriberRepository.findAllByOrderByLastSeenAtDesc();
    }

    public List<Subscriber> searchSubscribers(String query) {
        return subscriberRepository
                .findByNameContainingIgnoreCaseOrEmailContainingIgnoreCaseOrMobileContaining(
                        query, query, query);
    }

    public long getTotalCount() {
        return subscriberRepository.count();
    }

    public long getCountBySource(Subscriber.SubscriberSource source) {
        return subscriberRepository.countBySourcesContaining(source);
    }

    // ── Private helpers ────────────────────────────────────────────────────────

    private Subscriber findOrCreate(String mobile, String name, String email) {
        return subscriberRepository.findByMobile(mobile).orElseGet(() -> {
            LocalDateTime now = LocalDateTime.now();
            return Subscriber.builder()
                    .mobile(mobile)
                    .name(name)
                    .email(email)
                    .firstSeenAt(now)
                    .lastSeenAt(now)
                    .build();
        });
    }

    /** Adds a source tag only if not already present */
    private void addSource(Subscriber sub, Subscriber.SubscriberSource source) {
        if (!sub.getSources().contains(source)) {
            sub.getSources().add(source);
        }
    }
}
