package com.shopnest.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductRequest {
    @NotBlank
    private String name;

    private String description;

    @NotNull @PositiveOrZero
    private BigDecimal price;

    private BigDecimal mrp;

    @NotBlank
    private String category;

    private String imageUrl;

    @PositiveOrZero
    private Integer stock;
}
