package com.playground.auth.service;

import com.playground.auth.domain.AppUser;
import com.playground.auth.dto.LoginRequest;
import com.playground.auth.dto.RegisterRequest;
import com.playground.auth.repository.UserRepository;
import com.playground.auth.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private AuthService authService;

    private AppUser user;

    @BeforeEach
    void setUp() {
        user = new AppUser();
        user.setId(1L);
        user.setName("Admin");
        user.setEmail("admin@playground.local");
        user.setPassword("encoded");
        user.setRole("USER");
    }

    @Test
    void shouldRegisterUserAndReturnToken() {
        RegisterRequest request = new RegisterRequest("Admin", "admin@playground.local", "123456");

        when(userRepository.existsByEmail(request.email())).thenReturn(false);
        when(passwordEncoder.encode(request.password())).thenReturn("encoded");
        when(userRepository.save(any(AppUser.class))).thenReturn(user);
        when(jwtService.generateToken(1L, "Admin", "admin@playground.local", "USER")).thenReturn("jwt-token");

        var response = authService.register(request);

        assertThat(response.accessToken()).isEqualTo("jwt-token");
        assertThat(response.email()).isEqualTo("admin@playground.local");
        verify(userRepository).save(any(AppUser.class));
    }

    @Test
    void shouldRejectDuplicatedEmailOnRegister() {
        RegisterRequest request = new RegisterRequest("Admin", "admin@playground.local", "123456");
        when(userRepository.existsByEmail(request.email())).thenReturn(true);

        assertThatThrownBy(() -> authService.register(request))
            .isInstanceOf(ResponseStatusException.class)
            .hasMessageContaining("409 CONFLICT");
    }

    @Test
    void shouldLoginExistingUser() {
        LoginRequest request = new LoginRequest("admin@playground.local", "123456");
        when(userRepository.findByEmail(request.email())).thenReturn(Optional.of(user));
        when(jwtService.generateToken(1L, "Admin", "admin@playground.local", "USER")).thenReturn("jwt-token");

        var response = authService.login(request);

        assertThat(response.accessToken()).isEqualTo("jwt-token");
        verify(authenticationManager).authenticate(any());
    }
}
