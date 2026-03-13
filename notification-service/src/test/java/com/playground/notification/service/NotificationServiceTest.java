package com.playground.notification.service;

import com.playground.notification.event.OrderEvent;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.Instant;

import static org.assertj.core.api.Assertions.assertThatCode;

class NotificationServiceTest {

    private final NotificationService notificationService = new NotificationService();

    @Test
    void shouldHandleOrderEventWithoutThrowing() {
        OrderEvent event = new OrderEvent(
            "ORDER_CREATED",
            1L,
            10L,
            "Felipe",
            "Notebook",
            new BigDecimal("2999.90"),
            "CREATED",
            Instant.now(),
            Instant.now()
        );

        assertThatCode(() -> notificationService.handle(event)).doesNotThrowAnyException();
    }
}