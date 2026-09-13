package com.sutra_holistic_care.services;

import com.sutra_holistic_care.entities.AppSetting;
import com.sutra_holistic_care.exceptions.BusinessException;
import com.sutra_holistic_care.repositories.AppSettingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * Manages runtime application settings stored in MongoDB.
 * The admin must set the consultation fee via the Settings tab before it is used.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AppSettingService {

    private static final String KEY_CONSULTATION_FEE = "CONSULTATION_FEE";

    private final AppSettingRepository appSettingRepository;

    /**
     * Returns the current consultation fee from MongoDB.
     * Throws BusinessException if no fee has been configured yet.
     */
    public long getConsultationFee() {
        return appSettingRepository.findBySettingKey(KEY_CONSULTATION_FEE)
                .map(s -> {
                    try {
                        return Long.parseLong(s.getSettingValue());
                    } catch (NumberFormatException e) {
                        throw new BusinessException("Consultation fee is misconfigured. Please set a valid number in Admin Settings.");
                    }
                })
                .orElseThrow(() -> new BusinessException("Consultation fee has not been configured yet. Please set it in Admin Settings."));
    }

    /**
     * Persists a new consultation fee to MongoDB.
     * Change takes effect immediately for all subsequent bookings.
     */
    public long setConsultationFee(long fee) {
        if (fee <= 0) throw new BusinessException("Consultation fee must be greater than 0");
        AppSetting setting = appSettingRepository.findBySettingKey(KEY_CONSULTATION_FEE)
                .orElse(AppSetting.builder().settingKey(KEY_CONSULTATION_FEE).build());
        setting.setSettingValue(String.valueOf(fee));
        appSettingRepository.save(setting);
        log.info("Consultation fee updated to: {}", fee);
        return fee;
    }
}
