package com.shopnest.controller;

import com.shopnest.dto.ProductResponse;
import com.shopnest.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public List<ProductResponse> getAll(@RequestParam(required = false) String category,
                                         @RequestParam(required = false) String q) {
        if (q != null && !q.isBlank()) return productService.search(q);
        if (category != null && !category.isBlank()) return productService.getByCategory(category);
        return productService.getAll();
    }

    /** Powers the "Picked for you" personalized feed on the home page. */
    @GetMapping("/recommended")
    public List<ProductResponse> getRecommended() {
        return productService.getRecommended();
    }

    @GetMapping("/{id}")
    public ProductResponse getById(@PathVariable Long id) {
        return productService.getById(id);
    }
}
