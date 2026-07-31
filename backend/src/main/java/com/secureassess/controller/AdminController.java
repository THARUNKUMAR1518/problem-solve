package com.secureassess.controller;

import com.secureassess.entity.Role;
import com.secureassess.entity.User;
import com.secureassess.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAnyRole('ROLE_SUPER_ADMIN', 'ROLE_COLLEGE_ADMIN')")
public class AdminController {

    private final UserService userService;

    public AdminController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getUsers(
            @RequestParam(required = false) Role role,
            @RequestParam(required = false) String collegeId,
            @RequestParam(required = false) String departmentId) {
        
        if (role != null) {
            return ResponseEntity.ok(userService.getUsersByRole(role));
        } else if (collegeId != null) {
            return ResponseEntity.ok(userService.getUsersByCollege(collegeId));
        } else if (departmentId != null) {
            return ResponseEntity.ok(userService.getUsersByDepartment(departmentId));
        }
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable String id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PostMapping("/users")
    public ResponseEntity<User> createUser(
            @RequestBody User user,
            @RequestParam(required = false) String collegeId,
            @RequestParam(required = false) String departmentId) {
        return ResponseEntity.ok(userService.createUser(user, collegeId, departmentId));
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<User> updateUser(@PathVariable String id, @RequestBody User user) {
        return ResponseEntity.ok(userService.updateUser(id, user));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(Map.of("message", "User deleted successfully."));
    }

    @PostMapping("/students/import")
    public ResponseEntity<Map<String, Object>> importStudents(
            @RequestParam("file") MultipartFile file,
            @RequestParam String collegeId,
            @RequestParam String departmentId) {
        
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Uploaded CSV file is empty."));
        }

        List<User> imported = userService.importStudentsFromCSV(file, collegeId, departmentId);
        return ResponseEntity.ok(Map.of(
                "message", "Students imported successfully.",
                "count", imported.size()
        ));
    }
}
