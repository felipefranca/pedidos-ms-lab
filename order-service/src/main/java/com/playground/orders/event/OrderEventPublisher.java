package com.playground.orders.event;

import com.playground.orders.domain.Order;
import java.time.Instant;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class OrderEventPublisher {

    private final KafkaTemplate<String, OrderEvent> kafkaTemplate;
    private final String topic;

    public OrderEventPublisher(KafkaTemplate<String, OrderEvent> kafkaTemplate,
                               @Value("${app.kafka.topic.order-events}") String topic) {
        this.kafkaTemplate = kafkaTemplate;
        this.topic = topic;
    }

    public void publish(String type, Order order) {
        OrderEvent event = new OrderEvent(
            type,
            order.getId(),
            order.getCustomerId(),
            order.getCustomerName(),
            order.getItemName(),
            order.getAmount(),
            order.getStatus(),
            order.getCreatedAt(),
            Instant.now()
        );

        kafkaTemplate.send(topic, String.valueOf(order.getId()), event);
    }
}
