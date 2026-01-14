package com.example.demo.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "risk_rules")

public class RiskRule {

    @Id
    @Column(name = "rule_id")
    private String ruleId;

    @Column(columnDefinition = "TEXT")
    private String condition;

    private String action;
    private int priority;

    @Column(name = "is_active")
    private boolean isActive;

    // getters & setters
}