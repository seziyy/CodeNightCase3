package com.example.demo.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
@Table(name = "case_actions")

public class CaseAction {

    @Id
    @Column(name = "action_id")
    private String actionId;

    @ManyToOne
    @JoinColumn(name = "case_id")
    private FraudCase fraudCase;

    private String actionType;
    private String actor;

    @Column(columnDefinition = "TEXT")
    private String note;

    private Instant timestamp;

    // getters & setters
}
