package com.playground.notification.service;

import com.playground.notification.event.OrderEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

    public void handle(OrderEvent event) {
        log.info("Notificacao processada: tipo={}, pedido={}, cliente={}, item={}, status={}",
            event.type(), event.orderId(), event.customerName(), event.itemName(), event.status());
    }
}