package com.secureassess.entity;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "exam_answers")
@Getter
@Setter
public class ExamAnswer extends BaseEntity {

    @DBRef
    private ExamSession examSession;

    @DBRef
    private Question question;

    private String studentAnswerJson;
    private Boolean isCorrect;
    private double marksObtained = 0.0;
    private boolean evaluated = false;
    private String feedback;
}
