package com.shopnest.controller;

import com.shopnest.dto.PaymentVerificationRequest;
import com.shopnest.exception.BadRequestException;
import com.shopnest.model.Order;
import com.shopnest.service.OrderService;
import com.shopnest.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
public class PaymentController {

    private final PaymentService paymentService;
    private final OrderService orderService;

    @PostMapping("/razorpay/order/{orderId}")
    public Map<String, Object> createRazorpayOrder(
            @PathVariable Long orderId) {

        Order order =
                orderService.getEntityById(orderId);

        return paymentService.createRazorpayOrder(order);
    }

    @PostMapping("/demo/{orderId}")
    public Map<String, Object> completeDemoPayment(
            @PathVariable Long orderId) {

        Order order =
                orderService.getEntityById(orderId);

        paymentService.completeDemoPayment(order);

        return Map.of(
                "status", "success",
                "message", "Demo payment successful",
                "orderId", order.getId()
        );
    }

    @PostMapping("/razorpay/verify")
    public Map<String, Object> verifyPayment(
            @Valid @RequestBody PaymentVerificationRequest request) {

        Order order =
                orderService.getEntityById(
                        request.getOrderId()
                );

        boolean valid =
                paymentService.verifySignature(request);

        if (!valid) {

            paymentService.markOrderFailed(order);

            throw new BadRequestException(
                    "Payment verification failed"
            );
        }

        paymentService.markOrderPaid(
                order,
                request.getRazorpayPaymentId()
        );

        return Map.of(
                "status", "success",
                "orderId", order.getId()
        );
    }
}