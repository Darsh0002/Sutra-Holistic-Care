package com.sutra_holistic_care.repositories;

import com.sutra_holistic_care.entities.StaffActivityLog;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface StaffActivityLogRepository extends MongoRepository<StaffActivityLog, String> {
    List<StaffActivityLog> findAllByOrderByTimestampDesc();
}
