package com.sutra_holistic_care.repositories;

import com.sutra_holistic_care.entities.Seminar;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.time.LocalDate;
import java.util.List;

public interface SeminarRepository extends MongoRepository<Seminar, String> {
    List<Seminar> findByActiveTrueOrderByDateAsc();
    List<Seminar> findByDateAfterAndActiveTrueOrderByDateAsc(LocalDate date);
    List<Seminar> findAllByOrderByDateAsc();
    List<Seminar> findByActiveTrueAndDateBefore(LocalDate date);
}