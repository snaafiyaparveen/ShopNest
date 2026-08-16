package com.shopnest.service;

import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import com.shopnest.dto.PaymentVerificationRequest;
import com.shopnest.exception.BadRequestException;
import com.shopnest.model.Order;
import com.shopnest.model.OrderStatus;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final OrderService orderService;

    /*
     * DEMO:
     * No Razorpay API is called.
     *
     * RAZORPAY:
     * Real Razorpay payment processing is used.
     */
    @Value("${payment.mode:DEMO}")
    private String paymentMode;

    @Value("${razorpay.key-id:}")
    private String keyId;

    @Value("${razorpay.key-secret:}")
    private String keySecret;


    /**
     * Creates a payment order.
     *
     * In DEMO mode, no Razorpay API call is made.
     *
     * In RAZORPAY mode, an actual Razorpay order is created.
     */
    public Map<String, Object> createRazorpayOrder(Order order) {

        /*
         * ==========================================
         * DEMO MODE
         * ==========================================
         */
        if ("DEMO".equalsIgnoreCase(paymentMode)) {

            String demoOrderId =
                    "demo_order_" + UUID.randomUUID();

            order.setRazorpayOrderId(demoOrderId);

            orderService.save(order);

            Map<String, Object> response = new HashMap<>();

            response.put("demo", true);
            response.put("razorpayOrderId", demoOrderId);

            response.put(
                    "amount",
                    order.getTotalAmount()
                            .multiply(BigDecimal.valueOf(100))
                            .intValue()
            );

            response.put("currency", "INR");
            response.put("shopnestOrderId", order.getId());

            return response;
        }


        /*
         * ==========================================
         * REAL RAZORPAY MODE
         * ==========================================
         */
        if (!"RAZORPAY".equalsIgnoreCase(paymentMode)) {

            throw new BadRequestException(
                    "Invalid payment mode: " + paymentMode
            );
        }


        /*
         * Check Razorpay credentials.
         */
        if (keyId == null || keyId.isBlank()
                || keySecret == null || keySecret.isBlank()) {

            throw new BadRequestException(
                    "Razorpay credentials are not configured"
            );
        }


        try {

            RazorpayClient client =
                    new RazorpayClient(keyId, keySecret);

            JSONObject options = new JSONObject();

            /*
             * Razorpay expects amount in paise.
             *
             * ₹2499 = 249900 paise
             */
            options.put(
                    "amount",
                    order.getTotalAmount()
                            .multiply(BigDecimal.valueOf(100))
                            .intValue()
            );

            options.put("currency", "INR");

            options.put(
                    "receipt",
                    "order_rcpt_" + order.getId()
            );

            com.razorpay.Order razorpayOrder =
                    client.orders.create(options);

            String razorpayOrderId =
                    razorpayOrder.get("id");

            order.setRazorpayOrderId(razorpayOrderId);

            orderService.save(order);

            Map<String, Object> response =
                    new HashMap<>();

            response.put("demo", false);

            response.put(
                    "razorpayOrderId",
                    razorpayOrderId
            );

            response.put(
                    "amount",
                    razorpayOrder.get("amount")
            );

            response.put(
                    "currency",
                    razorpayOrder.get("currency")
            );

            response.put(
                    "keyId",
                    keyId
            );

            response.put(
                    "shopnestOrderId",
                    order.getId()
            );

            return response;

        } catch (RazorpayException e) {

            throw new BadRequestException(
                    "Unable to create Razorpay order: "
                            + e.getMessage()
            );
        }
    }


    /**
     * Completes a DEMO payment.
     *
     * No Razorpay API is contacted.
     */
    public void completeDemoPayment(Order order) {

        if (!"DEMO".equalsIgnoreCase(paymentMode)) {

            throw new BadRequestException(
                    "Demo payment is not enabled"
            );
        }

        /*
         * Generate a fake payment ID so the order
         * still has a payment reference.
         */
        order.setRazorpayPaymentId(
                "demo_payment_" + UUID.randomUUID()
        );

        order.setStatus(OrderStatus.PAID);

        orderService.save(order);
    }


    /**
     * Verifies a real Razorpay payment signature.
     */
    public boolean verifySignature(
            PaymentVerificationRequest request) {

        /*
         * DEMO mode does not use Razorpay verification.
         */
        if ("DEMO".equalsIgnoreCase(paymentMode)) {
            return true;
        }

        if (keySecret == null || keySecret.isBlank()) {
            return false;
        }

        try {

            JSONObject options =
                    new JSONObject();

            options.put(
                    "razorpay_order_id",
                    request.getRazorpayOrderId()
            );

            options.put(
                    "razorpay_payment_id",
                    request.getRazorpayPaymentId()
            );

            options.put(
                    "razorpay_signature",
                    request.getRazorpaySignature()
            );

            return Utils.verifyPaymentSignature(
                    options,
                    keySecret
            );

        } catch (RazorpayException e) {

            return false;
        }
    }


    /**
     * Marks a real Razorpay payment as PAID.
     */
    public void markOrderPaid(
            Order order,
            String razorpayPaymentId) {

        order.setRazorpayPaymentId(
                razorpayPaymentId
        );

        order.setStatus(OrderStatus.PAID);

        orderService.save(order);
    }


    /**
     * Marks an order as FAILED.
     */
    public void markOrderFailed(Order order) {

        order.setStatus(OrderStatus.FAILED);

        orderService.save(order);
    }
}