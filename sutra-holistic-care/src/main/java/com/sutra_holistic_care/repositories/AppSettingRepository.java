package com.sutra_holistic_care.repositories;

import com.sutra_holistic_care.entities.AppSetting;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface AppSettingRepository extends MongoRepository<AppSetting, String> {
    Optional<AppSetting> findBySettingKey(String settingKey);
}
