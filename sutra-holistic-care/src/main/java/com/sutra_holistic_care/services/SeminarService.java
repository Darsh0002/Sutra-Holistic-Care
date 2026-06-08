package com.sutra_holistic_care.services;

import com.sutra_holistic_care.req.SeminarRequest;
import com.sutra_holistic_care.entities.Seminar;
import com.sutra_holistic_care.exceptions.BusinessException;
import com.sutra_holistic_care.exceptions.ResourceNotFoundException;
import com.sutra_holistic_care.repositories.SeminarRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SeminarService {

    private final SeminarRepository seminarRepository;

    public Seminar createSeminar(SeminarRequest request) {
        Seminar seminar = Seminar.builder()
                .topic(request.getTopic())
                .fee(request.getFee())
                .date(request.getDate())
                .time(request.getTime())
                .language(request.getLanguage())
                .totalSeats(request.getTotalSeats())
                .bookedSeats(0)
                .active(true)
                .build();
        return seminarRepository.save(seminar);
    }

    public Seminar updateSeminar(String id, SeminarRequest request) {
        Seminar seminar = getSeminar(id);
        seminar.setTopic(request.getTopic());
        seminar.setFee(request.getFee());
        seminar.setDate(request.getDate());
        seminar.setTime(request.getTime());
        seminar.setLanguage(request.getLanguage());
        seminar.setTotalSeats(request.getTotalSeats());
        return seminarRepository.save(seminar);
    }

    public void deleteSeminar(String id) {
        Seminar seminar = getSeminar(id);
        seminar.setActive(false);
        seminarRepository.save(seminar);
    }

    public Seminar getSeminar(String id) {
        return seminarRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Seminar", id));
    }

    public List<Seminar> getAllSeminars() {
        return seminarRepository.findAllByOrderByDateAsc();
    }

    public List<Seminar> getUpcomingSeminars() {
        return seminarRepository.findByDateAfterAndActiveTrueOrderByDateAsc(LocalDate.now().minusDays(1));
    }

    public void incrementBookedSeats(String seminarId) {
        Seminar seminar = getSeminar(seminarId);
        if (seminar.getAvailableSeats() <= 0) {
            throw new BusinessException("No seats available for this seminar");
        }
        seminar.setBookedSeats((seminar.getBookedSeats() == null ? 0 : seminar.getBookedSeats()) + 1);
        seminarRepository.save(seminar);
    }

    public void decrementBookedSeats(String seminarId) {
        Seminar seminar = getSeminar(seminarId);
        int booked = seminar.getBookedSeats() == null ? 0 : seminar.getBookedSeats();
        seminar.setBookedSeats(Math.max(0, booked - 1));
        seminarRepository.save(seminar);
    }
}