package com.secureassess.service;

import com.secureassess.dto.AuthResponse;
import com.secureassess.dto.LoginRequest;
import com.secureassess.dto.RefreshTokenRequest;
import com.secureassess.dto.RegisterRequest;
import com.secureassess.entity.User;
import com.secureassess.entity.UserStatus;
import com.secureassess.repository.UserRepository;
import com.secureassess.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtTokenProvider tokenProvider;
    private final PasswordEncoder passwordEncoder;

    // Direct password reset state holder for mock implementation
    private final Map<String, String> resetTokens = new HashMap<>();
    private final Map<String, String> verificationCodes = new HashMap<>();

    public AuthService(AuthenticationManager authenticationManager, UserRepository userRepository,
                       JwtTokenProvider tokenProvider, PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.tokenProvider = tokenProvider;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        User user = (User) authentication.getPrincipal();

        if (user.getStatus() == UserStatus.PENDING_VERIFICATION) {
            throw new IllegalArgumentException("Please verify your email address before logging in.");
        }

        String accessToken = tokenProvider.generateAccessToken(authentication);
        String refreshToken = tokenProvider.generateRefreshToken(authentication);

        String collegeId = user.getCollege() != null ? user.getCollege().getId() : null;

        return new AuthResponse(
                accessToken,
                refreshToken,
                user.getEmail(),
                user.getFullName(),
                user.getRole().name(),
                user.getId(),
                collegeId
        );
    }

    public AuthResponse refresh(RefreshTokenRequest request) {
        String token = request.getRefreshToken();
        if (tokenProvider.validateToken(token)) {
            String email = tokenProvider.getEmailFromJWT(token);
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new IllegalArgumentException("Invalid refresh token user"));

            if (user.getStatus() != UserStatus.ACTIVE) {
                throw new IllegalArgumentException("User account is inactive");
            }

            // Generate new access token
            String newAccessToken = tokenProvider.generateAccessTokenForUser(user);
            String collegeId = user.getCollege() != null ? user.getCollege().getId() : null;

            return new AuthResponse(
                    newAccessToken,
                    token, // Re-use the same refresh token
                    user.getEmail(),
                    user.getFullName(),
                    user.getRole().name(),
                    user.getId(),
                    collegeId
            );
        }
        throw new IllegalArgumentException("Invalid or expired refresh token");
    }

    public void requestPasswordReset(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User with this email does not exist."));

        // Generate simple mock reset token
        String token = "RESET-" + (int)(Math.random() * 900000 + 100000);
        resetTokens.put(email, token);

        System.out.println(">>> PASSWORD RESET REQUEST FOR: " + email);
        System.out.println(">>> RESET CODE: " + token);
    }

    public void resetPassword(String email, String token, String newPassword) {
        String storedToken = resetTokens.get(email);
        if (storedToken == null || !storedToken.equals(token)) {
            throw new IllegalArgumentException("Invalid reset token or email address.");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        resetTokens.remove(email);
    }

    public void requestEmailVerification(String email) {
        String code = "VERIFY-" + (int)(Math.random() * 900000 + 100000);
        verificationCodes.put(email, code);

        System.out.println(">>> EMAIL VERIFICATION FOR: " + email);
        System.out.println(">>> CODE: " + code);
    }

    public void verifyEmail(String email, String code) {
        String storedCode = verificationCodes.get(email);
        if (storedCode == null || !storedCode.equals(code)) {
            throw new IllegalArgumentException("Invalid verification code.");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));

        user.setStatus(UserStatus.ACTIVE);
        userRepository.save(user);
        verificationCodes.remove(email);
    }
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setRole(com.secureassess.entity.Role.STUDENT);
        user.setStatus(com.secureassess.entity.UserStatus.PENDING_VERIFICATION);
        // optional college/department
        // Assuming College and Department repositories exist; skipping for brevity
        userRepository.save(user);
        // generate tokens
        Authentication auth = new UsernamePasswordAuthenticationToken(user.getEmail(), request.getPassword());
        String accessToken = tokenProvider.generateAccessTokenForUser(user);
        String refreshToken = tokenProvider.generateRefreshTokenForUser(user);
        String collegeId = null; // not set here
        return new AuthResponse(accessToken, refreshToken, user.getEmail(), user.getFullName(), user.getRole().name(), user.getId(), collegeId);
    }
}

