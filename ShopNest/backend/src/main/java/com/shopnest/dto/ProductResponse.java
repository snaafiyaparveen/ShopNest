package com.shopnest.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
public class ProductResponse {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private BigDecimal mrp;
    private Integer discountPercent;
    private String category;
    private String imageUrl;
    private Integer stock;
    private Double rating;
    private Integer ratingCount;
}
