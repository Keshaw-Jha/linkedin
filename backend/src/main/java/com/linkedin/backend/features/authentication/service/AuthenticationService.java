package com.linkedin.backend.features.authentication.service;


import com.linkedin.backend.features.authentication.dto.AuthenticationRequestBody;
import com.linkedin.backend.features.authentication.dto.AuthenticationResponseBody;
import com.linkedin.backend.features.authentication.model.AuthenticationUser;
import com.linkedin.backend.features.authentication.repository.AuthenticationUserRepository;
import com.linkedin.backend.features.authentication.utils.Encoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {

    private final Encoder encoder;
    private final AuthenticationUserRepository authenticationUserRepository;


    private AuthenticationService(AuthenticationUserRepository authenticationUserRepository, Encoder encoder) {
        this.authenticationUserRepository = authenticationUserRepository;
        this.encoder = encoder;
    }

    public AuthenticationUser getUser(String email) {
        return authenticationUserRepository.findByEmail(email).orElseThrow(() -> new IllegalArgumentException("User not found"));
    }


    public AuthenticationResponseBody register(AuthenticationRequestBody registerRequestBody) {
        authenticationUserRepository.save(new AuthenticationUser(registerRequestBody.getEmail(), encoder.encode(registerRequestBody.getPassword())));
        return new AuthenticationResponseBody("token", "User registered successfully");
    }

}
