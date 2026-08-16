package com.shopnest.service;

import com.shopnest.dto.OrderRequest;
import com.shopnest.dto.OrderResponse;
import com.shopnest.exception.BadRequestException;
import com.shopnest.exception.ResourceNotFoundException;
import com.shopnest.model.*;
import com.shopnest.repository.OrderRepository;
import com.shopnest.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final CartService cartService;

    public OrderResponse createOrderFromCart(User user, OrderRequest request) {
        Cart cart = cartService.getOrCreateCart(user);
        if (cart.getItems().isEmpty()) {
            throw new BadRequestException("Your cart is empty");
        }

        List<OrderItem> orderItems = cart.getItems().stream().map(ci -> {
            Product product = ci.getProduct();
            if (product.getStock() != null && product.getStock() < ci.getQuantity()) {
                throw new BadRequestException("Only " + product.getStock() + " units of \"" + product.getName() + "\" left in stock");
            }
            return OrderItem.builder()
                    .product(product)
                    .quantity(ci.getQuantity())
                    .priceAtPurchase(product.getPrice())
                    .build();
        }).toList();

        BigDecimal total = orderItems.stream()
                .map(oi -> oi.getPriceAtPurchase().multiply(BigDecimal.valueOf(oi.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

         Order order = Order.builder()
                .user(user)
                .totalAmount(total)
                .status(OrderStatus.CREATED)
                .shippingAddress(request.getShippingAddress())
                .build();

        orderItems.forEach(oi -> oi.setOrder(order));
        order.setItems(orderItems);

        Order savedOrder = orderRepository.save(order);

        // Decrement stock and clear the cart once the order is placed.
        orderItems.forEach(oi -> {
            Product p = oi.getProduct();
            if (p.getStock() != null) {
                p.setStock(p.getStock() - oi.getQuantity());
                productRepository.save(p);
            }
        });
        cartService.clearCart(cart);

        return toResponse(order);
    }

    public List<OrderResponse> getOrdersForUser(User user) {
        return orderRepository.findByUserOrderByCreatedAtDesc(user).stream().map(this::toResponse).toList();
    }

    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll().stream().map(this::toResponse).toList();
    }

    public OrderResponse getById(Long id) {
        return toResponse(orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id " + id)));
    }

    public Order getEntityById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id " + id));
    }

    public OrderResponse updateStatus(Long id, OrderStatus status) {
        Order order = getEntityById(id);
        order.setStatus(status);
        order.setUpdatedAt(LocalDateTime.now());
        return toResponse(orderRepository.save(order));
    }

    public Order save(Order order) {
        return orderRepository.save(order);
    }

    private OrderResponse toResponse(Order order) {
        List<OrderResponse.OrderItemResponse> items = order.getItems().stream()
                .map(oi -> OrderResponse.OrderItemResponse.builder()
                        .productId(oi.getProduct().getId())
                        .productName(oi.getProduct().getName())
                        .quantity(oi.getQuantity())
                        .priceAtPurchase(oi.getPriceAtPurchase())
                        .build())
                .toList();

        return OrderResponse.builder()
                .id(order.getId())
                .status(order.getStatus().name())
                .totalAmount(order.getTotalAmount())
                .shippingAddress(order.getShippingAddress())
                .razorpayOrderId(order.getRazorpayOrderId())
                .createdAt(order.getCreatedAt())
                .items(items)
                .build();
    }
}
