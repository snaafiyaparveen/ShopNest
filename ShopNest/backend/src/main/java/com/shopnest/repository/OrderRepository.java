package com.shopnest.repository;

import com.shopnest.model.Order;
import com.shopnest.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserOrderByCreatedAtDesc(User user);
    Optional<Order> findByRazorpayOrderId(String razorpayOrderId);
}
