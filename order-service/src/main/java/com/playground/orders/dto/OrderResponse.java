package com.playground.orders.dto;

import com.playground.orders.domain.OrderStatus;
import java.math.BigDecimal;
import java.time.Instant;

public record OrderResponse(
    Long id,
    Long customerId,
    String customerName,
    String itemName,
    BigDecimal amount,
    OrderStatus status,
    Instant createdAt
) {
}
