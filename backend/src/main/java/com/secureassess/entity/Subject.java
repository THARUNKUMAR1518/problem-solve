package com.secureassess.entity;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "subjects")
@Getter
@Setter
public class Subject extends BaseEntity {

    private String name;
    private String code;

    @DBRef
    private Course course;
}
