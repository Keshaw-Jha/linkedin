package com.linkedin.backend.configuration;

import com.linkedin.backend.features.authentication.utils.Encoder;
import org.springframework.context.annotation.Configuration;

@Configuration
public class LoadDatabaseConfiguration {
    private final Encoder encoder;

    public LoadDatabaseConfiguration(Encoder encoder) {
        this.encoder = encoder;
    }

//    @Bean
//    public CommandLineRunner initDatabase(AuthenticationUserRepository authenticationUserRepository) {
//        return args -> {
//            AuthenticationUser authenticationUser = new AuthenticationUser("keshaw@example.com", encoder.encode("keshaw")) ;
//
//            authenticationUserRepository.save(authenticationUser);
//        };
//    }

}
