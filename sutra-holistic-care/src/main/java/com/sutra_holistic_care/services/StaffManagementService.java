package com.sutra_holistic_care.services;

import com.sutra_holistic_care.entities.Admin;
import com.sutra_holistic_care.exceptions.BusinessException;
import com.sutra_holistic_care.exceptions.ResourceNotFoundException;
import com.sutra_holistic_care.repositories.AdminRepository;
import com.sutra_holistic_care.req.AdminRegisterRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StaffManagementService {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final StaffActivityLogService activityLogService;

    public Admin addStaff(AdminRegisterRequest request) {
        if (adminRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("Email already registered: " + request.getEmail());
        }

        Admin staff = Admin.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .mobile(request.getMobile())
                .role("STAFF")
                .createdAt(LocalDateTime.now())
                .build();

        Admin saved = adminRepository.save(staff);

        // Audit Log
        activityLogService.logCurrentAdminAction(
                "CREATE_STAFF",
                "STAFF",
                saved.getId(),
                "Created new STAFF account for " + saved.getName() + " (" + saved.getEmail() + ")"
        );

        // Blank out password before returning
        saved.setPassword(null);
        return saved;
    }

    public List<Admin> getAllStaff() {
        List<Admin> list = adminRepository.findAll();
        list.forEach(a -> a.setPassword(null));
        return list;
    }

    public void deleteStaff(String staffId) {
        Admin staff = adminRepository.findById(staffId)
                .orElseThrow(() -> new ResourceNotFoundException("Staff account not found with ID: " + staffId));

        // Prevent self-deletion
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof String currentEmail) {
            if (currentEmail.equalsIgnoreCase(staff.getEmail())) {
                throw new BusinessException("You cannot delete your own account");
            }
        }

        adminRepository.deleteById(staffId);

        // Audit Log
        activityLogService.logCurrentAdminAction(
                "DELETE_STAFF",
                "STAFF",
                staffId,
                "Deleted STAFF account for " + staff.getName() + " (" + staff.getEmail() + ")"
        );
    }
}
