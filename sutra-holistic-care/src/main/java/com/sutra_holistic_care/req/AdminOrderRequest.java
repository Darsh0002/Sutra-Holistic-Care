package com.sutra_holistic_care.req;

import com.sutra_holistic_care.entities.Order.OrderStatus;
import lombok.Data;

@Data
public class AdminOrderRequest {
    private String name;
    private String address;
    private String mobile;
    private String email;
    private String productId;
    private int packIndex;
    private Long quantity;
    private Long customTotalAmount;
    private OrderStatus status;
    private String paymentReference;
}
