package com.sutra_holistic_care.services;

import com.sutra_holistic_care.req.OrderRequest;
import com.sutra_holistic_care.req.AdminOrderRequest;
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
    private final SubscriberService subscriberService;

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
        Order saved = orderRepository.save(order);
        // Capture subscriber for marketing CRM
        subscriberService.upsertFromOrder(saved);
    }

    /**
     * Called when the user cancels or fails the Razorpay payment modal.
     * Only deletes the order if it is still PENDING (never paid),
     * so a race condition where payment succeeded just before the call is safe.
     */
    public void cancelUnpaidOrder(String id) {
        orderRepository.findById(id).ifPresent(order -> {
            if (order.getStatus() == Order.OrderStatus.PENDING) {
                orderRepository.delete(order);
            }
        });
    }

    /**
     * Admin attaches courier tracking info to a shipped order.
     * Saves tracking ID and URL on the order, then sends a WhatsApp
     * notification to the customer with the tracking link.
     */
    public Order addTrackingInfo(String id, String trackingId) {
        Order order = getOrder(id);
        order.setTrackingId(trackingId);
        Order saved = orderRepository.save(order);
        // WhatsApp notification is now handled manually by the admin via wa.me redirect in the dashboard
        return saved;
    }

    public Order createAdminOrder(AdminOrderRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product", request.getProductId()));

        List<Pack> packs = product.getPacks();
        if (request.getPackIndex() < 0 || request.getPackIndex() >= packs.size()) {
            throw new BusinessException("Invalid pack selection");
        }

        Pack selectedPack = packs.get(request.getPackIndex());
        long quantity = (request.getQuantity() != null && request.getQuantity() > 0) ? request.getQuantity() : 1;
        long totalAmount = (request.getCustomTotalAmount() != null && request.getCustomTotalAmount() >= 0)
                ? request.getCustomTotalAmount()
                : (selectedPack.getPrice() * quantity);

        Order.OrderStatus status = request.getStatus() != null ? request.getStatus() : Order.OrderStatus.CONFIRMED;
        String paymentId = (request.getPaymentReference() != null && !request.getPaymentReference().trim().isEmpty())
                ? request.getPaymentReference().trim()
                : "MANUAL_CALL_ORDER";

        Order order = Order.builder()
                .name(request.getName())
                .address(request.getAddress())
                .mobile(request.getMobile())
                .email(request.getEmail() != null && !request.getEmail().trim().isEmpty()
                        ? request.getEmail().trim()
                        : request.getMobile() + "@phone.order")
                .quantity(quantity)
                .totalAmount(totalAmount)
                .product(product)
                .selectedPack(selectedPack)
                .status(status)
                .paymentId(paymentId)
                .date(LocalDateTime.now())
                .build();

        Order saved = orderRepository.save(order);
        if (saved.getStatus() == Order.OrderStatus.CONFIRMED
                || saved.getStatus() == Order.OrderStatus.SHIPPED
                || saved.getStatus() == Order.OrderStatus.DELIVERED) {
            subscriberService.upsertFromOrder(saved);
        }
        return saved;
    }
}