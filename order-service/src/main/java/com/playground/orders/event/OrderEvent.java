package com.playground.orders.event;

import com.playground.orders.domain.OrderStatus;
import java.math.BigDecimal;
import java.time.Instant;

public record OrderEvent(
    String type,
    Long orderId,
    Long customerId,
    String customerName,
    String itemName,
    BigDecimal amount,
    OrderStatus status,
    Instant createdAt,
    Instant occurredAt
) {
}
