package com.example.demo.model;

import com.example.demo.model.enums.CasePriority;
import com.example.demo.model.enums.CaseStatus;
import com.example.demo.model.enums.Opened_by;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "fraud_cases")

public class FraudCase {

    @Id
    @Column(name = "case_id")
    private String caseId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Opened_by openedBy;

    private String caseType;
    @Enumerated(EnumType.STRING)
    private CaseStatus status;

    @Enumerated(EnumType.STRING)
    private CasePriority priority;

    private Instant openedAt;



}