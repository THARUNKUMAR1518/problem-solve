package com.secureassess.entity;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "colleges")
@Getter
@Setter
public class College extends BaseEntity {

    private String name;
    private String code;
    private String address;
    private boolean active = true;
}
