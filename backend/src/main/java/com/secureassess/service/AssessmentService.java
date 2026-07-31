package com.secureassess.service;

import com.secureassess.entity.Assessment;
import com.secureassess.entity.AssessmentStatus;
import com.secureassess.entity.Question;
import com.secureassess.entity.Subject;
import com.secureassess.entity.User;
import com.secureassess.repository.AssessmentRepository;
import com.secureassess.repository.QuestionRepository;
import com.secureassess.repository.SubjectRepository;
import com.secureassess.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;

@Service
@Transactional
public class AssessmentService {

    private final AssessmentRepository assessmentRepository;
    private final SubjectRepository subjectRepository;
    private final UserRepository userRepository;
    private final QuestionRepository questionRepository;

    public AssessmentService(AssessmentRepository assessmentRepository, SubjectRepository subjectRepository,
                             UserRepository userRepository, QuestionRepository questionRepository) {
        this.assessmentRepository = assessmentRepository;
        this.subjectRepository = subjectRepository;
        this.userRepository = userRepository;
        this.questionRepository = questionRepository;
    }

    @Transactional(readOnly = true)
    public List<Assessment> getAllAssessments() {
        return assessmentRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Assessment> getActiveAssessments() {
        return assessmentRepository.findByStatusIn(List.of(AssessmentStatus.ACTIVE, AssessmentStatus.SCHEDULED));
    }

    @Transactional(readOnly = true)
    public List<Assessment> getAssessmentsBySubject(String subjectId) {
        return assessmentRepository.findBySubjectId(subjectId);
    }

    @Transactional(readOnly = true)
    public List<Assessment> getAssessmentsByCreator(String userId) {
        return assessmentRepository.findByCreatedById(userId);
    }

    @Transactional(readOnly = true)
    public Assessment getAssessmentById(String id) {
        return assessmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Assessment not found with ID: " + id));
    }

    public Assessment createAssessment(Assessment assessment, String subjectId, String creatorId) {
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new IllegalArgumentException("Subject not found with ID: " + subjectId));
        User creator = userRepository.findById(creatorId)
                .orElseThrow(() -> new IllegalArgumentException("Faculty user not found with ID: " + creatorId));

        assessment.setSubject(subject);
        assessment.setCreatedBy(creator);
        assessment.setStatus(AssessmentStatus.DRAFT);

        Assessment saved = assessmentRepository.save(assessment);

        if (saved.getRandomQuestionsCount() > 0) {
            populateRandomQuestionsFromBank(saved);
        }

        return saved;
    }

    public Assessment updateAssessment(String id, Assessment details) {
        Assessment assessment = getAssessmentById(id);

        boolean randomCountChanged = details.getRandomQuestionsCount() > 0 && 
                                     details.getRandomQuestionsCount() != assessment.getRandomQuestionsCount();

        assessment.setTitle(details.getTitle());
        assessment.setDescription(details.getDescription());
        assessment.setDurationMinutes(details.getDurationMinutes());
        assessment.setTotalMarks(details.getTotalMarks());
        assessment.setPassingMarks(details.getPassingMarks());
        assessment.setRandomQuestionsCount(details.getRandomQuestionsCount());
        assessment.setMaxWarnings(details.getMaxWarnings());
        assessment.setNegativeMarking(details.isNegativeMarking());
        assessment.setNegativeMarksPerQuestion(details.getNegativeMarksPerQuestion());
        assessment.setShuffleQuestions(details.isShuffleQuestions());
        assessment.setShuffleOptions(details.isShuffleOptions());
        assessment.setStartTime(details.getStartTime());
        assessment.setEndTime(details.getEndTime());
        assessment.setStatus(details.getStatus());

        Assessment saved = assessmentRepository.save(assessment);

        if (randomCountChanged) {
            questionRepository.deleteByAssessmentId(saved.getId());
            populateRandomQuestionsFromBank(saved);
        }

        return saved;
    }

    private void populateRandomQuestionsFromBank(Assessment assessment) {
        List<Question> pool = questionRepository.findBySubjectIdAndAssessmentIsNull(assessment.getSubject().getId());
        if (pool.isEmpty()) {
            return;
        }
        Collections.shuffle(pool);
        int count = Math.min(assessment.getRandomQuestionsCount(), pool.size());
        List<Question> selected = pool.subList(0, count);

        for (Question q : selected) {
            Question clone = new Question();
            clone.setSubject(assessment.getSubject());
            clone.setAssessment(assessment);
            clone.setQuestionText(q.getQuestionText());
            clone.setQuestionType(q.getQuestionType());
            clone.setDifficulty(q.getDifficulty());
            clone.setMarks(q.getMarks());
            clone.setOptionsJson(q.getOptionsJson());
            clone.setCorrectAnswerJson(q.getCorrectAnswerJson());
            clone.setTestCasesJson(q.getTestCasesJson());
            clone.setProgrammingLanguage(q.getProgrammingLanguage());

            questionRepository.save(clone);
        }
    }

    public void deleteAssessment(String id) {
        Assessment assessment = getAssessmentById(id);
        assessmentRepository.delete(assessment); // Soft delete
    }

    public Assessment updateStatus(String id, AssessmentStatus status) {
        Assessment assessment = getAssessmentById(id);
        assessment.setStatus(status);
        return assessmentRepository.save(assessment);
    }
}
