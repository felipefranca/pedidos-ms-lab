package com.playground.orders.security;

public record AuthenticatedUser(
    Long userId,
    String name,
    String email,
    String role
) {
}
