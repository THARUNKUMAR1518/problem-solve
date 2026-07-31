package com.secureassess.controller;

import com.secureassess.entity.Assessment;
import com.secureassess.entity.AssessmentStatus;
import com.secureassess.service.AssessmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/assessments")
public class AssessmentController {

    private final AssessmentService assessmentService;

    public AssessmentController(AssessmentService assessmentService) {
        this.assessmentService = assessmentService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ROLE_SUPER_ADMIN')")
    public ResponseEntity<List<Assessment>> getAllAssessments() {
        return ResponseEntity.ok(assessmentService.getAllAssessments());
    }

    @GetMapping("/active")
    @PreAuthorize("hasAnyRole('ROLE_SUPER_ADMIN', 'ROLE_COLLEGE_ADMIN', 'ROLE_FACULTY', 'ROLE_STUDENT')")
    public ResponseEntity<List<Assessment>> getActiveAssessments() {
        return ResponseEntity.ok(assessmentService.getActiveAssessments());
    }

    @GetMapping("/subject/{subjectId}")
    @PreAuthorize("hasAnyRole('ROLE_SUPER_ADMIN', 'ROLE_COLLEGE_ADMIN', 'ROLE_FACULTY', 'ROLE_STUDENT')")
    public ResponseEntity<List<Assessment>> getAssessmentsBySubject(@PathVariable String subjectId) {
        return ResponseEntity.ok(assessmentService.getAssessmentsBySubject(subjectId));
    }

    @GetMapping("/creator/{userId}")
    @PreAuthorize("hasAnyRole('ROLE_SUPER_ADMIN', 'ROLE_COLLEGE_ADMIN', 'ROLE_FACULTY')")
    public ResponseEntity<List<Assessment>> getAssessmentsByCreator(@PathVariable String userId) {
        return ResponseEntity.ok(assessmentService.getAssessmentsByCreator(userId));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_SUPER_ADMIN', 'ROLE_COLLEGE_ADMIN', 'ROLE_FACULTY', 'ROLE_STUDENT')")
    public ResponseEntity<Assessment> getAssessmentById(@PathVariable String id) {
        return ResponseEntity.ok(assessmentService.getAssessmentById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ROLE_SUPER_ADMIN', 'ROLE_COLLEGE_ADMIN', 'ROLE_FACULTY')")
    public ResponseEntity<Assessment> createAssessment(
            @RequestBody Assessment assessment,
            @RequestParam String subjectId,
            @RequestParam String creatorId) {
        return ResponseEntity.ok(assessmentService.createAssessment(assessment, subjectId, creatorId));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_SUPER_ADMIN', 'ROLE_COLLEGE_ADMIN', 'ROLE_FACULTY')")
    public ResponseEntity<Assessment> updateAssessment(
            @PathVariable String id,
            @RequestBody Assessment assessment) {
        return ResponseEntity.ok(assessmentService.updateAssessment(id, assessment));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_SUPER_ADMIN', 'ROLE_COLLEGE_ADMIN', 'ROLE_FACULTY')")
    public ResponseEntity<Map<String, String>> deleteAssessment(@PathVariable String id) {
        assessmentService.deleteAssessment(id);
        return ResponseEntity.ok(Map.of("message", "Assessment deleted successfully."));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ROLE_SUPER_ADMIN', 'ROLE_COLLEGE_ADMIN', 'ROLE_FACULTY')")
    public ResponseEntity<Assessment> updateStatus(
            @PathVariable String id,
            @RequestParam AssessmentStatus status) {
        return ResponseEntity.ok(assessmentService.updateStatus(id, status));
    }
}
