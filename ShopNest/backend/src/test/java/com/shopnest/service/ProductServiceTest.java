package com.shopnest.service;

import com.shopnest.dto.ProductRequest;
import com.shopnest.dto.ProductResponse;
import com.shopnest.exception.ResourceNotFoundException;
import com.shopnest.model.Product;
import com.shopnest.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;

    private Product sampleProduct;

    @BeforeEach
    void setUp() {
        sampleProduct = Product.builder()
                .id(1L)
                .name("Wireless Mouse")
                .description("Ergonomic wireless mouse")
                .price(new BigDecimal("799"))
                .mrp(new BigDecimal("1199"))
                .category("Electronics")
                .stock(25)
                .rating(4.4)
                .ratingCount(120)
                .active(true)
                .build();
    }

    @Test
    void getById_returnsProductWithCalculatedDiscount() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(sampleProduct));

        ProductResponse response = productService.getById(1L);

        assertThat(response.getName()).isEqualTo("Wireless Mouse");
        // (1199 - 799) / 1199 * 100 ≈ 33%
        assertThat(response.getDiscountPercent()).isEqualTo(33);
    }

    @Test
    void getById_throwsWhenProductMissing() {
        when(productRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> productService.getById(99L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void getAll_returnsOnlyActiveProducts() {
        when(productRepository.findByActiveTrue()).thenReturn(List.of(sampleProduct));

        List<ProductResponse> results = productService.getAll();

        assertThat(results).hasSize(1);
        assertThat(results.get(0).getCategory()).isEqualTo("Electronics");
    }

    @Test
    void create_savesAndReturnsNewProduct() {
        ProductRequest request = new ProductRequest();
        request.setName("USB-C Hub");
        request.setPrice(new BigDecimal("1499"));
        request.setCategory("Electronics");
        request.setStock(15);

        when(productRepository.save(any(Product.class))).thenAnswer(invocation -> {
            Product p = invocation.getArgument(0);
            p.setId(2L);
            return p;
        });

        ProductResponse response = productService.create(request);

        assertThat(response.getId()).isEqualTo(2L);
        assertThat(response.getName()).isEqualTo("USB-C Hub");
    }
}
