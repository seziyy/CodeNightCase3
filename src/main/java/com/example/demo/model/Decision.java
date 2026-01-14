package com.example.demo.model;

import com.example.demo.model.enums.RiskAction;
import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "decision_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Decision {

    @Id
    @Column(name = "decision_id")
    private String decisionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /**
     * JSON array string
     * Example: ["RR-01","RR-02"]
     */
    @Column(columnDefinition = "TEXT", nullable = false)
    private String triggeredRules;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RiskAction selectedAction;

    /**
     * JSON array string
     * Example: ["PAYMENT_REVIEW"]
     */
    @Column(columnDefinition = "TEXT")
    private String suppressedActions;

    @Column(nullable = false)
    private Instant timestamp;
}
