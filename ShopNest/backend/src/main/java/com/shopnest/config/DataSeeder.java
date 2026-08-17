package com.shopnest.config;

import com.shopnest.model.Product;
import com.shopnest.model.Role;
import com.shopnest.model.User;
import com.shopnest.repository.ProductRepository;
import com.shopnest.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            User admin = User.builder()
                    .fullName("ShopNest Admin")
                    .email("admin@shopnest.com")
                    .password(passwordEncoder.encode("Admin@123"))
                    .role(Role.ADMIN)
                    .build();
            userRepository.save(admin);
        }

        if (productRepository.count() == 0) {
            productRepository.save(Product.builder()
                    .name("Wireless Over-Ear Headphones")
                    .description("Noise-cancelling wireless headphones with 30-hour battery life.")
                    .price(new BigDecimal("2499"))
                    .mrp(new BigDecimal("4999"))
                    .category("Electronics")
                    .imageUrl("https://placehold.co/400x400?text=Headphones")
                    .stock(50)
                    .rating(4.3)
                    .ratingCount(1240)
                    .build());

            productRepository.save(Product.builder()
                    .name("Smart Fitness Watch")
                    .description("Track heart rate, sleep, and workouts with a vibrant AMOLED display.")
                    .price(new BigDecimal("1799"))
                    .mrp(new BigDecimal("3499"))
                    .category("Electronics")
                    .imageUrl("https://placehold.co/400x400?text=Smart+Watch")
                    .stock(80)
                    .rating(4.1)
                    .ratingCount(860)
                    .build());

            productRepository.save(Product.builder()
                    .name("Men's Running Shoes")
                    .description("Lightweight breathable running shoes with cushioned sole.")
                    .price(new BigDecimal("1299"))
                    .mrp(new BigDecimal("2199"))
                    .category("Fashion")
                    .imageUrl("https://placehold.co/400x400?text=Running+Shoes")
                    .stock(120)
                    .rating(4.5)
                    .ratingCount(2310)
                    .build());

            productRepository.save(Product.builder()
                    .name("Non-Stick Cookware Set (5pc)")
                    .description("Induction-friendly non-stick cookware set for everyday cooking.")
                    .price(new BigDecimal("1999"))
                    .mrp(new BigDecimal("3299"))
                    .category("Home & Kitchen")
                    .imageUrl("https://placehold.co/400x400?text=Cookware+Set")
                    .stock(40)
                    .rating(4.2)
                    .ratingCount(430)
                    .build());
        }
    }
}
