package com.sutra_holistic_care.entities;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * Generic key-value store for runtime application settings.
 * Allows admin to update things like consultation fee without a server restart.
 */
@Data
@Document(collection = "app_settings")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AppSetting {

    @Id
    private String id;

    /** Unique setting key, e.g. "CONSULTATION_FEE" */
    @Indexed(unique = true)
    private String settingKey;

    /** String value of the setting (parsed as needed by callers) */
    private String settingValue;
}
