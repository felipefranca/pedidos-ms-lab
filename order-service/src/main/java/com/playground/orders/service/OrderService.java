package com.playground.orders.service;

import com.playground.orders.domain.Order;
import com.playground.orders.domain.OrderStatus;
import com.playground.orders.dto.CreateOrderRequest;
import com.playground.orders.dto.OrderResponse;
import com.playground.orders.dto.UpdateOrderStatusRequest;
import com.playground.orders.event.OrderEventPublisher;
import com.playground.orders.repository.OrderRepository;
import com.playground.orders.security.AuthenticatedUser;
import java.time.Instant;
import java.util.List;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import static org.springframework.http.HttpStatus.FORBIDDEN;
import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderEventPublisher orderEventPublisher;

    public OrderService(OrderRepository orderRepository, OrderEventPublisher orderEventPublisher) {
        this.orderRepository = orderRepository;
        this.orderEventPublisher = orderEventPublisher;
    }

    @Transactional
    public OrderResponse create(CreateOrderRequest request) {
        AuthenticatedUser user = currentUser();
        Order order = new Order();
        order.setCustomerId(user.userId());
        order.setCustomerName(user.name());
        order.setItemName(request.itemName());
        order.setAmount(request.amount());
        order.setStatus(OrderStatus.CREATED);
        order.setCreatedAt(Instant.now());

        Order savedOrder = orderRepository.save(order);
        orderEventPublisher.publish("ORDER_CREATED", savedOrder);
        return toResponse(savedOrder);
    }

    public List<OrderResponse> listCurrentUserOrders() {
        return orderRepository.findByCustomerIdOrderByCreatedAtDesc(currentUser().userId())
            .stream()
            .map(this::toResponse)
            .toList();
    }

    public OrderResponse getById(Long id) {
        return toResponse(findOwnedOrder(id));
    }

    @Transactional
    public OrderResponse updateStatus(Long id, UpdateOrderStatusRequest request) {
        Order order = findOwnedOrder(id);
        order.setStatus(request.status());
        Order savedOrder = orderRepository.save(order);
        orderEventPublisher.publish("ORDER_STATUS_UPDATED", savedOrder);
        return toResponse(savedOrder);
    }

    private Order findOwnedOrder(Long id) {
        AuthenticatedUser user = currentUser();
        Order order = orderRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Pedido nao encontrado"));
        if (!order.getCustomerId().equals(user.userId())) {
            throw new ResponseStatusException(FORBIDDEN, "Pedido nao pertence ao usuario autenticado");
        }
        return order;
    }

    private AuthenticatedUser currentUser() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof AuthenticatedUser principal)) {
            throw new ResponseStatusException(UNAUTHORIZED, "Token invalido ou ausente");
        }
        return principal;
    }

    private OrderResponse toResponse(Order order) {
        return new OrderResponse(order.getId(), order.getCustomerId(), order.getCustomerName(), order.getItemName(), order.getAmount(), order.getStatus(), order.getCreatedAt());
    }
}
