package com.sutra_holistic_care.req;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DashboardStats {
    private long totalOrders;
    private long pendingOrders;
    private long confirmedOrders;
    private long totalRegistrations;
    private long totalConsultations;
    private long pendingConsultations;
    private long totalProducts;
    private long totalSeminars;
    private long totalRevenue;
}