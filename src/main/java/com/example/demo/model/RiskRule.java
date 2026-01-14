package com.example.demo.model;

import com.example.demo.model.enums.MetaType;
import com.example.demo.model.enums.RiskAction;
import jakarta.persistence.*;
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




    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RiskAction action;
    @Column(nullable = false)
    private int priority;

    @Column(name = "is_active", nullable = false)
    private boolean isActive;

}