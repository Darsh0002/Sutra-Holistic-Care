package com.sutra_holistic_care.repositories;

import com.sutra_holistic_care.entities.Order;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface OrderRepository extends MongoRepository<Order, String> {
    List<Order> findByEmailOrderByDateDesc(String email);
    List<Order> findByStatusOrderByDateDesc(Order.OrderStatus status);
    List<Order> findAllByOrderByDateDesc();
    long countByStatus(Order.OrderStatus status);
}