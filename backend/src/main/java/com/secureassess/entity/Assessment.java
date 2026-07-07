package com.secureassess.entity;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "assessments")
@Getter
@Setter
public class Assessment extends BaseEntity {

    private String title;
    private String description;

    @DBRef
    private Subject subject;

    @DBRef
    private User createdBy;

    private int durationMinutes = 60;
    private int totalMarks = 100;
    private int passingMarks = 40;
    private int randomQuestionsCount = 0;
    private int maxWarnings = 3;
    private boolean negativeMarking = false;
    private double negativeMarksPerQuestion = 0.0;
    private boolean shuffleQuestions = false;
    private boolean shuffleOptions = false;
    private AssessmentStatus status = AssessmentStatus.DRAFT;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
}
