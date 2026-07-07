package com.secureassess.repository;

import com.secureassess.entity.Question;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends MongoRepository<Question, String> {
    List<Question> findBySubjectId(String subjectId);
    List<Question> findByAssessmentId(String assessmentId);
    List<Question> findBySubjectIdAndAssessmentIsNull(String subjectId);
    void deleteByAssessmentId(String assessmentId);
}
