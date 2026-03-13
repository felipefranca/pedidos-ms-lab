package com.playground.notification.event;

import java.math.BigDecimal;
import java.time.Instant;

public record OrderEvent(
    String type,
    Long orderId,
    Long customerId,
    String customerName,
    String itemName,
    BigDecimal amount,
    String status,
    Instant createdAt,
    Instant occurredAt
) {
}