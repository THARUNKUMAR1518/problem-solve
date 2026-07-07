package com.secureassess.entity;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "violation_logs")
@Getter
@Setter
public class ViolationLog {

    @Id
    private String id;

    @DBRef
    private ExamSession examSession;

    private ViolationType violationType;
    private int warningIncrement = 1;
    private String description;
    private LocalDateTime timestamp = LocalDateTime.now();
    private String screenshotUrl;
}
