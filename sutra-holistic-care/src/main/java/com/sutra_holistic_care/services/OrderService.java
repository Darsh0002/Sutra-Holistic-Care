package com.sutra_holistic_care.services;

import com.sutra_holistic_care.req.OrderRequest;
import com.sutra_holistic_care.entities.Order;
import com.sutra_holistic_care.entities.Pack;
import com.sutra_holistic_care.entities.Product;
import com.sutra_holistic_care.exceptions.BusinessException;
import com.sutra_holistic_care.exceptions.ResourceNotFoundException;
import com.sutra_holistic_care.repositories.OrderRepository;
import com.sutra_holistic_care.repositories.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public Order createOrder(OrderRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product", request.getProductId()));

        if (!product.isActive()) {
            throw new BusinessException("Product is no longer available");
        }

        List<Pack> packs = product.getPacks();
        if (request.getPackIndex() >= packs.size()) {
            throw new BusinessException("Invalid pack selection");
        }

        Pack selectedPack = packs.get(request.getPackIndex());
        long totalAmount = selectedPack.getPrice() * request.getQuantity();

        Order order = Order.builder()
                .name(request.getName())
                .address(request.getAddress())
                .mobile(request.getMobile())
                .email(request.getEmail())
                .quantity(request.getQuantity())
                .totalAmount(totalAmount)
                .product(product)
                .selectedPack(selectedPack)
                .status(Order.OrderStatus.PENDING)
                .date(LocalDateTime.now())
                .build();

        return orderRepository.save(order);
    }

    public Order getOrder(String id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", id));
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByDateDesc();
    }

    public List<Order> getOrdersByEmail(String email) {
        return orderRepository.findByEmailOrderByDateDesc(email);
    }

    public List<Order> getOrdersByStatus(Order.OrderStatus status) {
        return orderRepository.findByStatusOrderByDateDesc(status);
    }

    public Order updateOrderStatus(String id, Order.OrderStatus status) {
        Order order = getOrder(id);
        order.setStatus(status);
        return orderRepository.save(order);
    }

    public void confirmPayment(String orderId, String paymentId) {
        Order order = getOrder(orderId);
        order.setStatus(Order.OrderStatus.CONFIRMED);
        order.setPaymentId(paymentId);
        orderRepository.save(order);
    }
}