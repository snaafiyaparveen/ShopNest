package com.shopnest.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class CartItemRequest {
    @NotNull
    private Long productId;

    @Positive
    private Integer quantity = 1;
}
