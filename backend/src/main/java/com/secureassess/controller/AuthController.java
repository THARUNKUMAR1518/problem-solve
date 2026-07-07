package com.secureassess.controller;

import com.secureassess.dto.AuthResponse;
import com.secureassess.dto.LoginRequest;
import com.secureassess.dto.RefreshTokenRequest;
import com.secureassess.dto.RegisterRequest;
import com.secureassess.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        AuthResponse response = authService.login(loginRequest);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        AuthResponse response = authService.refresh(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(@RequestParam String email) {
        authService.requestPasswordReset(email);
        return ResponseEntity.ok(Map.of("message", "Password reset instructions sent. Please check your console log."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(
            @RequestParam String email,
            @RequestParam String token,
            @RequestParam String newPassword) {
        authService.resetPassword(email, token, newPassword);
        return ResponseEntity.ok(Map.of("message", "Password has been reset successfully."));
    }

    @PostMapping("/verify-email")
    public ResponseEntity<Map<String, String>> verifyEmail(
            @RequestParam String email,
            @RequestParam String code) {
        authService.verifyEmail(email, code);
        return ResponseEntity.ok(Map.of("message", "Email verified successfully. Account is now active."));
    }

    @PostMapping("/request-verification")
    public ResponseEntity<Map<String, String>> requestVerification(@RequestParam String email) {
        authService.requestEmailVerification(email);
        return ResponseEntity.ok(Map.of("message", "Verification code sent. Please check your console log."));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(response);
    }
}
