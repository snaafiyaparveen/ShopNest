package com.shopnest.service;

import com.shopnest.dto.ProductRequest;
import com.shopnest.dto.ProductResponse;
import com.shopnest.exception.ResourceNotFoundException;
import com.shopnest.model.Product;
import com.shopnest.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public List<ProductResponse> getAll() {
        return productRepository.findByActiveTrue().stream().map(this::toResponse).toList();
    }

    public List<ProductResponse> getByCategory(String category) {
        return productRepository.findByCategoryIgnoreCaseAndActiveTrue(category)
                .stream().map(this::toResponse).toList();
    }

    public List<ProductResponse> search(String query) {
        return productRepository.search(query).stream().map(this::toResponse).toList();
    }

    public List<ProductResponse> getRecommended() {
        return productRepository.findTop10ByActiveTrueOrderByRatingDesc()
                .stream().map(this::toResponse).toList();
    }

    public ProductResponse getById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id " + id));
        return toResponse(product);
    }

    public ProductResponse create(ProductRequest request) {
        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .mrp(request.getMrp())
                .category(request.getCategory())
                .imageUrl(request.getImageUrl())
                .stock(request.getStock() == null ? 0 : request.getStock())
                .build();
        return toResponse(productRepository.save(product));
    }

    public ProductResponse update(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id " + id));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setMrp(request.getMrp());
        product.setCategory(request.getCategory());
        product.setImageUrl(request.getImageUrl());
        if (request.getStock() != null) {
            product.setStock(request.getStock());
        }
        return toResponse(productRepository.save(product));
    }

    public void delete(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id " + id));
        product.setActive(false);
        productRepository.save(product);
    }

    private ProductResponse toResponse(Product p) {
        Integer discountPercent = null;
        if (p.getMrp() != null && p.getMrp().compareTo(BigDecimal.ZERO) > 0
                && p.getMrp().compareTo(p.getPrice()) > 0) {
            BigDecimal diff = p.getMrp().subtract(p.getPrice());
            discountPercent = diff.multiply(BigDecimal.valueOf(100))
                    .divide(p.getMrp(), 0, RoundingMode.HALF_UP)
                    .intValue();
        }

        return ProductResponse.builder()
                .id(p.getId())
                .name(p.getName())
                .description(p.getDescription())
                .price(p.getPrice())
                .mrp(p.getMrp())
                .discountPercent(discountPercent)
                .category(p.getCategory())
                .imageUrl(p.getImageUrl())
                .stock(p.getStock())
                .rating(p.getRating())
                .ratingCount(p.getRatingCount())
                .build();
    }
}
