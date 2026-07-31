package com.secureassess.service;

import com.secureassess.entity.*;
import com.secureassess.repository.*;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final CollegeRepository collegeRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, CollegeRepository collegeRepository,
                       DepartmentRepository departmentRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.collegeRepository = collegeRepository;
        this.departmentRepository = departmentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<User> getUsersByRole(Role role) {
        return userRepository.findByRole(role);
    }

    @Transactional(readOnly = true)
    public List<User> getUsersByCollege(String collegeId) {
        return userRepository.findByCollegeId(collegeId);
    }

    @Transactional(readOnly = true)
    public List<User> getUsersByDepartment(String departmentId) {
        return userRepository.findByDepartmentId(departmentId);
    }

    @Transactional(readOnly = true)
    public User getUserById(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + id));
    }

    public User createUser(User user, String collegeId, String departmentId) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("User with email " + user.getEmail() + " already exists.");
        }

        if (collegeId != null) {
            College college = collegeRepository.findById(collegeId)
                    .orElseThrow(() -> new IllegalArgumentException("College not found with ID: " + collegeId));
            user.setCollege(college);
        }

        if (departmentId != null) {
            Department department = departmentRepository.findById(departmentId)
                    .orElseThrow(() -> new IllegalArgumentException("Department not found with ID: " + departmentId));
            user.setDepartment(department);
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setStatus(UserStatus.ACTIVE); // Administrators/instructors added by admins are immediately ACTIVE
        return userRepository.save(user);
    }

    public User updateUser(String id, User userDetails) {
        User user = getUserById(id);
        user.setFullName(userDetails.getFullName());
        
        // If password is changed, encode it
        if (userDetails.getPassword() != null && !userDetails.getPassword().isBlank() && 
            !userDetails.getPassword().startsWith("$2a$")) { // Simple check to avoid double hashing if client sends hash
            user.setPassword(passwordEncoder.encode(userDetails.getPassword()));
        }
        
        user.setStatus(userDetails.getStatus());
        return userRepository.save(user);
    }

    public void deleteUser(String id) {
        User user = getUserById(id);
        userRepository.delete(user); // Soft delete via @SQLDelete
    }

    public List<User> importStudentsFromCSV(MultipartFile file, String collegeId, String departmentId) {
        College college = collegeRepository.findById(collegeId)
                .orElseThrow(() -> new IllegalArgumentException("College not found with ID: " + collegeId));
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new IllegalArgumentException("Department not found with ID: " + departmentId));

        List<User> importedUsers = new ArrayList<>();

        try (BufferedReader fileReader = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8));
             CSVParser csvParser = new CSVParser(fileReader, CSVFormat.DEFAULT.withFirstRecordAsHeader().withIgnoreHeaderCase().withTrim())) {

            Iterable<CSVRecord> csvRecords = csvParser.getRecords();

            for (CSVRecord csvRecord : csvRecords) {
                String email = csvRecord.get("email");
                String fullName = csvRecord.get("fullName");
                String password = csvRecord.get("password");

                if (userRepository.existsByEmail(email)) {
                    continue; // Skip existing emails
                }

                User student = new User();
                student.setEmail(email);
                student.setFullName(fullName);
                student.setPassword(passwordEncoder.encode(password));
                student.setRole(Role.STUDENT);
                student.setStatus(UserStatus.ACTIVE); // Auto activated upon import
                student.setCollege(college);
                student.setDepartment(department);

                importedUsers.add(student);
            }

            if (!importedUsers.isEmpty()) {
                userRepository.saveAll(importedUsers);
            }

        } catch (Exception e) {
            throw new RuntimeException("Failed to parse CSV file: " + e.getMessage());
        }

        return importedUsers;
    }
}
