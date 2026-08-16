package com.shopnest.controller;

import com.shopnest.dto.OrderRequest;
import com.shopnest.dto.OrderResponse;
import com.shopnest.security.UserPrincipal;
import com.shopnest.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public OrderResponse createOrder(@AuthenticationPrincipal UserPrincipal principal,
                                      @Valid @RequestBody OrderRequest request) {
        return orderService.createOrderFromCart(principal.getUser(), request);
    }

    @GetMapping
    public List<OrderResponse> myOrders(@AuthenticationPrincipal UserPrincipal principal) {
        return orderService.getOrdersForUser(principal.getUser());
    }

    @GetMapping("/{id}")
    public OrderResponse getOrder(@PathVariable Long id) {
        return orderService.getById(id);
    }
}
