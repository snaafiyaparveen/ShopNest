package com.shopnest.controller;

import com.shopnest.dto.OrderResponse;
import com.shopnest.dto.ProductRequest;
import com.shopnest.dto.ProductResponse;
import com.shopnest.model.OrderStatus;
import com.shopnest.service.OrderService;
import com.shopnest.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final ProductService productService;
    private final OrderService orderService;

    @PostMapping("/products")
    public ProductResponse createProduct(@Valid @RequestBody ProductRequest request) {
        return productService.create(request);
    }

    @PutMapping("/products/{id}")
    public ProductResponse updateProduct(@PathVariable Long id, @Valid @RequestBody ProductRequest request) {
        return productService.update(id, request);
    }

    @DeleteMapping("/products/{id}")
    public void deleteProduct(@PathVariable Long id) {
        productService.delete(id);
    }

    @GetMapping("/orders")
    public List<OrderResponse> getAllOrders() {
        return orderService.getAllOrders();
    }

    @PatchMapping("/orders/{id}/status")
    public OrderResponse updateOrderStatus(@PathVariable Long id, @RequestParam OrderStatus status) {
        return orderService.updateStatus(id, status);
    }
}
