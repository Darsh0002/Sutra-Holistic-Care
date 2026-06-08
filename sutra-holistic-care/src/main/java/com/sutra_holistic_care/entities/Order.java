package com.sutra_holistic_care.entities;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "orders")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Order {

    @Id
    private String id;

    private String name;

    private String address;

    private String mobile;

    private String email;

    private Long quantity;

    private Long totalAmount;

    private Product product;

    private Pack selectedPack;

    private OrderStatus status;

    private LocalDateTime date;

    private String paymentId;

    public enum OrderStatus {
        PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED
    }
}