package com.linkedin.backend.features.authentication.service;


import com.linkedin.backend.features.authentication.dto.AuthenticationRequestBody;
import com.linkedin.backend.features.authentication.dto.AuthenticationResponseBody;
import com.linkedin.backend.features.authentication.model.AuthenticationUser;
import com.linkedin.backend.features.authentication.repository.AuthenticationUserRepository;
import com.linkedin.backend.features.authentication.utils.EmailService;
import com.linkedin.backend.features.authentication.utils.Encoder;
import com.linkedin.backend.features.authentication.utils.JsonWebToken;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;

@Service
public class AuthenticationService {

    private final Encoder encoder;
    private final JsonWebToken jsonWebToken;
    private final AuthenticationUserRepository authenticationUserRepository;
    private final EmailService emailService;


    private AuthenticationService(
            AuthenticationUserRepository authenticationUserRepository,
            Encoder encoder,
            JsonWebToken jsonWebToken,
            EmailService emailService) {
        this.authenticationUserRepository = authenticationUserRepository;
        this.encoder = encoder;
        this.jsonWebToken = jsonWebToken;
        this.emailService = emailService;
    }

    public AuthenticationUser getUser(String email) {
        return authenticationUserRepository.findByEmail(email).orElseThrow(() -> new IllegalArgumentException("User not found"));
    }


    public AuthenticationResponseBody register(AuthenticationRequestBody registerRequestBody) throws MessagingException, UnsupportedEncodingException {
        authenticationUserRepository.save(new AuthenticationUser(registerRequestBody.getEmail(), encoder.encode(registerRequestBody.getPassword())));
        String token = jsonWebToken.generateToken(registerRequestBody.getEmail());
        emailService.sendEmail(registerRequestBody.getEmail(),"Some Subject","some body");
        return new AuthenticationResponseBody(token, "User registered successfully");
    }

    public AuthenticationResponseBody login(@Valid AuthenticationRequestBody loginRequestBody) {
        AuthenticationUser user = authenticationUserRepository
                .findByEmail(loginRequestBody.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("User not found."));
        if (!encoder.matches(loginRequestBody.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Password is incorrect.");
        }
        String token = jsonWebToken.generateToken(loginRequestBody.getEmail());
        return new AuthenticationResponseBody(token, "Authentication succeeded");
    }
}
