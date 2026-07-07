package com.secureassess.repository;

import com.secureassess.entity.ExamAnswer;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExamAnswerRepository extends MongoRepository<ExamAnswer, String> {
    List<ExamAnswer> findByExamSessionId(String examSessionId);
    Optional<ExamAnswer> findByExamSessionIdAndQuestionId(String examSessionId, String questionId);
}
