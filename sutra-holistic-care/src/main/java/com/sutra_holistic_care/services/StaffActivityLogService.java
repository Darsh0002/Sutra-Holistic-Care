package com.sutra_holistic_care.services;

import com.sutra_holistic_care.entities.Admin;
import com.sutra_holistic_care.entities.StaffActivityLog;
import com.sutra_holistic_care.repositories.AdminRepository;
import com.sutra_holistic_care.repositories.StaffActivityLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class StaffActivityLogService {

    private final StaffActivityLogRepository logRepository;
    private final AdminRepository adminRepository;

    public void logAction(String staffId, String staffName, String staffEmail, String role,
                          String action, String entityType, String entityId, String details) {
        try {
            StaffActivityLog logEntry = StaffActivityLog.builder()
                    .staffId(staffId)
                    .staffName(staffName)
                    .staffEmail(staffEmail)
                    .role(role)
                    .action(action)
                    .entityType(entityType)
                    .entityId(entityId)
                    .details(details)
                    .timestamp(LocalDateTime.now())
                    .build();
            logRepository.save(logEntry);
        } catch (Exception e) {
            log.error("Failed to save activity log: {}", e.getMessage());
        }
    }

    public void logCurrentAdminAction(String action, String entityType, String entityId, String details) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated() && auth.getPrincipal() instanceof String email) {
                Optional<Admin> adminOpt = adminRepository.findByEmail(email);
                if (adminOpt.isPresent()) {
                    Admin admin = adminOpt.get();
                    String role = admin.getRole() != null ? admin.getRole() : "STAFF";
                    logAction(admin.getId(), admin.getName(), admin.getEmail(), role, action, entityType, entityId, details);
                    return;
                }
            }
            // Fallback if system action
            logAction("SYSTEM", "System", "system@sutraholistic.com", "SYSTEM", action, entityType, entityId, details);
        } catch (Exception e) {
            log.error("Failed to log current admin action: {}", e.getMessage());
        }
    }

    public List<StaffActivityLog> getAllLogs() {
        return logRepository.findAllByOrderByTimestampDesc();
    }
}
