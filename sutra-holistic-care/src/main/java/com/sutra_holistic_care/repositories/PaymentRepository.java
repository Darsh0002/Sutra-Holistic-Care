package com.sutra_holistic_care.repositories;

import com.sutra_holistic_care.entities.Payment;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface PaymentRepository extends MongoRepository<Payment, String> {
    Optional<Payment> findByRazorpayOrderId(String razorpayOrderId);
    Optional<Payment> findByReferenceId(String referenceId);
}