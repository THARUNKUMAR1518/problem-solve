package com.secureassess;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@SpringBootApplication
@EnableMongoAuditing
public class SecureAssessApplication {
    public static void main(String[] args) {
        SpringApplication.run(SecureAssessApplication.class, args);
    }
}
