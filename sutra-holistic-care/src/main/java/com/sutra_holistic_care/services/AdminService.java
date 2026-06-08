package com.sutra_holistic_care.services;

import com.sutra_holistic_care.entities.Consultation;
import com.sutra_holistic_care.entities.Order;
import com.sutra_holistic_care.entities.Payment;
import com.sutra_holistic_care.entities.Registration;
import com.sutra_holistic_care.repositories.*;
import com.sutra_holistic_care.req.DashboardStats;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final OrderRepository orderRepository;
    private final ConsultationRepository consultationRepository;
    private final RegistrationRepository registrationRepository;
    private final ProductRepository productRepository;
    private final SeminarRepository seminarRepository;
    private final PaymentRepository paymentRepository;

    public DashboardStats getDashboardStats() {
        long totalOrders = orderRepository.count();
        long pendingOrders = orderRepository.countByStatus(Order.OrderStatus.PENDING);
        long confirmedOrders = orderRepository.countByStatus(Order.OrderStatus.CONFIRMED);
        long totalRegistrations = registrationRepository.countByStatus(Registration.RegistrationStatus.CONFIRMED);
        long totalConsultations = consultationRepository.count();
        long pendingConsultations = consultationRepository.countByStatus(Consultation.ConsultationStatus.PENDING);
        long totalProducts = productRepository.count();
        long totalSeminars = seminarRepository.count();

        // Calculate total revenue from paid payments
        long totalRevenue = paymentRepository.findAll().stream()
                .filter(p -> p.getStatus() == Payment.PaymentStatus.PAID)
                .mapToLong(Payment::getAmount)
                .sum();

        return DashboardStats.builder()
                .totalOrders(totalOrders)
                .pendingOrders(pendingOrders)
                .confirmedOrders(confirmedOrders)
                .totalRegistrations(totalRegistrations)
                .totalConsultations(totalConsultations)
                .pendingConsultations(pendingConsultations)
                .totalProducts(totalProducts)
                .totalSeminars(totalSeminars)
                .totalRevenue(totalRevenue)
                .build();
    }
}
