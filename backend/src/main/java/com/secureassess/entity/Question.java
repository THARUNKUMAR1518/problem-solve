package com.secureassess.entity;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "questions")
@Getter
@Setter
public class Question extends BaseEntity {

    @DBRef
    private Subject subject;

    @DBRef
    private Assessment assessment; // Nullable

    private String questionText;
    private QuestionType questionType;
    private DifficultyLevel difficulty = DifficultyLevel.MEDIUM;
    private int marks = 1;
    private String optionsJson;
    private String correctAnswerJson;
    private String testCasesJson;
    private String programmingLanguage;
}
