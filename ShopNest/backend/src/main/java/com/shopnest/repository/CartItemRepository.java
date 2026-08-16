package com.shopnest.repository;

import com.shopnest.model.Cart;
import com.shopnest.model.CartItem;
import com.shopnest.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    Optional<CartItem> findByCartAndProduct(Cart cart, Product product);
}
