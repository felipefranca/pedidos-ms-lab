package com.playground.auth.config.openapi;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI authServiceOpenApi() {
        return new OpenAPI().info(new Info()
            .title("Auth Service API")
            .description("Documentacao da API de autenticacao do sistema de pedidos")
            .version("1.0.0")
            .contact(new Contact().name("Pedidos MS").email("dev@playground.local"))
            .license(new License().name("MIT"))
        );
    }
}