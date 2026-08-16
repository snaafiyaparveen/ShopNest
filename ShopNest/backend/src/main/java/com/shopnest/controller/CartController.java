package com.shopnest.controller;

import com.shopnest.dto.CartItemRequest;
import com.shopnest.dto.CartResponse;
import com.shopnest.security.UserPrincipal;
import com.shopnest.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
public class CartController {

    private final CartService cartService;

    @GetMapping
    public CartResponse getCart(@AuthenticationPrincipal UserPrincipal principal) {
        return cartService.getCart(principal.getUser());
    }

    @PostMapping("/items")
    public CartResponse addItem(@AuthenticationPrincipal UserPrincipal principal,
                                 @Valid @RequestBody CartItemRequest request) {
        return cartService.addItem(principal.getUser(), request);
    }

    @PutMapping("/items/{cartItemId}")
    public CartResponse updateItem(@AuthenticationPrincipal UserPrincipal principal,
                                    @PathVariable Long cartItemId,
                                    @RequestParam Integer quantity) {
        return cartService.updateItemQuantity(principal.getUser(), cartItemId, quantity);
    }

    @DeleteMapping("/items/{cartItemId}")
    public CartResponse removeItem(@AuthenticationPrincipal UserPrincipal principal,
                                    @PathVariable Long cartItemId) {
        return cartService.removeItem(principal.getUser(), cartItemId);
    }
}
