package com.sutra_holistic_care.repositories;

import com.sutra_holistic_care.entities.Product;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ProductRepository extends MongoRepository<Product, String> {
    List<Product> findByActiveTrue();
    List<Product> findByNameContainingIgnoreCase(String name);
}