package com.secureassess.entity;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "courses")
@Getter
@Setter
public class Course extends BaseEntity {

    private String name;
    private String code;

    @DBRef
    private Department department;
}
