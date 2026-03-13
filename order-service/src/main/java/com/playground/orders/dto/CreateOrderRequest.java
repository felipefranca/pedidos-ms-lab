package com.playground.orders.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;

public record CreateOrderRequest(
    @NotBlank String itemName,
    @DecimalMin("0.01") BigDecimal amount
) {
}
