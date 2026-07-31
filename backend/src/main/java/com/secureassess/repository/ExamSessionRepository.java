package com.secureassess.repository;

import com.secureassess.entity.ExamSession;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExamSessionRepository extends MongoRepository<ExamSession, String> {
    Optional<ExamSession> findByStudentIdAndAssessmentId(String studentId, String assessmentId);
    List<ExamSession> findByStudentId(String studentId);
    List<ExamSession> findByAssessmentId(String assessmentId);
}
