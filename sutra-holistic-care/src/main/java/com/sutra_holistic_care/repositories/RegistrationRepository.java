package com.sutra_holistic_care.repositories;

import com.sutra_holistic_care.entities.Registration;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface RegistrationRepository extends MongoRepository<Registration, String> {
    List<Registration> findBySeminarId(String seminarId);
    List<Registration> findByMobile(String mobile);
    List<Registration> findByEmailOrderByRegisteredAtDesc(String email);
    boolean existsByMobileAndSeminarId(String mobile, String seminarId);
    long countBySeminarId(String seminarId);
    long countByStatus(Registration.RegistrationStatus status);
}