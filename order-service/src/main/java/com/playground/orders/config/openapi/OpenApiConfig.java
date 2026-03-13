package com.playground.orders.config.openapi;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI orderServiceOpenApi() {
        return new OpenAPI().info(new Info()
            .title("Order Service API")
            .description("Documentacao da API de pedidos do sistema")
            .version("1.0.0")
            .contact(new Contact().name("Pedidos MS").email("dev@playground.local"))
            .license(new License().name("MIT"))
        );
    }
}