package com.secureassess.repository;

import com.secureassess.entity.Assessment;
import com.secureassess.entity.AssessmentStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssessmentRepository extends MongoRepository<Assessment, String> {
    List<Assessment> findBySubjectId(String subjectId);
    List<Assessment> findByCreatedById(String userId);
    List<Assessment> findByStatus(AssessmentStatus status);
    List<Assessment> findByStatusIn(List<AssessmentStatus> statuses);
}
