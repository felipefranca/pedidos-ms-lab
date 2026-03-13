package com.playground.auth.dto;

public record UserProfileResponse(
    Long id,
    String name,
    String email,
    String role
) {
}
