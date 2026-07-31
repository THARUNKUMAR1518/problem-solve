package com.secureassess.entity;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "departments")
@Getter
@Setter
public class Department extends BaseEntity {

    private String name;

    @DBRef
    private College college;
}
