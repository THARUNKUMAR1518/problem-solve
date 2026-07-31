package com.secureassess.entity;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "results")
@Getter
@Setter
public class Result {

    @Id
    private String id;

    @DBRef
    private ExamSession examSession;

    @DBRef
    private User student;

    @DBRef
    private Assessment assessment;

    private double scoreObtained = 0.0;
    private double totalScore = 100.0;
    private double percentage = 0.0;
    private double percentile = 100.0;
    private int rank = 1;
    private int timeTakenSeconds;
    private String status = "PASSED"; // PASSED or FAILED
    private LocalDateTime createdAt = LocalDateTime.now();
}
