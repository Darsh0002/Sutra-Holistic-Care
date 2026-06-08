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

    public Product createProduct(ProductRequest request) {
        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .emoji(request.getEmoji() != null ? request.getEmoji() : "🌿")
                .packs(request.getPacks())
                .ingredients(request.getIngredients())
                .benefits(request.getBenefits())
                .active(true)
                .build();
        return productRepository.save(product);
    }

    public Product updateProduct(String id, ProductRequest request) {
        Product product = getProduct(id);
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        if (request.getEmoji() != null) product.setEmoji(request.getEmoji());
        product.setPacks(request.getPacks());
        product.setIngredients(request.getIngredients());
        product.setBenefits(request.getBenefits());
        return productRepository.save(product);
    }

    public void deleteProduct(String id) {
        Product product = getProduct(id);
        product.setActive(false);        // soft delete
        productRepository.save(product);
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