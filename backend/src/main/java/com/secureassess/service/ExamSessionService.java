package com.secureassess.service;

import com.secureassess.entity.*;
import com.secureassess.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ExamSessionService {

    private final ExamSessionRepository examSessionRepository;
    private final ExamAnswerRepository examAnswerRepository;
    private final ViolationLogRepository violationLogRepository;
    private final UserRepository userRepository;
    private final AssessmentRepository assessmentRepository;
    private final QuestionRepository questionRepository;

    public ExamSessionService(ExamSessionRepository examSessionRepository, ExamAnswerRepository examAnswerRepository,
                              ViolationLogRepository violationLogRepository, UserRepository userRepository,
                              AssessmentRepository assessmentRepository, QuestionRepository questionRepository) {
        this.examSessionRepository = examSessionRepository;
        this.examAnswerRepository = examAnswerRepository;
        this.violationLogRepository = violationLogRepository;
        this.userRepository = userRepository;
        this.assessmentRepository = assessmentRepository;
        this.questionRepository = questionRepository;
    }

    public ExamSession startSession(String studentId, String assessmentId, String ip, String userAgent) {
        // If session already exists, resume it
        Optional<ExamSession> existing = examSessionRepository.findByStudentIdAndAssessmentId(studentId, assessmentId);
        if (existing.isPresent()) {
            ExamSession session = existing.get();
            if (session.getStatus() == SessionStatus.IN_PROGRESS) {
                return session; // Resume
            }
            throw new IllegalArgumentException("Exam has already been submitted or locked.");
        }

        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found."));
        Assessment assessment = assessmentRepository.findById(assessmentId)
                .orElseThrow(() -> new IllegalArgumentException("Assessment not found."));

        if (assessment.getStatus() != AssessmentStatus.ACTIVE) {
            throw new IllegalArgumentException("Assessment is not currently active.");
        }

        ExamSession session = new ExamSession();
        session.setStudent(student);
        session.setAssessment(assessment);
        session.setStatus(SessionStatus.IN_PROGRESS);
        session.setStartedAt(LocalDateTime.now());
        session.setClientIp(ip);
        session.setUserAgent(userAgent);
        session.setRemainingTimeSeconds(assessment.getDurationMinutes() * 60);

        session = examSessionRepository.save(session);

        // If random question draw is configured, copy a random subset from bank to target
        if (assessment.getRandomQuestionsCount() > 0) {
            List<Question> bank = questionRepository.findBySubjectIdAndAssessmentIsNull(assessment.getSubject().getId());
            Collections.shuffle(bank);
            int count = Math.min(assessment.getRandomQuestionsCount(), bank.size());
            for (int i = 0; i < count; i++) {
                Question q = bank.get(i);
                createEmptyAnswer(session, q);
            }
        } else {
            // Copy all manually assigned questions
            List<Question> questions = questionRepository.findByAssessmentId(assessmentId);
            for (Question q : questions) {
                createEmptyAnswer(session, q);
            }
        }

        return session;
    }

    private void createEmptyAnswer(ExamSession session, Question question) {
        ExamAnswer answer = new ExamAnswer();
        answer.setExamSession(session);
        answer.setQuestion(question);
        answer.setStudentAnswerJson(null);
        answer.setEvaluated(false);
        examAnswerRepository.save(answer);
    }

    public ExamAnswer saveAnswer(String sessionId, String questionId, String answerJson, int remainingSeconds) {
        ExamSession session = examSessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session not found."));
        
        if (session.getStatus() != SessionStatus.IN_PROGRESS) {
            throw new IllegalArgumentException("Session is not in progress.");
        }

        session.setRemainingTimeSeconds(remainingSeconds);
        examSessionRepository.save(session);

        ExamAnswer answer = examAnswerRepository.findByExamSessionIdAndQuestionId(sessionId, questionId)
                .orElseThrow(() -> new IllegalArgumentException("Question not mapped to this session."));

        answer.setStudentAnswerJson(answerJson);
        return examAnswerRepository.save(answer);
    }

    public ViolationLog logViolation(String sessionId, ViolationType type, String description, String screenshotUrl) {
        ExamSession session = examSessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session not found."));

        if (session.getStatus() != SessionStatus.IN_PROGRESS) {
            throw new IllegalArgumentException("Session is not active.");
        }

        int warningWeight = (type == ViolationType.MULTIPLE_FACES) ? 2 : 1;
        
        ViolationLog log = new ViolationLog();
        log.setExamSession(session);
        log.setViolationType(type);
        log.setWarningIncrement(warningWeight);
        log.setDescription(description);
        log.setScreenshotUrl(screenshotUrl);
        log = violationLogRepository.save(log);

        session.setCurrentWarningCount(session.getCurrentWarningCount() + warningWeight);
        examSessionRepository.save(session);

        // Auto submit if warning count exceeds limit configured by the Admin
        int maxAllowed = session.getAssessment().getMaxWarnings();
        if (session.getCurrentWarningCount() >= maxAllowed) {
            submitSession(sessionId, SessionStatus.FORCE_SUBMITTED);
        }

        return log;
    }

    public ExamSession submitSession(String sessionId, SessionStatus completionStatus) {
        ExamSession session = examSessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session not found."));

        if (session.getStatus() == SessionStatus.SUBMITTED || session.getStatus() == SessionStatus.FORCE_SUBMITTED) {
            return session; // Already submitted
        }

        session.setStatus(completionStatus);
        session.setCompletedAt(LocalDateTime.now());
        session = examSessionRepository.save(session);

        // Auto evaluate objective multiple choice questions immediately upon submission
        autoEvaluateMCQs(session);

        return session;
    }

    private void autoEvaluateMCQs(ExamSession session) {
        List<ExamAnswer> answers = examAnswerRepository.findByExamSessionId(session.getId());
        for (ExamAnswer answer : answers) {
            Question q = answer.getQuestion();
            if (q.getQuestionType() == QuestionType.OBJECTIVE) {
                String studentAns = answer.getStudentAnswerJson();
                String correctAns = q.getCorrectAnswerJson();
                
                if (studentAns != null && studentAns.trim().equalsIgnoreCase(correctAns.trim())) {
                    answer.setIsCorrect(true);
                    answer.setMarksObtained(q.getMarks());
                } else {
                    answer.setIsCorrect(false);
                    // Handle negative marking if enabled
                    if (session.getAssessment().isNegativeMarking() && studentAns != null) {
                        answer.setMarksObtained(-session.getAssessment().getNegativeMarksPerQuestion());
                    } else {
                        answer.setMarksObtained(0.0);
                    }
                }
                answer.setEvaluated(true);
                examAnswerRepository.save(answer);
            }
        }
    }
}
