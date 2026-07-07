package com.secureassess.repository;

import com.secureassess.entity.College;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CollegeRepository extends MongoRepository<College, String> {
    Optional<College> findByName(String name);
    Optional<College> findByCode(String code);
    boolean existsByCode(String code);
}
