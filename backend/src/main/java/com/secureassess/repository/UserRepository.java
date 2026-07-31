package com.secureassess.repository;

import com.secureassess.entity.Role;
import com.secureassess.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    long countByRole(Role role);
    
    List<User> findByRole(Role role);
    List<User> findByCollegeId(String collegeId);
    List<User> findByDepartmentId(String departmentId);
}
