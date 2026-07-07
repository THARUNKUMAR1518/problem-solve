package com.secureassess.repository;

import com.secureassess.entity.Result;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResultRepository extends MongoRepository<Result, String> {
    List<Result> findByStudentId(String studentId);
    List<Result> findByAssessmentId(String assessmentId);
    Optional<Result> findByExamSessionId(String examSessionId);
}
