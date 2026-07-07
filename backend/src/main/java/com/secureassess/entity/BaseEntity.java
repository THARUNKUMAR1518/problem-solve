package com.secureassess.entity;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import java.time.LocalDateTime;

@Getter
@Setter
public abstract class BaseEntity {

    @Id
    private String id;

    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();

    private boolean deleted = false;
}
