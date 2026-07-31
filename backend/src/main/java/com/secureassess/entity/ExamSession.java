package com.secureassess.entity;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "exam_sessions")
@Getter
@Setter
public class ExamSession extends BaseEntity {

    @DBRef
    private User student;

    @DBRef
    private Assessment assessment;

    private SessionStatus status = SessionStatus.NOT_STARTED;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    private int currentWarningCount = 0;
    private int remainingTimeSeconds;
    private String clientIp;
    private String userAgent;
}
