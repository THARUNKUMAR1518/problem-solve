package com.secureassess.repository;

import com.secureassess.entity.ViolationLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ViolationLogRepository extends MongoRepository<ViolationLog, String> {
    List<ViolationLog> findByExamSessionId(String examSessionId);
}
