package com.sutra_holistic_care.repositories;

import com.sutra_holistic_care.entities.Subscriber;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubscriberRepository extends MongoRepository<Subscriber, String> {

    Optional<Subscriber> findByMobile(String mobile);

    List<Subscriber> findAllByOrderByLastSeenAtDesc();

    long countBySourcesContaining(Subscriber.SubscriberSource source);

    List<Subscriber> findByNameContainingIgnoreCaseOrEmailContainingIgnoreCaseOrMobileContaining(
            String name, String email, String mobile);
}
