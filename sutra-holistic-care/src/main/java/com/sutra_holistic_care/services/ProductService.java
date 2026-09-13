package com.sutra_holistic_care.services;

import com.sutra_holistic_care.req.ProductRequest;
import com.sutra_holistic_care.entities.Product;
import com.sutra_holistic_care.exceptions.ResourceNotFoundException;
import com.sutra_holistic_care.repositories.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final StaffActivityLogService activityLogService;

    public Product createProduct(ProductRequest request) {
        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .image(request.getImage())
                .packs(request.getPacks())
                .ingredients(request.getIngredients())
                .benefits(request.getBenefits())
                .active(request.getActive() != null ? request.getActive() : true)
                .build();
        Product saved = productRepository.save(product);
        activityLogService.logCurrentAdminAction("CREATE_PRODUCT", "PRODUCT", saved.getId(), "Created product: " + saved.getName());
        return saved;
    }

    public Product updateProduct(String id, ProductRequest request) {
        Product product = getProduct(id);
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        if (request.getImage() != null) product.setImage(request.getImage());
        product.setPacks(request.getPacks());
        product.setIngredients(request.getIngredients());
        product.setBenefits(request.getBenefits());
        if (request.getActive() != null) product.setActive(request.getActive());
        Product saved = productRepository.save(product);
        activityLogService.logCurrentAdminAction("UPDATE_PRODUCT", "PRODUCT", id, "Updated product: " + saved.getName());
        return saved;
    }

    public void deleteProduct(String id) {
        Product product = getProduct(id);
        product.setActive(false);        // soft delete
        productRepository.save(product);
        activityLogService.logCurrentAdminAction("DELETE_PRODUCT", "PRODUCT", id, "Deleted/deactivated product: " + product.getName());
    }

    public Product getProduct(String id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", id));
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public List<Product> getActiveProducts() {
        return productRepository.findByActiveTrue();
    }

    public List<Product> searchProducts(String name) {
        return productRepository.findByNameContainingIgnoreCase(name);
    }
}