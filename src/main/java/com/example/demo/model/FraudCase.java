package com.example.demo.model;

import com.example.demo.model.enums.CasePriority;
import com.example.demo.model.enums.CaseStatus;
import com.example.demo.model.enums.Opened_by;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "fraud_cases")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FraudCase {

    @Id
    @Column(name = "case_id")
    private String caseId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "opened_by", nullable = false)
    private Opened_by openedBy;

    @Column(name = "case_type")
    private String caseType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CaseStatus status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CasePriority priority;

    @Column(name = "opened_at", nullable = false)
    private Instant openedAt;
}
