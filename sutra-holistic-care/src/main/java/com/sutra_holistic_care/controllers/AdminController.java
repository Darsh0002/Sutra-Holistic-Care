package com.sutra_holistic_care.controllers;

import com.sutra_holistic_care.entities.*;
import com.sutra_holistic_care.req.*;
import com.sutra_holistic_care.services.*;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final OrderService orderService;
    private final ConsultationService consultationService;
    private final SeminarService seminarService;
    private final ProductService productService;
    private final RegistrationService registrationService;

    // ─── Dashboard ───────────────────────────────────────────────

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DashboardStats>> getDashboardStats() {
        DashboardStats stats = adminService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    // ─── Orders ──────────────────────────────────────────────────

    @GetMapping("/orders")
    public ResponseEntity<ApiResponse<List<Order>>> getAllOrders() {
        List<Order> orders = orderService.getAllOrders();
        return ResponseEntity.ok(ApiResponse.success(orders));
    }

    @GetMapping("/orders/{id}")
    public ResponseEntity<ApiResponse<Order>> getOrder(@PathVariable String id) {
        Order order = orderService.getOrder(id);
        return ResponseEntity.ok(ApiResponse.success(order));
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<ApiResponse<Order>> updateOrderStatus(
            @PathVariable String id, @RequestParam Order.OrderStatus status) {
        Order order = orderService.updateOrderStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Order status updated", order));
    }

    @PutMapping("/orders/{id}/tracking")
    public ResponseEntity<ApiResponse<Order>> addTrackingInfo(
            @PathVariable String id,
            @RequestParam String trackingId) {
        Order order = orderService.addTrackingInfo(id, trackingId);
        return ResponseEntity.ok(ApiResponse.success("Tracking info saved", order));
    }

    // ─── Consultations ──────────────────────────────────────────

    @GetMapping("/consultations")
    public ResponseEntity<ApiResponse<List<Consultation>>> getAllConsultations() {
        List<Consultation> consultations = consultationService.getAllConsultations();
        return ResponseEntity.ok(ApiResponse.success(consultations));
    }

    @GetMapping("/consultations/{id}")
    public ResponseEntity<ApiResponse<Consultation>> getConsultation(@PathVariable String id) {
        Consultation consultation = consultationService.getConsultation(id);
        return ResponseEntity.ok(ApiResponse.success(consultation));
    }

    @GetMapping("/consultations/date/{date}")
    public ResponseEntity<ApiResponse<List<Consultation>>> getConsultationsByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<Consultation> consultations = consultationService.getConsultationsByDate(date);
        return ResponseEntity.ok(ApiResponse.success(consultations));
    }

    @GetMapping("/consultations/status/{status}")
    public ResponseEntity<ApiResponse<List<Consultation>>> getConsultationsByStatus(
            @PathVariable Consultation.ConsultationStatus status) {
        List<Consultation> consultations = consultationService.getConsultationsByStatus(status);
        return ResponseEntity.ok(ApiResponse.success(consultations));
    }

    @PutMapping("/consultations/{id}/status")
    public ResponseEntity<ApiResponse<Consultation>> updateConsultationStatus(
            @PathVariable String id, @RequestParam Consultation.ConsultationStatus status) {
        Consultation consultation = consultationService.updateStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Consultation status updated", consultation));
    }

    @PutMapping("/consultations/{id}/video-link")
    public ResponseEntity<ApiResponse<Consultation>> sendVideoLink(
            @PathVariable String id, @RequestParam String videoLink) {
        Consultation consultation = consultationService.sendVideoLink(id, videoLink);
        return ResponseEntity.ok(ApiResponse.success("Video link sent", consultation));
    }

    @PutMapping("/consultations/{id}/doctor-notes")
    public ResponseEntity<ApiResponse<Consultation>> addDoctorNotes(
            @PathVariable String id, @RequestBody String notes) {
        Consultation consultation = consultationService.addDoctorNotes(id, notes);
        return ResponseEntity.ok(ApiResponse.success("Doctor notes added", consultation));
    }

    // ─── Seminars ────────────────────────────────────────────────

    @GetMapping("/seminars")
    public ResponseEntity<ApiResponse<List<Seminar>>> getAllSeminars() {
        List<Seminar> seminars = seminarService.getAllSeminars();
        return ResponseEntity.ok(ApiResponse.success(seminars));
    }

    @PostMapping("/seminars")
    public ResponseEntity<ApiResponse<Seminar>> createSeminar(@RequestBody SeminarRequest request) {
        Seminar seminar = seminarService.createSeminar(request);
        return ResponseEntity.ok(ApiResponse.success("Seminar created successfully", seminar));
    }

    @PutMapping("/seminars/{id}")
    public ResponseEntity<ApiResponse<Seminar>> updateSeminar(
            @PathVariable String id, @RequestBody SeminarRequest request) {
        Seminar seminar = seminarService.updateSeminar(id, request);
        return ResponseEntity.ok(ApiResponse.success("Seminar updated successfully", seminar));
    }

    @DeleteMapping("/seminars/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteSeminar(@PathVariable String id) {
        seminarService.deleteSeminar(id);
        return ResponseEntity.ok(ApiResponse.success("Seminar deactivated successfully", null));
    }

    // ─── Products ────────────────────────────────────────────────

    @GetMapping("/products")
    public ResponseEntity<ApiResponse<List<Product>>> getAllProducts() {
        List<Product> products = productService.getAllProducts();
        return ResponseEntity.ok(ApiResponse.success(products));
    }

    @PostMapping("/products")
    public ResponseEntity<ApiResponse<Product>> createProduct(@RequestBody ProductRequest request) {
        Product product = productService.createProduct(request);
        return ResponseEntity.ok(ApiResponse.success("Product created successfully", product));
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<ApiResponse<Product>> updateProduct(
            @PathVariable String id, @RequestBody ProductRequest request) {
        Product product = productService.updateProduct(id, request);
        return ResponseEntity.ok(ApiResponse.success("Product updated successfully", product));
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable String id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.success("Product deactivated successfully", null));
    }

    // ─── Registrations ───────────────────────────────────────────

    @GetMapping("/registrations")
    public ResponseEntity<ApiResponse<List<Registration>>> getAllRegistrations() {
        List<Registration> registrations = registrationService.getAllRegistrations();
        return ResponseEntity.ok(ApiResponse.success(registrations));
    }

    @GetMapping("/registrations/seminar/{seminarId}")
    public ResponseEntity<ApiResponse<List<Registration>>> getRegistrationsBySeminar(@PathVariable String seminarId) {
        List<Registration> registrations = registrationService.getRegistrationsBySeminar(seminarId);
        return ResponseEntity.ok(ApiResponse.success(registrations));
    }

    @PutMapping("/registrations/{id}/cancel")
    public ResponseEntity<ApiResponse<Void>> cancelRegistration(@PathVariable String id) {
        registrationService.cancelRegistration(id);
        return ResponseEntity.ok(ApiResponse.success("Registration cancelled successfully", null));
    }
}
