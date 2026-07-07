package com.secureassess.service;

import com.secureassess.entity.Assessment;
import com.secureassess.entity.Question;
import com.secureassess.entity.Subject;
import com.secureassess.repository.AssessmentRepository;
import com.secureassess.repository.QuestionRepository;
import com.secureassess.repository.SubjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final SubjectRepository subjectRepository;
    private final AssessmentRepository assessmentRepository;

    public QuestionService(QuestionRepository questionRepository, SubjectRepository subjectRepository,
                           AssessmentRepository assessmentRepository) {
        this.questionRepository = questionRepository;
        this.subjectRepository = subjectRepository;
        this.assessmentRepository = assessmentRepository;
    }

    @Transactional(readOnly = true)
    public List<Question> getQuestionsBySubject(String subjectId) {
        return questionRepository.findBySubjectId(subjectId);
    }

    @Transactional(readOnly = true)
    public List<Question> getQuestionsByAssessment(String assessmentId) {
        return questionRepository.findByAssessmentId(assessmentId);
    }

    @Transactional(readOnly = true)
    public List<Question> getQuestionBankBySubject(String subjectId) {
        return questionRepository.findBySubjectIdAndAssessmentIsNull(subjectId);
    }

    @Transactional(readOnly = true)
    public Question getQuestionById(String id) {
        return questionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Question not found with ID: " + id));
    }

    public Question createQuestion(Question question, String subjectId, String assessmentId) {
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new IllegalArgumentException("Subject not found with ID: " + subjectId));
        
        question.setSubject(subject);

        if (assessmentId != null) {
            Assessment assessment = assessmentRepository.findById(assessmentId)
                    .orElseThrow(() -> new IllegalArgumentException("Assessment not found with ID: " + assessmentId));
            question.setAssessment(assessment);
        }

        return questionRepository.save(question);
    }

    public Question updateQuestion(String id, Question details) {
        Question question = getQuestionById(id);

        question.setQuestionText(details.getQuestionText());
        question.setQuestionType(details.getQuestionType());
        question.setDifficulty(details.getDifficulty());
        question.setMarks(details.getMarks());
        question.setOptionsJson(details.getOptionsJson());
        question.setCorrectAnswerJson(details.getCorrectAnswerJson());
        question.setTestCasesJson(details.getTestCasesJson());
        question.setProgrammingLanguage(details.getProgrammingLanguage());

        return questionRepository.save(question);
    }

    public void deleteQuestion(String id) {
        Question question = getQuestionById(id);
        questionRepository.delete(question); // Soft delete
    }
}
