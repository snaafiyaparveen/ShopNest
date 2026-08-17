package com.shopnest.service;

import com.shopnest.dto.CartItemRequest;
import com.shopnest.dto.CartResponse;
import com.shopnest.exception.BadRequestException;
import com.shopnest.exception.ResourceNotFoundException;
import com.shopnest.model.Cart;
import com.shopnest.model.CartItem;
import com.shopnest.model.Product;
import com.shopnest.model.User;
import com.shopnest.repository.CartItemRepository;
import com.shopnest.repository.CartRepository;
import com.shopnest.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    public Cart getOrCreateCart(User user) {
        return cartRepository.findByUser(user)
                .orElseGet(() ->
                        cartRepository.save(
                                Cart.builder()
                                        .user(user)
                                        .build()
                        )
                );
    }

    @Transactional(readOnly = true)
    public CartResponse getCart(User user) {
        return toResponse(getOrCreateCart(user));
    }

    public CartResponse addItem(
            User user,
            CartItemRequest request
    ) {
        Cart cart = getOrCreateCart(user);

        Product product = productRepository
                .findById(request.getProductId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Product not found"
                        )
                );

        if (request.getQuantity() == null ||
                request.getQuantity() <= 0) {

            throw new BadRequestException(
                    "Quantity must be greater than zero"
            );
        }

        if (product.getStock() != null &&
                product.getStock() < request.getQuantity()) {

            throw new BadRequestException(
                    "Only " +
                            product.getStock() +
                            " units of \"" +
                            product.getName() +
                            "\" left in stock"
            );
        }

        CartItem item =
                cartItemRepository
                        .findByCartAndProduct(cart, product)
                        .orElseGet(() ->
                                CartItem.builder()
                                        .cart(cart)
                                        .product(product)
                                        .quantity(0)
                                        .build()
                        );

        int newQuantity =
                item.getQuantity() +
                        request.getQuantity();

        if (product.getStock() != null &&
                product.getStock() < newQuantity) {

            throw new BadRequestException(
                    "Only " +
                            product.getStock() +
                            " units of \"" +
                            product.getName() +
                            "\" available in stock"
            );
        }

        item.setQuantity(newQuantity);

        cartItemRepository.save(item);

        return toResponse(cart);
    }

    public CartResponse updateItemQuantity(
            User user,
            Long cartItemId,
            Integer quantity
    ) {
        Cart cart = getOrCreateCart(user);

        CartItem item = findCartItem(cart, cartItemId);

        if (quantity == null) {
            throw new BadRequestException(
                    "Quantity is required"
            );
        }

        if (quantity <= 0) {
            cartItemRepository.delete(item);

            cart.getItems().remove(item);

            return toResponse(cart);
        }

        Product product = item.getProduct();

        if (product.getStock() != null &&
                product.getStock() < quantity) {

            throw new BadRequestException(
                    "Only " +
                            product.getStock() +
                            " units of \"" +
                            product.getName() +
                            "\" available in stock"
            );
        }

        item.setQuantity(quantity);

        cartItemRepository.save(item);

        return toResponse(cart);
    }

    public CartResponse removeItem(
            User user,
            Long cartItemId
    ) {
        Cart cart = getOrCreateCart(user);

        CartItem item = findCartItem(
                cart,
                cartItemId
        );

        cartItemRepository.delete(item);

        cart.getItems().remove(item);

        cartItemRepository.flush();

        return toResponse(cart);
    }

    public void clearCart(Cart cart) {
        if (cart == null || cart.getItems() == null) {
            return;
        }

        if (!cart.getItems().isEmpty()) {
            cartItemRepository.deleteAll(cart.getItems());
            cart.getItems().clear();

            cartItemRepository.flush();
        }
    }

    private CartItem findCartItem(
            Cart cart,
            Long cartItemId
    ) {
        return cart.getItems()
                .stream()
                .filter(item ->
                        item.getId().equals(cartItemId)
                )
                .findFirst()
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Cart item not found"
                        )
                );
    }

    private CartResponse toResponse(Cart cart) {

        List<CartResponse.CartItemResponse> items =
                cart.getItems()
                        .stream()
                        .map(item ->
                                CartResponse.CartItemResponse
                                        .builder()
                                        .cartItemId(
                                                item.getId()
                                        )
                                        .productId(
                                                item.getProduct().getId()
                                        )
                                        .productName(
                                                item.getProduct().getName()
                                        )
                                        .imageUrl(
                                                item.getProduct()
                                                        .getImageUrl()
                                        )
                                        .price(
                                                item.getProduct()
                                                        .getPrice()
                                        )
                                        .quantity(
                                                item.getQuantity()
                                        )
                                        .subtotal(
                                                item.getProduct()
                                                        .getPrice()
                                                        .multiply(
                                                                BigDecimal.valueOf(
                                                                        item.getQuantity()
                                                                )
                                                        )
                                        )
                                        .build()
                        )
                        .toList();

        BigDecimal total =
                items.stream()
                        .map(
                                CartResponse.CartItemResponse
                                        ::getSubtotal
                        )
                        .reduce(
                                BigDecimal.ZERO,
                                BigDecimal::add
                        );

        int totalItems =
                items.stream()
                        .mapToInt(
                                CartResponse.CartItemResponse
                                        ::getQuantity
                        )
                        .sum();

        return CartResponse.builder()
                .cartId(cart.getId())
                .items(items)
                .totalAmount(total)
                .totalItems(totalItems)
                .build();
    }
}