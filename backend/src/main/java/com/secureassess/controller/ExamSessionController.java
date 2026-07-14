package com.secureassess.controller;

import com.secureassess.entity.*;
import com.secureassess.repository.ExamAnswerRepository;
import com.secureassess.repository.ExamSessionRepository;
import com.secureassess.service.ExamSessionService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/exams/sessions")
public class ExamSessionController {

    private final ExamSessionService examSessionService;
    private final ExamAnswerRepository examAnswerRepository;
    private final ExamSessionRepository examSessionRepository;

    public ExamSessionController(ExamSessionService examSessionService, ExamAnswerRepository examAnswerRepository,
            ExamSessionRepository examSessionRepository) {
        this.examSessionService = examSessionService;
        this.examAnswerRepository = examAnswerRepository;
        this.examSessionRepository = examSessionRepository;
    }

    @PostMapping("/start")
    @PreAuthorize("hasRole('ROLE_STUDENT')")
    public ResponseEntity<ExamSession> startSession(
            @RequestParam String studentId,
            @RequestParam String assessmentId,
            HttpServletRequest request) {

        String ip = request.getRemoteAddr();
        String userAgent = request.getHeader("User-Agent");
        ExamSession session = examSessionService.startSession(studentId, assessmentId, ip, userAgent);
        return ResponseEntity.ok(session);
    }

    @GetMapping("/{id}/answers")
    @PreAuthorize("hasAnyRole('ROLE_SUPER_ADMIN', 'ROLE_COLLEGE_ADMIN', 'ROLE_FACULTY', 'ROLE_STUDENT')")
    public ResponseEntity<List<ExamAnswer>> getSessionAnswers(@PathVariable String id) {
        List<ExamAnswer> answers = examAnswerRepository.findByExamSessionId(id);
        return ResponseEntity.ok(answers);
    }

    @PostMapping("/{id}/answer")
    @PreAuthorize("hasRole('ROLE_STUDENT')")
    public ResponseEntity<ExamAnswer> saveAnswer(
            @PathVariable String id,
            @RequestParam String questionId,
            @RequestParam int remainingTimeSeconds,
            @RequestBody Map<String, String> body) {

        String answerJson = body.get("answerJson");
        ExamAnswer answer = examSessionService.saveAnswer(id, questionId, answerJson, remainingTimeSeconds);
        return ResponseEntity.ok(answer);
    }

    @PostMapping("/{id}/violation")
    @PreAuthorize("hasRole('ROLE_STUDENT')")
    public ResponseEntity<ViolationLog> logViolation(
            @PathVariable String id,
            @RequestParam ViolationType type,
            @RequestBody Map<String, String> body) {

        String description = body.get("description");
        String screenshotUrl = body.get("screenshotUrl");
        ViolationLog log = examSessionService.logViolation(id, type, description, screenshotUrl);
        return ResponseEntity.ok(log);
    }

    @PostMapping("/{id}/submit")
    @PreAuthorize("hasRole('ROLE_STUDENT')")
    public ResponseEntity<ExamSession> submitExam(
            @PathVariable String id,
            @RequestParam SessionStatus status) {

        if (status != SessionStatus.SUBMITTED && status != SessionStatus.FORCE_SUBMITTED) {
            return ResponseEntity.badRequest().build();
        }
        ExamSession session = examSessionService.submitSession(id, status);
        return ResponseEntity.ok(session);
    }

    @GetMapping("/assessment/{assessmentId}")
    @PreAuthorize("hasAnyRole('ROLE_SUPER_ADMIN', 'ROLE_COLLEGE_ADMIN', 'ROLE_FACULTY')")
    public ResponseEntity<List<ExamSession>> getSessionsByAssessment(@PathVariable String assessmentId) {
        return ResponseEntity.ok(examSessionRepository.findByAssessmentId(assessmentId));
    }

    @PutMapping("/answers/{ansId}/grade")
    @PreAuthorize("hasAnyRole('ROLE_SUPER_ADMIN', 'ROLE_COLLEGE_ADMIN', 'ROLE_FACULTY')")
    public ResponseEntity<ExamAnswer> gradeAnswer(
            @PathVariable String ansId,
            @RequestParam double score,
            @RequestParam boolean isCorrect,
            @RequestParam String feedback) {
        ExamAnswer answer = examAnswerRepository.findById(ansId)
                .orElseThrow(() -> new IllegalArgumentException("Answer not found with ID: " + ansId));
        answer.setMarksObtained(score);
        answer.setIsCorrect(isCorrect);
        answer.setFeedback(feedback);
        answer.setEvaluated(true);
        return ResponseEntity.ok(examAnswerRepository.save(answer));
    }
}
