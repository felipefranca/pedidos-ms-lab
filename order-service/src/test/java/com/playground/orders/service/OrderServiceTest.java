package com.playground.orders.service;

import com.playground.orders.domain.Order;
import com.playground.orders.domain.OrderStatus;
import com.playground.orders.dto.CreateOrderRequest;
import com.playground.orders.dto.UpdateOrderStatusRequest;
import com.playground.orders.event.OrderEventPublisher;
import com.playground.orders.repository.OrderRepository;
import com.playground.orders.security.AuthenticatedUser;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private OrderEventPublisher orderEventPublisher;

    @InjectMocks
    private OrderService orderService;

    private AuthenticatedUser authenticatedUser;

    @BeforeEach
    void setUp() {
        authenticatedUser = new AuthenticatedUser(7L, "Felipe", "felipe@local", "USER");
        SecurityContextHolder.getContext().setAuthentication(
            new UsernamePasswordAuthenticationToken(authenticatedUser, null, List.of())
        );
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void shouldCreateOrderForAuthenticatedUser() {
        Order saved = new Order();
        saved.setId(10L);
        saved.setCustomerId(7L);
        saved.setCustomerName("Felipe");
        saved.setItemName("Notebook Gamer");
        saved.setAmount(new BigDecimal("5999.90"));
        saved.setStatus(OrderStatus.CREATED);
        saved.setCreatedAt(Instant.now());

        when(orderRepository.save(any(Order.class))).thenReturn(saved);

        var response = orderService.create(new CreateOrderRequest("Notebook Gamer", new BigDecimal("5999.90")));

        assertThat(response.id()).isEqualTo(10L);
        assertThat(response.customerId()).isEqualTo(7L);
        verify(orderEventPublisher).publish("ORDER_CREATED", saved);
    }

    @Test
    void shouldListOnlyCurrentUserOrders() {
        Order order = new Order();
        order.setId(10L);
        order.setCustomerId(7L);
        order.setCustomerName("Felipe");
        order.setItemName("Mouse");
        order.setAmount(new BigDecimal("99.90"));
        order.setStatus(OrderStatus.CREATED);
        order.setCreatedAt(Instant.now());

        when(orderRepository.findByCustomerIdOrderByCreatedAtDesc(7L)).thenReturn(List.of(order));

        var result = orderService.listCurrentUserOrders();

        assertThat(result).hasSize(1);
        assertThat(result.getFirst().itemName()).isEqualTo("Mouse");
    }

    @Test
    void shouldRejectAccessToAnotherUsersOrder() {
        Order order = new Order();
        order.setId(11L);
        order.setCustomerId(8L);
        when(orderRepository.findById(11L)).thenReturn(Optional.of(order));

        assertThatThrownBy(() -> orderService.getById(11L))
            .isInstanceOf(ResponseStatusException.class)
            .hasMessageContaining("403 FORBIDDEN");
    }

    @Test
    void shouldUpdateStatusAndPublishEvent() {
        Order order = new Order();
        order.setId(10L);
        order.setCustomerId(7L);
        order.setCustomerName("Felipe");
        order.setItemName("Mouse");
        order.setAmount(new BigDecimal("99.90"));
        order.setStatus(OrderStatus.CREATED);
        order.setCreatedAt(Instant.now());

        when(orderRepository.findById(10L)).thenReturn(Optional.of(order));
        when(orderRepository.save(any(Order.class))).thenReturn(order);

        var response = orderService.updateStatus(10L, new UpdateOrderStatusRequest(OrderStatus.PAID));

        assertThat(response.status()).isEqualTo(OrderStatus.PAID);
        verify(orderEventPublisher).publish("ORDER_STATUS_UPDATED", order);
    }
}
