package com.secureassess.controller;

import com.secureassess.entity.Question;
import com.secureassess.service.QuestionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/questions")
public class QuestionController {

    private final QuestionService questionService;

    public QuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }

    @GetMapping("/subject/{subjectId}")
    @PreAuthorize("hasAnyRole('ROLE_SUPER_ADMIN', 'ROLE_COLLEGE_ADMIN', 'ROLE_FACULTY')")
    public ResponseEntity<List<Question>> getQuestionsBySubject(@PathVariable String subjectId) {
        return ResponseEntity.ok(questionService.getQuestionsBySubject(subjectId));
    }

    @GetMapping("/assessment/{assessmentId}")
    @PreAuthorize("hasAnyRole('ROLE_SUPER_ADMIN', 'ROLE_COLLEGE_ADMIN', 'ROLE_FACULTY', 'ROLE_STUDENT')")
    public ResponseEntity<List<Question>> getQuestionsByAssessment(@PathVariable String assessmentId) {
        return ResponseEntity.ok(questionService.getQuestionsByAssessment(assessmentId));
    }

    @GetMapping("/bank/{subjectId}")
    @PreAuthorize("hasAnyRole('ROLE_SUPER_ADMIN', 'ROLE_COLLEGE_ADMIN', 'ROLE_FACULTY')")
    public ResponseEntity<List<Question>> getQuestionBankBySubject(@PathVariable String subjectId) {
        return ResponseEntity.ok(questionService.getQuestionBankBySubject(subjectId));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_SUPER_ADMIN', 'ROLE_COLLEGE_ADMIN', 'ROLE_FACULTY')")
    public ResponseEntity<Question> getQuestionById(@PathVariable String id) {
        return ResponseEntity.ok(questionService.getQuestionById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ROLE_SUPER_ADMIN', 'ROLE_COLLEGE_ADMIN', 'ROLE_FACULTY')")
    public ResponseEntity<Question> createQuestion(
            @RequestBody Question question,
            @RequestParam String subjectId,
            @RequestParam(required = false) String assessmentId) {
        return ResponseEntity.ok(questionService.createQuestion(question, subjectId, assessmentId));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_SUPER_ADMIN', 'ROLE_COLLEGE_ADMIN', 'ROLE_FACULTY')")
    public ResponseEntity<Question> updateQuestion(
            @PathVariable String id,
            @RequestBody Question question) {
        return ResponseEntity.ok(questionService.updateQuestion(id, question));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_SUPER_ADMIN', 'ROLE_COLLEGE_ADMIN', 'ROLE_FACULTY')")
    public ResponseEntity<Map<String, String>> deleteQuestion(@PathVariable String id) {
        questionService.deleteQuestion(id);
        return ResponseEntity.ok(Map.of("message", "Question deleted successfully."));
    }
}
